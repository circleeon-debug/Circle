# Circle

Circle is a small React + TypeScript web app for keeping the people who matter close. It's built with [Vite](https://vite.dev/) for a fast, modern development experience.

## Tech stack

- [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) dev server and build tooling
- [ESLint](https://eslint.org/) (flat config) for linting

## Prerequisites

- [Node.js](https://nodejs.org/) 20+ (developed against Node 22)
- npm 10+

## Getting started

```bash
npm install      # install dependencies
npm run dev      # start the dev server at http://localhost:5173
```

## Available scripts

| Script            | Description                                      |
| ----------------- | ------------------------------------------------ |
| `npm run dev`     | Start the Vite dev server on port 5173.          |
| `npm run build`   | Type-check and produce a production build.       |
| `npm run preview` | Preview the production build on port 4173.       |
| `npm run lint`    | Lint the project with ESLint.                    |
| `npm run typecheck` | Run the TypeScript compiler without emitting.  |

## Cloud Agent environment

This repository includes a [`.cursor/environment.json`](.cursor/environment.json)
that installs dependencies and runs the dev server so Cursor Cloud Agents get a
working environment automatically.
