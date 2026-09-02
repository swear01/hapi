from pathlib import Path
import os
import subprocess
import tempfile
import unittest


SCRIPT = Path(__file__).resolve().parents[1] / 'sync-from-upstream.sh'


def run(*args, cwd=None, env=None, check=True):
    result = subprocess.run(args, cwd=cwd, env=env, text=True, capture_output=True)
    if check and result.returncode != 0:
        raise AssertionError(result.stdout + result.stderr)
    return result


class SyncFromUpstreamTest(unittest.TestCase):
    def setUp(self):
        self.assertTrue(SCRIPT.is_file(), f'missing workflow command: {SCRIPT}')
        self.tmp = tempfile.TemporaryDirectory()
        root = Path(self.tmp.name)
        self.upstream = root / 'upstream.git'
        self.origin = root / 'origin.git'
        self.seed = root / 'seed'
        self.repo = root / 'repo'
        self.patch_dir = root / 'maintenance' / 'patches'
        self.manifest = root / 'maintenance' / 'manifest.tsv'
        self.pr_audit = root / 'maintenance' / 'pr-audit.tsv'
        self.patch_dir.mkdir(parents=True)
        run('git', 'init', '--bare', str(self.upstream))
        run('git', 'init', '--bare', str(self.origin))
        run('git', 'init', str(self.seed))
        run('git', '-C', str(self.seed), 'config', 'user.name', 'Test')
        run('git', '-C', str(self.seed), 'config', 'user.email', 'test@example.com')
        (self.seed / 'value.txt').write_text('upstream\n')
        run('git', '-C', str(self.seed), 'add', 'value.txt')
        run('git', '-C', str(self.seed), 'commit', '-m', 'upstream')
        run('git', '-C', str(self.seed), 'branch', '-M', 'main')
        run('git', '-C', str(self.seed), 'remote', 'add', 'upstream', str(self.upstream))
        run('git', '-C', str(self.seed), 'remote', 'add', 'origin', str(self.origin))
        run('git', '-C', str(self.seed), 'push', 'upstream', 'main')
        run('git', '-C', str(self.seed), 'push', 'origin', 'main')
        self.upstream_sha = run(
            'git', '-C', str(self.seed), 'rev-parse', 'upstream/main'
        ).stdout.strip()
        self.previous_upstream_sha = os.environ.get('HAPI_UPSTREAM_SHA')
        os.environ['HAPI_UPSTREAM_SHA'] = self.upstream_sha
        (self.seed / 'value.txt').write_text('patched\n')
        run('git', '-C', str(self.seed), 'commit', '-am', 'fork patch')
        self.fork_commit = run('git', '-C', str(self.seed), 'rev-parse', 'HEAD').stdout.strip()
        patch = run('git', '-C', str(self.seed), 'format-patch', '-1', '--stdout').stdout
        (self.patch_dir / '0001.patch').write_text(patch)
        run('git', '-C', str(self.seed), 'push', 'upstream', 'HEAD:refs/pull/1315/head')
        run('git', '-C', str(self.seed), 'push', 'origin', 'HEAD:main')
        run('git', 'clone', str(self.origin), str(self.repo))
        run('git', '-C', str(self.repo), 'remote', 'add', 'upstream', str(self.upstream))
        self.manifest.write_text(f'0001.patch\tcarry\ttest\t{self.fork_commit}\n')

    def tearDown(self):
        if self.previous_upstream_sha is None:
            os.environ.pop('HAPI_UPSTREAM_SHA', None)
        else:
            os.environ['HAPI_UPSTREAM_SHA'] = self.previous_upstream_sha
        self.tmp.cleanup()

    def test_rehearses_reset_and_patch_without_pushing(self):
        before = run('git', '--git-dir', str(self.origin), 'rev-parse', 'main').stdout.strip()
        result = run(str(SCRIPT), '--repo', str(self.repo), '--patch-dir', str(self.patch_dir), '--manifest', str(self.manifest), '--skip-tests')
        after = run('git', '--git-dir', str(self.origin), 'rev-parse', 'main').stdout.strip()
        self.assertEqual(before, after)
        self.assertIn('TREE_MATCHES_ORIGIN_MAIN', result.stdout)
        self.assertIn('REHEARSAL_OK', result.stdout)

    def test_does_not_overwrite_checkout_git_identity(self):
        run('git', '-C', str(self.repo), 'config', 'user.name', 'Original Developer')
        run('git', '-C', str(self.repo), 'config', 'user.email', 'original@example.com')

        result = run(
            str(SCRIPT), '--repo', str(self.repo), '--patch-dir', str(self.patch_dir),
            '--manifest', str(self.manifest), '--skip-tests', check=False,
        )

        self.assertEqual(0, result.returncode, result.stdout + result.stderr)
        self.assertEqual('Original Developer', run('git', '-C', str(self.repo), 'config', 'user.name').stdout.strip())
        self.assertEqual('original@example.com', run('git', '-C', str(self.repo), 'config', 'user.email').stdout.strip())

    def test_uses_configured_agent_worktree_root(self):
        worktree_root = Path(self.tmp.name) / 'agent-worktrees'
        env = os.environ | {'HAPI_WORKTREE_ROOT': str(worktree_root)}

        result = run(
            str(SCRIPT), '--repo', str(self.repo), '--patch-dir', str(self.patch_dir),
            '--manifest', str(self.manifest), '--skip-tests', env=env,
        )

        self.assertIn(f'REHEARSAL_WORKTREE={worktree_root}/', result.stdout)
        self.assertEqual([], list(worktree_root.iterdir()))

    def test_rehearses_from_an_isolated_worktree(self):
        worktree = Path(self.tmp.name) / 'worktree'
        run('git', '-C', str(self.repo), 'worktree', 'add', str(worktree), 'origin/main')

        result = run(str(SCRIPT), '--repo', str(worktree), '--patch-dir', str(self.patch_dir), '--manifest', str(self.manifest), '--skip-tests', check=False)

        self.assertEqual(0, result.returncode, result.stdout + result.stderr)
        self.assertIn('REHEARSAL_OK', result.stdout)

    def test_accepts_release_paths_relative_to_the_checkout(self):
        maintenance = self.repo / 'maintenance'
        patch_dir = maintenance / 'patches'
        patch_dir.mkdir(parents=True)
        (patch_dir / '0001.patch').write_text((self.patch_dir / '0001.patch').read_text())
        manifest = maintenance / 'manifest.tsv'
        manifest.write_text(self.manifest.read_text())

        result = run(
            str(SCRIPT),
            '--repo', '.',
            '--patch-dir', 'maintenance/patches',
            '--manifest', 'maintenance/manifest.tsv',
            '--skip-tests',
            cwd=self.repo,
            check=False,
        )

        self.assertEqual(0, result.returncode, result.stdout + result.stderr)
        self.assertIn('REHEARSAL_OK', result.stdout)

    def test_refreshes_origin_tracking_ref_after_force_rewrite(self):
        run('git', '-C', str(self.seed), 'reset', '--hard', 'upstream/main')
        (self.seed / 'replacement.txt').write_text('replacement\n')
        run('git', '-C', str(self.seed), 'add', 'replacement.txt')
        run('git', '-C', str(self.seed), 'commit', '-m', 'replacement')
        replacement_commit = run('git', '-C', str(self.seed), 'rev-parse', 'HEAD').stdout.strip()
        replacement_patch = run('git', '-C', str(self.seed), 'format-patch', '-1', '--stdout').stdout
        (self.patch_dir / '0001.patch').write_text(replacement_patch)
        self.manifest.write_text(f'0001.patch\tcarry\ttest\t{replacement_commit}\n')
        run('git', '-C', str(self.seed), 'push', '--force', 'origin', 'HEAD:main')

        result = run(str(SCRIPT), '--repo', str(self.repo), '--patch-dir', str(self.patch_dir), '--manifest', str(self.manifest), '--skip-tests', check=False)

        self.assertEqual(0, result.returncode, result.stdout + result.stderr)
        self.assertIn('REHEARSAL_OK', result.stdout)

    def test_requires_pinned_upstream_head(self):
        env = {key: value for key, value in os.environ.items() if key != 'HAPI_UPSTREAM_SHA'}

        result = run(
            str(SCRIPT), '--repo', str(self.repo), '--patch-dir', str(self.patch_dir),
            '--manifest', str(self.manifest), '--skip-tests', env=env, check=False,
        )

        self.assertNotEqual(0, result.returncode)
        self.assertIn('HAPI_UPSTREAM_SHA', result.stderr)

    def test_rejects_unexpected_upstream_head(self):
        env = os.environ | {'HAPI_UPSTREAM_SHA': '0' * 40}

        result = run(
            str(SCRIPT), '--repo', str(self.repo), '--patch-dir', str(self.patch_dir),
            '--manifest', str(self.manifest), '--skip-tests', env=env, check=False,
        )

        self.assertNotEqual(0, result.returncode)
        self.assertIn('UPSTREAM_HEAD_MISMATCH', result.stderr)

    def test_enforces_manifest_upstream_pin(self):
        self.manifest.write_text(
            f'# upstream_sha={"0" * 40}\n'
            f'0001.patch\tcarry\ttest\t{self.fork_commit}\n'
        )

        result = run(
            str(SCRIPT), '--repo', str(self.repo), '--patch-dir', str(self.patch_dir),
            '--manifest', str(self.manifest), '--skip-tests', check=False,
        )

        self.assertNotEqual(0, result.returncode)
        self.assertIn('MANIFEST_UPSTREAM_SHA_MISMATCH', result.stderr)

    def test_enforces_manifest_previous_origin_pin(self):
        self.manifest.write_text(
            f'# previous_origin_main={"0" * 40}\n'
            f'0001.patch\tcarry\ttest\t{self.fork_commit}\n'
        )

        result = run(
            str(SCRIPT), '--repo', str(self.repo), '--patch-dir', str(self.patch_dir),
            '--manifest', str(self.manifest), '--skip-tests', check=False,
        )

        self.assertNotEqual(0, result.returncode)
        self.assertIn('MANIFEST_ORIGIN_SHA_MISMATCH', result.stderr)

    def test_rejects_replay_tree_that_misses_manifest_expectation(self):
        self.manifest.write_text(
            f'# expected_source_tree={"0" * 40}\n'
            f'0001.patch\tcarry\ttest\t{self.fork_commit}\n'
        )

        result = run(
            str(SCRIPT), '--repo', str(self.repo), '--patch-dir', str(self.patch_dir),
            '--manifest', str(self.manifest), '--skip-tests', check=False,
        )

        self.assertNotEqual(0, result.returncode)
        self.assertIn('REPLAY_TREE_MISMATCH', result.stderr)

    def test_rejects_unrecorded_fork_commit(self):
        (self.seed / 'unknown.txt').write_text('unknown\n')
        run('git', '-C', str(self.seed), 'add', 'unknown.txt')
        run('git', '-C', str(self.seed), 'commit', '-m', 'unknown')
        run('git', '-C', str(self.seed), 'push', 'origin', 'HEAD:main')
        result = run(str(SCRIPT), '--repo', str(self.repo), '--patch-dir', str(self.patch_dir), '--manifest', str(self.manifest), '--skip-tests', check=False)
        self.assertNotEqual(0, result.returncode)
        self.assertIn('UNRECORDED_FORK_COMMIT', result.stderr)

    def test_allows_historical_drop_commit_absent_from_origin(self):
        with self.manifest.open('a') as handle:
            handle.write('-\tdrop\tupstreamed\t0000000000000000000000000000000000000000\n')
        result = run(str(SCRIPT), '--repo', str(self.repo), '--patch-dir', str(self.patch_dir), '--manifest', str(self.manifest), '--skip-tests', check=False)
        self.assertEqual(0, result.returncode, result.stdout + result.stderr)

    def test_allows_current_fork_commit_to_be_dropped(self):
        self.manifest.write_text(f'-\tdrop\tretired\t{self.fork_commit}\n')

        result = run(str(SCRIPT), '--repo', str(self.repo), '--patch-dir', str(self.patch_dir), '--manifest', str(self.manifest), '--skip-tests', check=False)

        self.assertEqual(0, result.returncode, result.stdout + result.stderr)
        self.assertIn('TREE_DIFFERS_FROM_ORIGIN_MAIN', result.stdout)

    def test_requires_pr_audit_for_repository_release_even_without_carries(self):
        maintenance = self.repo / 'tools' / 'maintenance' / 'releases' / 'deferred-only'
        maintenance.mkdir(parents=True)
        manifest = maintenance / 'manifest.tsv'
        manifest.write_text(f'-\tdrop\tpr-1315\t{self.fork_commit}\n')

        result = run(
            str(SCRIPT), '--repo', str(self.repo), '--patch-dir', str(self.patch_dir),
            '--manifest', str(manifest), '--skip-tests', check=False,
        )

        self.assertNotEqual(0, result.returncode)
        self.assertIn('--pr-audit is required', result.stderr)

    def test_rejects_invalid_github_repository_instead_of_skipping_open_set_validation(self):
        maintenance = self.repo / 'tools' / 'maintenance' / 'releases' / 'invalid-upstream'
        patch_dir = maintenance / 'patches'
        patch_dir.mkdir(parents=True)
        (patch_dir / '0001.patch').write_text((self.patch_dir / '0001.patch').read_text())
        expected_tree = run('git', '-C', str(self.seed), 'rev-parse', f'{self.fork_commit}^{{tree}}').stdout.strip()
        manifest = maintenance / 'manifest.tsv'
        manifest.write_text(
            f'# upstream_sha={self.upstream_sha}\n'
            f'# previous_origin_main={self.fork_commit}\n'
            f'# expected_source_tree={expected_tree}\n'
            f'0001.patch\tcarry\tpr-1315\t{self.fork_commit}\n'
        )
        audit = maintenance / 'pr-audit.tsv'
        audit.write_text(
            'upstream_ref\tauthor\thead_sha\tdecision\tstatus\tmaintainer_signal\tbot_verdict\tbot_sha\tscope\tbehavior\treason\n'
            f'pr-1315\tcontributor\t{self.fork_commit}\tcarry\tready\tclear\tclean\t{self.fork_commit}\tproportional\tpreserve\t-\n'
        )
        env = os.environ | {'HAPI_UPSTREAM_REPO': 'invalid'}

        result = run(
            str(SCRIPT), '--repo', str(self.repo), '--patch-dir', str(patch_dir),
            '--manifest', str(manifest), '--pr-audit', str(audit), '--skip-tests',
            env=env, check=False,
        )

        self.assertNotEqual(0, result.returncode)
        self.assertIn('INVALID_UPSTREAM_REPO', result.stderr)

    def test_requires_pr_audit_for_pull_request_manifest_rows(self):
        self.manifest.write_text(f'0001.patch\tcarry\tpr-1315\t{self.fork_commit}\n')

        result = run(
            str(SCRIPT), '--repo', str(self.repo), '--patch-dir', str(self.patch_dir),
            '--manifest', str(self.manifest), '--skip-tests', check=False,
        )

        self.assertNotEqual(0, result.returncode)
        self.assertIn('--pr-audit is required', result.stderr)

    def test_github_rehearsal_validates_the_complete_open_pr_set(self):
        script = SCRIPT.read_text()

        self.assertIn('HAPI_UPSTREAM_REPO', script)
        self.assertIn('pullRequests(states: OPEN', script)
        self.assertIn('OPEN_PR_AUDIT_SET_MISMATCH', script)

    def test_accepts_upstreamed_antigravity_pr_reference(self):
        self.manifest.write_text(f'0001.patch\tcarry\tupstreamed-pr-1320\t{self.fork_commit}\n')

        result = run(str(SCRIPT), '--repo', str(self.repo), '--patch-dir', str(self.patch_dir), '--manifest', str(self.manifest), '--skip-tests', check=False)

        self.assertEqual(0, result.returncode, result.stdout + result.stderr)
        self.assertIn('REHEARSAL_OK', result.stdout)

    def test_requires_header_pins_for_repository_release_manifests(self):
        maintenance = self.repo / 'tools' / 'maintenance' / 'releases' / 'test'
        patch_dir = maintenance / 'patches'
        patch_dir.mkdir(parents=True)
        (patch_dir / '0001.patch').write_text((self.patch_dir / '0001.patch').read_text())
        manifest = maintenance / 'manifest.tsv'
        manifest.write_text(f'0001.patch\tcarry\tpr-1315\t{self.fork_commit}\n')
        audit = maintenance / 'pr-audit.tsv'
        audit.write_text(
            'upstream_ref\tauthor\thead_sha\tdecision\tstatus\tmaintainer_signal\tbot_verdict\tbot_sha\tscope\tbehavior\treason\n'
            f'pr-1315\tcontributor\t{self.fork_commit}\tcarry\tready\tclear\tclean\t{self.fork_commit}\tproportional\tpreserve\t-\n'
        )

        result = run(
            str(SCRIPT), '--repo', str(self.repo), '--patch-dir', str(patch_dir),
            '--manifest', str(manifest), '--pr-audit', str(audit), '--skip-tests', check=False,
        )

        self.assertNotEqual(0, result.returncode)
        self.assertIn('MISSING_MANIFEST_PIN', result.stderr)

    def test_rejects_non_personal_pr_that_fails_quality_gates(self):
        self.manifest.write_text(f'0001.patch\tcarry\tpr-1315\t{self.fork_commit}\n')
        self.pr_audit.write_text(
            'upstream_ref\tauthor\thead_sha\tdecision\tstatus\tmaintainer_signal\tbot_verdict\tbot_sha\tscope\tbehavior\treason\n'
            f'pr-1315\tcontributor\t{self.fork_commit}\tcarry\tready\tnegative\tfindings\t{self.fork_commit}\tmismatch\tunjustified-change\t-\n'
        )

        result = run(
            str(SCRIPT), '--repo', str(self.repo), '--patch-dir', str(self.patch_dir),
            '--manifest', str(self.manifest), '--pr-audit', str(self.pr_audit),
            '--personal-pr-owner', 'swear01', '--skip-tests', check=False,
        )

        self.assertNotEqual(0, result.returncode)
        self.assertIn('PR_QUALITY_GATE_FAILED pr-1315:', result.stderr)
        self.assertIn('maintainer-negative', result.stderr)
        self.assertIn('bot-findings', result.stderr)
        self.assertIn('scope-mismatch', result.stderr)
        self.assertIn('behavior-unjustified-change', result.stderr)

    def test_carries_personal_pr_and_reports_every_quality_exception(self):
        self.manifest.write_text(f'0001.patch\tcarry\tpr-1315\t{self.fork_commit}\n')
        self.pr_audit.write_text(
            'upstream_ref\tauthor\thead_sha\tdecision\tstatus\tmaintainer_signal\tbot_verdict\tbot_sha\tscope\tbehavior\treason\n'
            f'pr-1315\tswear01\t{self.fork_commit}\tcarry\tchecks-failed\tnegative\tfindings\t{self.fork_commit}\tmismatch\tunjustified-change\tpersonal override\n'
        )

        result = run(
            str(SCRIPT), '--repo', str(self.repo), '--patch-dir', str(self.patch_dir),
            '--manifest', str(self.manifest), '--pr-audit', str(self.pr_audit),
            '--personal-pr-owner', 'swear01', '--skip-tests', check=False,
        )

        self.assertEqual(0, result.returncode, result.stdout + result.stderr)
        self.assertIn('PERSONAL_PR_POLICY_EXCEPTION pr-1315:', result.stdout)
        self.assertIn('status-checks-failed', result.stdout)
        self.assertIn('maintainer-negative', result.stdout)
        self.assertIn('bot-findings', result.stdout)
        self.assertIn('scope-mismatch', result.stdout)
        self.assertIn('behavior-unjustified-change', result.stdout)
        self.assertIn('REHEARSAL_OK', result.stdout)

    def test_accepts_clean_latest_head_for_non_personal_pr(self):
        self.manifest.write_text(f'0001.patch\tcarry\tpr-1315\t{self.fork_commit}\n')
        self.pr_audit.write_text(
            'upstream_ref\tauthor\thead_sha\tdecision\tstatus\tmaintainer_signal\tbot_verdict\tbot_sha\tscope\tbehavior\treason\n'
            f'pr-1315\tcontributor\t{self.fork_commit}\tcarry\tready\tclear\tclean\t{self.fork_commit}\tproportional\tpreserve\t-\n'
        )

        result = run(
            str(SCRIPT), '--repo', str(self.repo), '--patch-dir', str(self.patch_dir),
            '--manifest', str(self.manifest), '--pr-audit', str(self.pr_audit),
            '--personal-pr-owner', 'swear01', '--skip-tests', check=False,
        )

        self.assertEqual(0, result.returncode, result.stdout + result.stderr)
        self.assertNotIn('POLICY_EXCEPTION', result.stdout)

    def test_requires_every_audited_carry_to_have_a_manifest_mapping(self):
        self.manifest.write_text(f'0001.patch\tcarry\tpr-1315\t{self.fork_commit}\n')
        self.pr_audit.write_text(
            'upstream_ref\tauthor\thead_sha\tdecision\tstatus\tmaintainer_signal\tbot_verdict\tbot_sha\tscope\tbehavior\treason\n'
            f'pr-1315\tcontributor\t{self.fork_commit}\tcarry\tready\tclear\tclean\t{self.fork_commit}\tproportional\tpreserve\t-\n'
            f'pr-1316\tcontributor\t{self.fork_commit}\tcarry\tready\tclear\tclean\t{self.fork_commit}\tproportional\tpreserve\t-\n'
        )

        result = run(
            str(SCRIPT), '--repo', str(self.repo), '--patch-dir', str(self.patch_dir),
            '--manifest', str(self.manifest), '--pr-audit', str(self.pr_audit),
            '--personal-pr-owner', 'swear01', '--skip-tests', check=False,
        )

        self.assertNotEqual(0, result.returncode)
        self.assertIn('MISSING_MANIFEST_CARRY: pr-1316', result.stderr)

    def test_accepts_semantically_integrated_audited_carry(self):
        self.manifest.write_text(f'-\tintegrated\tpr-1315\t{self.fork_commit}\n')
        self.pr_audit.write_text(
            'upstream_ref\tauthor\thead_sha\tdecision\tstatus\tmaintainer_signal\tbot_verdict\tbot_sha\tscope\tbehavior\treason\n'
            f'pr-1315\tcontributor\t{self.fork_commit}\tcarry\tready\tclear\tclean\t{self.fork_commit}\tproportional\tpreserve\tsemantic equivalent\n'
        )

        result = run(
            str(SCRIPT), '--repo', str(self.repo), '--patch-dir', str(self.patch_dir),
            '--manifest', str(self.manifest), '--pr-audit', str(self.pr_audit),
            '--personal-pr-owner', 'swear01', '--skip-tests', check=False,
        )

        self.assertEqual(0, result.returncode, result.stdout + result.stderr)

    def test_allows_new_carried_pr_head_absent_from_old_origin(self):
        run('git', '-C', str(self.seed), 'reset', '--hard', 'upstream/main')
        (self.seed / 'new-carry.txt').write_text('new carry\n')
        run('git', '-C', str(self.seed), 'add', 'new-carry.txt')
        run('git', '-C', str(self.seed), 'commit', '-m', 'new carry')
        new_head = run('git', '-C', str(self.seed), 'rev-parse', 'HEAD').stdout.strip()
        patch = run('git', '-C', str(self.seed), 'format-patch', '-1', '--stdout').stdout
        (self.patch_dir / 'new-carry.patch').write_text(patch)
        run('git', '-C', str(self.seed), 'push', '--force', 'upstream', 'HEAD:refs/pull/1315/head')
        self.manifest.write_text(
            f'-\tdrop\tretired\t{self.fork_commit}\n'
            f'new-carry.patch\tcarry\tpr-1315\t{new_head}\n'
        )
        self.pr_audit.write_text(
            'upstream_ref\tauthor\thead_sha\tdecision\tstatus\tmaintainer_signal\tbot_verdict\tbot_sha\tscope\tbehavior\treason\n'
            f'pr-1315\tcontributor\t{new_head}\tcarry\tready\tclear\tclean\t{new_head}\tproportional\tpreserve\t-\n'
        )

        result = run(
            str(SCRIPT), '--repo', str(self.repo), '--patch-dir', str(self.patch_dir),
            '--manifest', str(self.manifest), '--pr-audit', str(self.pr_audit),
            '--personal-pr-owner', 'swear01', '--skip-tests', check=False,
        )

        self.assertEqual(0, result.returncode, result.stdout + result.stderr)
        self.assertIn('REHEARSAL_OK', result.stdout)

    def test_rejects_stale_bot_review_for_non_personal_pr(self):
        self.manifest.write_text(f'0001.patch\tcarry\tpr-1315\t{self.fork_commit}\n')
        self.pr_audit.write_text(
            'upstream_ref\tauthor\thead_sha\tdecision\tstatus\tmaintainer_signal\tbot_verdict\tbot_sha\tscope\tbehavior\treason\n'
            f'pr-1315\tcontributor\t{self.fork_commit}\tcarry\tready\tclear\tclean\told-head\tproportional\tpreserve\t-\n'
        )

        result = run(
            str(SCRIPT), '--repo', str(self.repo), '--patch-dir', str(self.patch_dir),
            '--manifest', str(self.manifest), '--pr-audit', str(self.pr_audit),
            '--personal-pr-owner', 'swear01', '--skip-tests', check=False,
        )

        self.assertNotEqual(0, result.returncode)
        self.assertIn('bot-stale', result.stderr)

    def test_rejects_stale_pr_head_even_for_personal_pr(self):
        self.manifest.write_text(f'0001.patch\tcarry\tpr-1315\t{"0" * 40}\n')
        self.pr_audit.write_text(
            'upstream_ref\tauthor\thead_sha\tdecision\tstatus\tmaintainer_signal\tbot_verdict\tbot_sha\tscope\tbehavior\treason\n'
            'pr-1315\tswear01\t0000000000000000000000000000000000000000\tcarry\tready\tclear\tclean\t0000000000000000000000000000000000000000\tproportional\tpreserve\t-\n'
        )

        result = run(
            str(SCRIPT), '--repo', str(self.repo), '--patch-dir', str(self.patch_dir),
            '--manifest', str(self.manifest), '--pr-audit', str(self.pr_audit),
            '--personal-pr-owner', 'swear01', '--skip-tests', check=False,
        )

        self.assertNotEqual(0, result.returncode)
        self.assertIn('PR_AUDIT_HEAD_STALE pr-1315:', result.stderr)

    def test_applies_generated_release_patch_without_a_source_commit(self):
        run('git', '-C', str(self.seed), 'reset', '--hard', 'upstream/main')
        (self.seed / 'release.txt').write_text('release\n')
        run('git', '-C', str(self.seed), 'add', 'release.txt')
        run('git', '-C', str(self.seed), 'commit', '-m', 'release metadata')
        release_patch = run('git', '-C', str(self.seed), 'format-patch', '-1', '--stdout').stdout
        (self.patch_dir / 'release.patch').write_text(release_patch)
        with self.manifest.open('a') as handle:
            handle.write('release.patch\tregenerate\trelease\t-\n')

        result = run(str(SCRIPT), '--repo', str(self.repo), '--patch-dir', str(self.patch_dir), '--manifest', str(self.manifest), '--skip-tests', check=False)

        self.assertEqual(0, result.returncode, result.stdout + result.stderr)
        self.assertIn('TREE_DIFFERS_FROM_ORIGIN_MAIN', result.stdout)

    def test_failed_tests_remove_isolated_hapi_home(self):
        fake_bun = Path(self.tmp.name) / 'fake-bun'
        fake_bun.write_text(
            '#!/bin/sh\n'
            'if [ "$1" = run ] && [ "$2" = test ]; then exit 9; fi\n'
            'exit 0\n'
        )
        fake_bun.chmod(0o755)
        before = set(Path('/tmp').glob('hapi-test-home.*'))

        result = run(
            str(SCRIPT), '--repo', str(self.repo), '--patch-dir', str(self.patch_dir),
            '--manifest', str(self.manifest), env=os.environ | {'BUN_BIN': str(fake_bun)},
            check=False,
        )
        leaked = set(Path('/tmp').glob('hapi-test-home.*')) - before
        for path in leaked:
            subprocess.run(['rm', '-rf', str(path)], check=False)

        self.assertNotEqual(0, result.returncode)
        self.assertEqual(set(), leaked)

    def test_push_is_not_supported(self):
        env = os.environ | {'HAPI_SYNC_CONFIRM': 'RESET_ORIGIN_MAIN_WITH_FORCE_WITH_LEASE'}

        result = run(
            str(SCRIPT), '--repo', str(self.repo), '--patch-dir', str(self.patch_dir),
            '--manifest', str(self.manifest), '--skip-tests', '--push', env=env, check=False,
        )

        self.assertNotEqual(0, result.returncode)
        self.assertIn('rehearsal-only', result.stderr)


if __name__ == '__main__':
    unittest.main()
