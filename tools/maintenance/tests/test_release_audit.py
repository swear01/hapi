from pathlib import Path
import json
import os
import subprocess
import tempfile
import unittest


ROOT = Path(__file__).resolve().parents[3]
SCRIPT = ROOT / "tools" / "maintenance" / "audit-release.sh"


class ReleaseAuditTest(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.root = Path(self.tmp.name)
        self.upstream = self.root / "upstream.git"
        self.origin = self.root / "origin.git"
        self.seed = self.root / "seed"
        self.repo = self.root / "repo"
        self.bin = self.root / "bin"
        self.output = self.root / "audit.md"
        self.bin.mkdir()

        self.command("git", "init", "--bare", str(self.upstream))
        self.command("git", "init", "--bare", str(self.origin))
        self.command("git", "init", str(self.seed))
        self.command("git", "-C", str(self.seed), "config", "user.name", "Test")
        self.command("git", "-C", str(self.seed), "config", "user.email", "test@example.com")
        (self.seed / "value.txt").write_text("upstream\n")
        self.command("git", "-C", str(self.seed), "add", "value.txt")
        self.command("git", "-C", str(self.seed), "commit", "-m", "upstream")
        self.command("git", "-C", str(self.seed), "branch", "-M", "main")
        self.command("git", "-C", str(self.seed), "remote", "add", "upstream", str(self.upstream))
        self.command("git", "-C", str(self.seed), "remote", "add", "origin", str(self.origin))
        self.command("git", "-C", str(self.seed), "push", "upstream", "main")
        self.command("git", "-C", str(self.seed), "push", "origin", "main")
        self.command("git", "-C", str(self.seed), "tag", "v0.25.1.3")
        self.command("git", "-C", str(self.seed), "push", "origin", "v0.25.1.3")
        (self.seed / "fork.txt").write_text("fork\n")
        self.command("git", "-C", str(self.seed), "add", "fork.txt")
        self.command("git", "-C", str(self.seed), "commit", "-m", "fork patch")
        self.fork_commit = self.command("git", "-C", str(self.seed), "rev-parse", "HEAD").stdout.strip()
        self.command("git", "-C", str(self.seed), "push", "origin", "HEAD:main")
        self.command("git", "clone", str(self.origin), str(self.repo))
        self.command("git", "-C", str(self.repo), "remote", "add", "upstream", str(self.upstream))
        (self.bin / "gh").write_text(
            "#!/bin/sh\n"
            "if [ \"$1\" = release ]; then\n"
            "  printf '%s\\n' '{\"tagName\":\"v0.25.3\"}'\n"
            "else\n"
            "  printf '%s\\n' '[{\"number\":1315,\"title\":\"Pinned sessions\",\"isDraft\":false,\"mergeStateStatus\":\"CLEAN\",\"headRefOid\":\"abc123\",\"url\":\"https://example.test/pr/1315\"}]'\n"
            "fi\n"
        )
        (self.bin / "gh").chmod(0o755)

    def tearDown(self):
        self.tmp.cleanup()

    def command(self, *args, env=None):
        result = subprocess.run(args, text=True, capture_output=True, env=env)
        if result.returncode != 0:
            raise AssertionError(result.stdout + result.stderr)
        return result

    def test_writes_auditable_snapshot_of_releases_fork_commits_and_open_prs(self):
        self.assertTrue(SCRIPT.is_file(), f"missing workflow command: {SCRIPT}")
        env = os.environ | {"PATH": f"{self.bin}:{os.environ['PATH']}"}
        self.command(str(SCRIPT), "--repo", str(self.repo), "--output", str(self.output), env=env)

        audit = self.output.read_text()
        self.assertIn("Previous maintained release: v0.25.1.3", audit)
        self.assertIn("Official release: v0.25.3", audit)
        self.assertIn(self.fork_commit, audit)
        self.assertIn("#1315", audit)
        self.assertIn("CLEAN", audit)
        self.assertIn("abc123", audit)

    def test_accepts_an_isolated_git_worktree(self):
        worktree = self.root / "worktree"
        self.command("git", "-C", str(self.repo), "worktree", "add", str(worktree), "origin/main")
        env = os.environ | {"PATH": f"{self.bin}:{os.environ['PATH']}"}
        self.command(str(SCRIPT), "--repo", str(worktree), "--output", str(self.output), env=env)

        self.assertIn("Previous maintained release: v0.25.1.3", self.output.read_text())


if __name__ == "__main__":
    unittest.main()
