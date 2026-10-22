from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[3]


class ReleaseWorkflowTest(unittest.TestCase):
    def test_validates_cli_and_embedded_app_versions(self):
        workflow = (ROOT / ".github" / "workflows" / "release.yml").read_text()

        self.assertIn("CLI_VERSION", workflow)
        self.assertIn("APP_VERSION", workflow)
        self.assertIn("shared/src/buildInfo.ts", workflow)

    def test_release_tag_must_equal_the_current_main_head(self):
        workflow = (ROOT / ".github" / "workflows" / "release.yml").read_text()

        self.assertIn('test "$(git rev-parse refs/remotes/origin/main)" = "$GITHUB_SHA"', workflow)
        self.assertNotIn('merge-base --is-ancestor "$GITHUB_SHA"', workflow)

    def test_uses_bun_1_4_with_frozen_installs(self):
        workflow = (ROOT / ".github" / "workflows" / "release.yml").read_text()

        self.assertNotIn("bun-version: 1.3.14", workflow)
        self.assertEqual(3, workflow.count("bun-version: 1.4.0"))
        self.assertEqual(3, workflow.count("bun install --frozen-lockfile"))

    def test_release_publish_is_fork_guarded_and_least_privilege(self):
        workflow = (ROOT / ".github" / "workflows" / "release.yml").read_text()

        self.assertIn("permissions:\n    contents: read", workflow)
        self.assertEqual(5, workflow.count("if: github.repository == 'swear01/hapi'"))
        self.assertIn("release:\n        if: github.repository == 'swear01/hapi'\n        permissions:\n            contents: write", workflow)

    def test_smoke_runner_guards_every_production_host_and_process(self):
        script = (ROOT / "tools" / "maintenance" / "smoke-runner.sh").read_text()

        self.assertIn('PROD_HOSTS="oracle swever cthulhu athena valkyrie zeus"', script)
        self.assertIn("SMOKE_PATTERN='bun (hub/src/index[.]ts|cli/src/index[.]ts runner start-sync)'", script)

    def test_fork_skips_upstream_pages_deployment(self):
        workflow = (ROOT / ".github" / "workflows" / "webapp.yml").read_text()

        self.assertEqual(2, workflow.count("if: github.repository == 'tiann/hapi'"))


if __name__ == "__main__":
    unittest.main()
