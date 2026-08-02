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
        (self.seed / 'value.txt').write_text('patched\n')
        run('git', '-C', str(self.seed), 'commit', '-am', 'fork patch')
        self.fork_commit = run('git', '-C', str(self.seed), 'rev-parse', 'HEAD').stdout.strip()
        patch = run('git', '-C', str(self.seed), 'format-patch', '-1', '--stdout').stdout
        (self.patch_dir / '0001.patch').write_text(patch)
        run('git', '-C', str(self.seed), 'push', 'origin', 'HEAD:main')
        run('git', 'clone', str(self.origin), str(self.repo))
        run('git', '-C', str(self.repo), 'remote', 'add', 'upstream', str(self.upstream))
        self.manifest.write_text(f'0001.patch\tcarry\ttest\t{self.fork_commit}\n')

    def tearDown(self):
        self.tmp.cleanup()

    def test_rehearses_reset_and_patch_without_pushing(self):
        before = run('git', '--git-dir', str(self.origin), 'rev-parse', 'main').stdout.strip()
        result = run(str(SCRIPT), '--repo', str(self.repo), '--patch-dir', str(self.patch_dir), '--manifest', str(self.manifest), '--skip-tests')
        after = run('git', '--git-dir', str(self.origin), 'rev-parse', 'main').stdout.strip()
        self.assertEqual(before, after)
        self.assertIn('TREE_MATCHES_ORIGIN_MAIN', result.stdout)
        self.assertIn('REHEARSAL_OK', result.stdout)

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

    def test_push_requires_explicit_confirmation(self):
        result = run(str(SCRIPT), '--repo', str(self.repo), '--patch-dir', str(self.patch_dir), '--manifest', str(self.manifest), '--skip-tests', '--push', check=False)
        self.assertNotEqual(0, result.returncode)
        self.assertIn('HAPI_SYNC_CONFIRM', result.stderr)


if __name__ == '__main__':
    unittest.main()
