# Security

## Automated protection

Kopersay Technologies uses an automated GitHub Actions security watch for this static website. The watcher runs on pushes, manually, and on a 10-minute schedule.

It checks for high-risk repository changes such as:
- unexpected CNAME changes
- insecure HTTP script sources
- unexpected redirects or JavaScript URL patterns
- suspicious code execution patterns
- exposed private keys or common access-token patterns
- suspicious remote shell execution in workflow files

When a high-risk finding is detected, the workflow fails and creates a GitHub issue so the change can be reviewed before further action.

## Important limitation

No automated scanner can guarantee that a website will never be hacked. Keep GitHub two-factor authentication enabled, use strong unique credentials, review unexpected commits, and keep domain/DNS access protected.

## Reporting

If you find a security problem, open a private security report through the repository's GitHub security features when available, or contact the site owner through the official contact channel.
