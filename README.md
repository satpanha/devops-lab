## Containerized Web Application

A simple static webpage served by Nginx inside a Docker container.

### Technologies
- Docker
- Docker Compose
- Nginx
- HTML

### Run locally

From the project root:

```bash
cd docker/hello-web
docker compose up --build -d
```

## Lab 1: CI/CD with GitHub Actions

An Express 5 app (ES Modules) in [`ci-cd-lab/`](ci-cd-lab/) with Mocha, Chai and Supertest tests, ESLint, and c8 coverage.
The [CI workflow](.github/workflows/ci-cd-lab.yml) runs on pushes and pull requests to `main`:
install -> lint -> test -> coverage -> upload the HTML coverage report as an artifact.

```bash
cd ci-cd-lab
corepack enable
yarn install
yarn lint && yarn test && yarn coverage
```