import json
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[3]


class WebManifestTest(unittest.TestCase):
    def test_markdown_renderer_dependency_is_direct(self):
        package = json.loads((ROOT / "web" / "package.json").read_text())
        self.assertIn("react-markdown", package["dependencies"])


if __name__ == "__main__":
    unittest.main()
