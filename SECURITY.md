# Security Policy

## Vulnerability Status

### Production Dependencies
✅ **No vulnerabilities detected**

Verified with:
```bash
npm audit --production
```

### Development Dependencies
The project uses semantic-release and related tools for automated releases. These are development-only dependencies and do not affect production code.

Some transitive vulnerabilities exist in npm's bundled dependencies (diff, tar) which are part of npm itself and cannot be fixed at the project level. These will be resolved when npm releases updates.

## Verification

To verify security status:
```bash
# Check production dependencies (should show 0 vulnerabilities)
npm audit --production

# Check all dependencies
npm audit
```

## Reporting Security Issues

If you discover a security vulnerability in production code, please report it via GitHub Security Advisories:
https://github.com/qaldak/squad-manager/security/advisories/new
