# Notes API

A small Node.js HTTP API for practicing tests, coverage thresholds, and GitHub Actions.

## Run

From this directory:

```bash
npm install
npm start
```

The server listens on port 3000 by default. Set `PORT` to change it.

## Endpoints

- `GET /notes` returns an array; it starts empty.
- `POST /notes` accepts JSON such as `{"text":"Review CI"}`, returns `201 Created`, and returns the created note.
- Missing, blank, or non-string text returns `400 Bad Request`.
- Unknown paths return `404 Not Found`.

## Quality checks

```bash
npm run lint
npm test
npm run coverage
```

Coverage fails below 90% lines or 80% branches. GitHub Actions runs all three checks on Node.js 22 and 24 and uploads a coverage artifact for each matrix job.