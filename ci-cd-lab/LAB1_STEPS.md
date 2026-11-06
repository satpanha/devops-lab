# Lab 1: CI/CD with GitHub Actions: step-by-step guide

Your setup:

- Repo: `satpanha/devops-lab`
- Lab code: `devops-lab/ci-cd-lab/`
- Workflow: `devops-lab/.github/workflows/ci-cd-lab.yml` (at the repo root, because GitHub only runs workflows from there)
- Shell: WSL2 (Ubuntu)

Work through the parts in order. Tick each box as you go.

---

## Part 0: What you already have

All the handout files exist and the local checks passed when I ran them (lint clean, 2 tests passing, 100% coverage). You applied the commit with `git am` (`a06d109`).

| File | What it does |
|---|---|
| `ci-cd-lab/app.js` | Defines the Express app and the `GET /` route. It does not start a server, which keeps it easy to test. |
| `ci-cd-lab/server.js` | Imports the app and calls `listen()`. |
| `ci-cd-lab/test/test.js` | Two Mocha/Chai/Supertest tests for `GET /`. |
| `ci-cd-lab/eslint.config.js` | ESLint flat config with Node and Mocha globals. |
| `ci-cd-lab/package.json` | Scripts: `start`, `test`, `lint`, `coverage`. Pins Yarn 4 via `packageManager`. |
| `ci-cd-lab/yarn.lock` | Locked dependency versions. CI needs it (`yarn install --immutable`). |
| `.github/workflows/ci-cd-lab.yml` | The CI pipeline. |

Two deliberate differences from the handout, so you can explain them:

1. The `coverage` script is `c8 --reporter=text --reporter=html mocha`. c8's default reporter prints only the text table, so without `html` there is no `coverage/index.html` to inspect or upload.
2. The workflow is at the repo root and uses `working-directory: ci-cd-lab`, because this lab lives in a subfolder of a bigger repo. It also has a `corepack enable` step so the runner uses Yarn 4.

---

## Part 1: Prepare your environment (WSL)

- [ ] **1.1 Check versions**

  ```bash
  node --version
  git --version
  ```

  The handout requires Node 24 or later. If Node is older, install it with nvm:

  ```bash
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
  # close and reopen the terminal, then:
  nvm install 24
  nvm use 24
  node --version
  ```

- [ ] **1.2 Enable Yarn 4 through Corepack**

  ```bash
  corepack enable
  ```

  If you get a permission error (system-installed Node), run `sudo corepack enable`.

- [ ] **1.3 Go to the lab folder**

  ```bash
  cd ~/path/to/devops-lab/ci-cd-lab
  yarn --version
  ```

  It must print a `4.x` version. If it prints `1.22.x`, Corepack is not active; repeat step 1.2.

---

## Part 2: Run everything locally (handout Steps 7 to 10)

- [ ] **2.1 Install dependencies**

  ```bash
  yarn install
  ```

  Confirm `yarn.lock` exists. Do not continue if the install fails.

- [ ] **2.2 Run the app**

  ```bash
  yarn start
  ```

  Open http://localhost:3000/. You should see `Hello, GitHub Actions!`. Stop the server with `Ctrl+C`.

- [ ] **2.3 Lint and test**

  ```bash
  yarn lint
  yarn test
  ```

  Expected: no lint output, and `2 passing`.

- [ ] **2.4 Experiment: break a test on purpose** (the handout asks for this)

  1. In `app.js`, change the greeting to `Hello, World!`.
  2. Run `yarn test`. The response-text test fails. Note why (the test compares the exact text).
  3. Restore the original greeting and rerun `yarn test`.
  4. **Do not commit the broken version.**

- [ ] **2.5 Measure coverage**

  ```bash
  yarn coverage
  ```

  You get a table with Stmts / Branch / Funcs / Lines. Open the HTML report:

  ```bash
  explorer.exe coverage/index.html    # opens it in Windows from WSL
  ```

  **Take a screenshot of the coverage table** (needed for submission).

  Remember: 100% coverage means the tests executed all measured code. It does not mean the app has no bugs.

- [ ] **2.6 Optional extension: a coverage threshold**

  Change the script in `package.json` to:

  ```json
  "coverage": "c8 --check-coverage --lines 80 --reporter=text --reporter=html mocha"
  ```

  The command now fails if line coverage drops below 80%. In your reflection, explain why you chose that number.

---

## Part 3: Get the lab onto GitHub (handout Step 12)

You already applied the commit. Make sure you are on the feature branch and the tree is clean:

```bash
cd ~/path/to/devops-lab
git status
git log --oneline | head -3
```

- [ ] **3.1 Authenticate (one time)**

  GitHub does not accept your account password for Git. Use one of these:

  - **GitHub CLI:** `sudo apt install gh`, then `gh auth login` (GitHub.com, HTTPS, web browser), then `gh auth setup-git`.
  - **Personal access token:** GitHub, Settings, Developer settings, Fine-grained tokens. Select only `devops-lab`, with Contents set to Read and write. Paste the token as the password when Git asks.

  Never commit or share a token.

- [ ] **3.2 Push the branch**

  ```bash
  git push -u origin feat/ci-cd-lab
  ```

---

## Part 4: Open the PR and verify CI (handout Steps 11 and 13)

- [ ] **4.1 Open a pull request** from `feat/ci-cd-lab` into `main` on GitHub.

- [ ] **4.2 Watch the workflow.** Open the **Actions** tab, then the run named **CI (ci-cd-lab)**. Confirm each step is green:

  1. Check out repository
  2. Enable Corepack (Yarn 4)
  3. Set up Node.js
  4. Install dependencies
  5. Run ESLint
  6. Run tests
  7. Generate code coverage
  8. Upload coverage HTML report

- [ ] **4.3 Merge the PR.** This triggers a second run on `main` (a push event).

- [ ] **4.4 Download the artifact.** In the finished run, scroll to **Artifacts**, download `code-coverage-report`, unzip it, and open `index.html`.

- [ ] **4.5 Take a screenshot** of the successful workflow run.

Notes on when the workflow runs:

- It only triggers for changes under `ci-cd-lab/**` or to the workflow file itself, so edits to your other folders (`docker/`, `linux/`) will not start it.
- It only runs for pushes to `main` and PRs targeting `main`.

---

## Part 5: Demonstrate CI on a pull request (handout Step 14)

- [ ] **5.1 Update `main` and create a branch**

  ```bash
  git checkout main
  git pull
  git checkout -b feature/health-route
  ```

- [ ] **5.2 Add the route.** In `ci-cd-lab/app.js`, before `export default app;`:

  ```js
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
  });
  ```

- [ ] **5.3 Add the test.** In `ci-cd-lab/test/test.js`, at the bottom:

  ```js
  describe('GET /health', () => {
    it('returns HTTP 200 and status ok', async () => {
      const response = await request(app).get('/health');
      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal({ status: 'ok' });
    });
  });
  ```

- [ ] **5.4 Run all three checks locally**

  ```bash
  cd ci-cd-lab
  yarn lint
  yarn test
  yarn coverage
  cd ..
  ```

  Expected: lint clean, 3 passing, coverage still 100%.

- [ ] **5.5 Commit and push**

  ```bash
  git add ci-cd-lab/app.js ci-cd-lab/test/test.js
  git commit -m "feat: add health endpoint and test"
  git push -u origin feature/health-route
  ```

- [ ] **5.6 Open a PR** from `feature/health-route` into `main`. Confirm the CI check runs on the PR and passes. **Screenshot it.**

- [ ] **5.7 (Optional) Prove CI protects you.** On a throwaway branch, break a test and push it. Watch CI fail on the PR, then close the PR without merging.

---

## Part 6: Submission checklist

- [ ] Repo link (`https://github.com/satpanha/devops-lab`). Your instructor must be able to see the workflow runs. If the repo is private, add them as a collaborator.
- [ ] Screenshot: successful CI run on `main`
- [ ] Screenshot: successful CI run on the PR (`feature/health-route`)
- [ ] Screenshot: local `yarn coverage` summary
- [ ] The downloaded coverage report opened in the browser (optional but strong evidence)
- [ ] `yarn.lock` is committed, and no secrets or tokens are in the repo
- [ ] The broken-test experiment was **not** committed
- [ ] Short technical reflection (see below)

### Reflection prompts (pick 3 to 5 and answer in your own words)

1. What is the difference between Continuous Integration, Continuous Delivery and Continuous Deployment? Which one did this lab implement?
2. Why are `app.js` and `server.js` separate files? How does that help testing?
3. Why does CI use `yarn install --immutable`? What would go wrong without a committed `yarn.lock`?
4. What does 100% coverage prove, and what does it not prove?
5. Why does this workflow live at the repo root with `working-directory: ci-cd-lab`, instead of inside the lab folder?
6. How is a CI pipeline different from the Husky pre-commit hook you already use at work? (Local hooks can be skipped; CI runs on a clean server for everyone.)

---

## Troubleshooting

| Symptom | Likely cause and fix |
|---|---|
| `yarn --version` shows `1.22.x` | Corepack is not enabled. Run `corepack enable` (or `sudo corepack enable`), then reopen the terminal. |
| `Invalid username or token` on push | Git does not accept account passwords. Use `gh auth login` or a personal access token. |
| CI fails at "Install dependencies" with a lockfile error | `yarn.lock` is out of date. Run `yarn install` in `ci-cd-lab/`, commit `yarn.lock`, and push. |
| CI does not start at all | Check the PR targets `main`, and that you changed something under `ci-cd-lab/` or the workflow file. |
| ESLint complains about the Node version | Make sure you are on Node 24 (`node --version`). |
| `coverage/index.html` missing | The `coverage` script must include `--reporter=html`. Run `yarn coverage` again. |
| Port 3000 already in use | Run `PORT=3001 yarn start`. |

---

## Where this goes next (your DevOps roadmap)

You now have the first stage of Phase 2: lint, test and coverage on every push. Good next additions to the same pipeline:

- Build a Docker image in CI (you already have Docker practice in `docker/hello-web`)
- Add a Trivy image scan
- Push the image to GHCR

Write a short README or post about the lab when you finish, as your weekly rhythm suggests.
