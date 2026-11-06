# ci-cd-lab

Lab 1: a small Express 5 app (ES Modules) with automated tests, linting, code coverage, and a GitHub Actions CI pipeline.

## Stack

Node.js 24, Yarn 4, Express 5, Mocha, Chai, Supertest, ESLint, c8.

## Run locally

```bash
corepack enable
yarn install
yarn start        # http://localhost:3000/ -> "Hello, GitHub Actions!"
```

## Quality checks

```bash
yarn lint         # ESLint
yarn test         # Mocha + Chai + Supertest
yarn coverage     # c8 + Mocha, HTML report in coverage/index.html
```

## CI

This lab lives in a subfolder of the `devops-lab` repo, so the workflow is at the repo root:
`.github/workflows/ci-cd-lab.yml`. GitHub only runs workflows from the root `.github/workflows/`,
so the job sets `working-directory: ci-cd-lab` and only triggers when files under `ci-cd-lab/` change.

It runs on pushes to `main` and on pull requests targeting `main`:
install (`yarn install --immutable`) -> lint -> test -> coverage -> upload the `code-coverage-report` artifact.

## Project structure

```text
ci-cd-lab/
├── test/test.js
├── .gitignore
├── .yarnrc.yml
├── app.js          # Express app (no listen, easy to test)
├── server.js       # Starts the server
├── eslint.config.js
├── package.json
└── README.md
```
