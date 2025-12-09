# Monitor Project

A small Node.js + Express service that exposes Prometheus metrics and a simple web dashboard.

## Features

- Exposes Prometheus-compatible metrics at `/metrics` using `prom-client`.
- Serves a minimal dashboard UI at `/` that:
  - Shows basic service status (up / down).
  - Displays last update time and scrape result.
  - Renders the raw Prometheus metrics text.

## Getting started

1. Install dependencies:

```bash
npm install
```

2. Start the server:

```bash
npm start
```

3. Open the dashboard in your browser:

```text
http://localhost:3001/
```

- Prometheus scrape endpoint: `http://localhost:3001/metrics`

## Running in Docker / Kubernetes

This repo includes a `dockerfile` and Kubernetes manifests in `k8s/` for deployment. After building and pushing your image, update the image reference in `k8s/deployment.yaml` if needed, then apply the manifests to your cluster.
