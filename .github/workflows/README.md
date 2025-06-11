# GitHub Actions Workflows

## Dependabot Auto-Merge Setup

This repository uses automated workflows to handle Dependabot pull requests efficiently while maintaining security.

### Workflows

1. **dependabot-approve.yml**: Automatically approves safe Dependabot PRs
2. **dependabot-auto-merge.yml**: Automatically merges approved Dependabot PRs after CI passes

### Auto-Merge Conditions

The following Dependabot PRs will be automatically merged:

- ✅ **All patch updates** (e.g., 1.2.3 → 1.2.4)
- ✅ **Minor updates for development dependencies** (e.g., 1.2.0 → 1.3.0 for devDependencies)
- ✅ **Minor updates for safe production dependencies**:
    - @sveltejs/adapter-static
    - @sveltejs/kit
    - svelte
    - vite
    - postcss
    - tailwindcss
    - autoprefixer

### Manual Review Required

The following updates require manual review:

- ❌ **Major version updates** (e.g., 1.0.0 → 2.0.0)
- ❌ **Minor updates for most production dependencies**
- ❌ **Updates explicitly ignored in dependabot.yml** (e.g., sharp major updates)

### How It Works

1. Dependabot creates a PR
2. The auto-approve workflow runs and approves if conditions are met
3. CI checks run (tests, linting, security audit)
4. If all checks pass and auto-merge conditions are met, the PR is automatically merged
5. If manual review is required, a comment is added to the PR

### Required GitHub Settings

To enable auto-merge, ensure the following repository settings:

1. **Branch Protection Rules** for `main`:

    - Require pull request reviews before merging (1 approval)
    - Require status checks to pass before merging:
        - Test & Lint (Node 18)
        - Test & Lint (Node 20)
        - Security Audit
    - Require branches to be up to date before merging
    - Allow auto-merge

2. **GitHub App or PAT** (Optional but recommended):
    - For better auto-merge reliability, consider using a GitHub App token
    - This bypasses certain limitations with the default GITHUB_TOKEN

### Monitoring

- Check the Actions tab for workflow runs
- Failed auto-merges will be logged in the workflow output
- PRs requiring manual review will have a comment explaining why

### Customization

To modify auto-merge conditions:

1. Edit `.github/workflows/dependabot-auto-merge.yml`
2. Update the conditions in the "Check if PR should be auto-merged" step
3. Add/remove dependencies from the SAFE_DEPS list as needed
