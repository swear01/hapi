# Maintained release notes

Every maintained tag must have a matching `<tag>.md` file in this directory before the tag is pushed.

Release notes must answer two questions:

1. What changed since the immediately previous `swear01/hapi` maintained release?
2. What does this build add or change compared with the matching official `tiann/hapi` release?

Use these sections in this order:

- `Compared with the previous maintained release`
- `Compared with the official release`
- `Maintained-fork guarantees`

Do not use GitHub auto-generated notes or a repository-wide full changelog. The maintained branch is rebuilt from upstream, so consecutive maintained tags are intentionally not a linear commit chain.
