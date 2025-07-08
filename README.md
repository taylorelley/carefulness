# Carefulness Demo

This is a simple Next.js application that visualizes the relationship between carefulness, time and cost. Rotate the knobs to see how the values interact in the bubble chart.

## Development

Install dependencies and run the dev server:

```bash
npm install
npm run dev
```

The site will be available at `http://localhost:3000`.

## Production with Docker Compose

Build and run the production container:

```bash
docker-compose up --build
```

The application will be served on port 3000.

Make sure the `public` directory exists (it can be empty) so the Docker build succeeds.
