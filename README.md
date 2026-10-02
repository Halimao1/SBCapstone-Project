# Decision Evaluator

## Overview

The purpose of this application is to act as an aid when comparing options in order to make a decision. Users can compare options using weighted criteria, calculate rankings as guests, and create an account to save private decisions.

## Live application

[Open Decision Evaluator](https://sbcapstone-project.onrender.com)

## Features

- Guest decision calculation
- Weighted criteria and option scoring
- Ranked results with percentages
- Registration, login, and logout
- Private saved decisions
- Create, load, update, and delete
- Responsive layout and validation

## How the scoring works

Each option receives a score from 1–5 for every criterion. Each score is multiplied by that criterion’s importance weight. The contributions are added, sorted from highest to lowest, and shown as a percentage of the maximum possible score.

## Technology

- React
- Vite
- Node.js
- Express
- MongoDB Atlas
- Mongoose
- JSON Web Tokens
- bcryptjs
- HTTP-only cookies

## Local setup

Create `server/.env` before running the server

Server:

```bash
cd server
npm install
npm run dev
```

Client:

```bash
cd client
npm install
npm run dev
```

## Environment variables

- `MONGODB_URI` — MongoDB Atlas connection string
- `JWT_SECRET` — secret used to sign login tokens
- `NODE_ENV` — environment name, such as development or production

## API endpoints

- `GET /api/health`
- `POST /api/evaluations`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/decisions`
- `POST /api/decisions`
- `PUT /api/decisions/:id`
- `DELETE /api/decisions/:id`

## Future improvements

- Decision templates
- Criterion contribution breakdowns
- What-if analysis
- Exportable results
