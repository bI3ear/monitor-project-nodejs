# 📊 Monitor Project - Node.js

A lightweight Node.js + Express monitoring service that exposes Prometheus-compatible metrics and provides a real-time web dashboard for service health monitoring.

## ✨ Features

### 🔍 Prometheus Integration
- **Metrics Endpoint:** Exposes Prometheus-compatible metrics at `/metrics` using `prom-client`
- **Auto-collection:** Automatic collection of default Node.js metrics
- **Custom Metrics:** Support for custom application metrics
- **Scrape Ready:** Production-ready endpoint for Prometheus server scraping

### 📈 Web Dashboard
- **Real-time Status:** Live service status indicator (up/down)
- **Last Update Tracking:** Displays timestamp of last metrics scrape
- **Metrics Visualization:** Renders raw Prometheus metrics in readable format
- **Responsive UI:** Clean, minimal interface accessible from any device

### ☁️ Cloud-Native Ready
- **Docker Support:** Includes optimized Dockerfile for containerization
- **Kubernetes Manifests:** Pre-configured K8s deployment files
- **Scalable Architecture:** Designed for horizontal scaling
- **Health Checks:** Built-in readiness and liveness probe support

## 🚀 Quick Start

### Prerequisites

- Node.js 14.x or higher
- npm or yarn package manager

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/bI3ear/monitor-project-nodejs.git
cd monitor-project-nodejs
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the server**
```bash
npm start
```

4. **Access the application**
- Dashboard: [http://localhost:3001/](http://localhost:3001/)
- Metrics endpoint: [http://localhost:3001/metrics](http://localhost:3001/metrics)

## 🐳 Docker Deployment

### Build Docker Image

```bash
docker build -t monitor-project-nodejs .
```

### Run Container

```bash
docker run -d \
  --name monitor-service \
  -p 3001:3001 \
  monitor-project-nodejs
```

### Using Docker Compose

Create a `docker-compose.yml` file:

```yaml
version: '3.8'
services:
  monitor:
    build: .
    ports:
      - "3001:3001"
    restart: unless-stopped
    environment:
      - NODE_ENV=production
```

Run with:
```bash
docker-compose up -d
```

## ☸️ Kubernetes Deployment

### Prerequisites

- Kubernetes cluster (local or cloud)
- kubectl configured
- Docker image pushed to registry

### Deployment Steps

1. **Update the image reference** in `k8s/deployment.yaml`:
```yaml
spec:
  containers:
  - name: monitor
    image: your-registry/monitor-project-nodejs:latest
```

2. **Apply Kubernetes manifests**
```bash
kubectl apply -f k8s/
```

3. **Verify deployment**
```bash
kubectl get pods
kubectl get services
```

4. **Access the service**
```bash
# Get service URL (for cloud providers with LoadBalancer)
kubectl get svc monitor-service

# Port forward for local testing
kubectl port-forward svc/monitor-service 3001:3001
```

### Kubernetes Manifests Structure

```
k8s/
├── deployment.yaml    # Application deployment configuration
├── service.yaml      # Service exposure configuration
└── ingress.yaml      # (Optional) Ingress rules
```

## 📊 Prometheus Configuration

Add this scrape configuration to your `prometheus.yml`:

```yaml
scrape_configs:
  - job_name: 'monitor-nodejs'
    scrape_interval: 15s
    static_configs:
      - targets: ['localhost:3001']
    metrics_path: '/metrics'
```

For Kubernetes deployments:

```yaml
scrape_configs:
  - job_name: 'monitor-nodejs-k8s'
    kubernetes_sd_configs:
      - role: pod
    relabel_configs:
      - source_labels: [__meta_kubernetes_pod_label_app]
        regex: monitor-service
        action: keep
```

## 📁 Project Structure

```
monitor-project-nodejs/
├── public/              # Static assets (CSS, client-side JS)
│   ├── styles.css      # Dashboard styling
│   └── script.js       # Client-side functionality
├── k8s/                # Kubernetes deployment manifests
│   ├── deployment.yaml
│   ├── service.yaml
│   └── configmap.yaml
├── index.js            # Main application entry point
├── dockerfile          # Docker container configuration
├── package.json        # Node.js dependencies and scripts
├── commands.txt        # Useful commands reference
└── README.md           # This file
```

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Metrics:** prom-client (Prometheus client library)
- **Containerization:** Docker
- **Orchestration:** Kubernetes
- **Monitoring:** Prometheus-compatible

## 📝 Available Scripts

```bash
npm start          # Start the production server
npm run dev        # Start development server with auto-reload
npm test           # Run test suite
npm run lint       # Run ESLint
```

## 🔧 Configuration

### Environment Variables

```bash
PORT=3001                    # Server port (default: 3001)
NODE_ENV=production          # Environment mode
METRICS_PREFIX=app_          # Prefix for custom metrics
```

### Custom Metrics

Add custom metrics in `index.js`:

```javascript
const { register, Counter, Histogram } = require('prom-client');

// Example: HTTP request counter
const httpRequestCounter = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'status']
});

// Example: Request duration histogram
const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  buckets: [0.1, 0.5, 1, 2, 5]
});
```

## 📊 Available Metrics

### Default Node.js Metrics
- `process_cpu_user_seconds_total` - User CPU time
- `process_cpu_system_seconds_total` - System CPU time
- `process_resident_memory_bytes` - Resident memory size
- `nodejs_heap_size_total_bytes` - Total heap size
- `nodejs_heap_size_used_bytes` - Used heap size
- `nodejs_eventloop_lag_seconds` - Event loop lag

### Custom Application Metrics
- `http_requests_total` - Total HTTP requests
- `http_request_duration_seconds` - Request duration histogram
- Add your own as needed!

## 🔍 Monitoring Best Practices

### Health Checks

The application includes health check endpoints:
- `GET /health` - Basic health check
- `GET /ready` - Readiness probe
- `GET /metrics` - Prometheus metrics

### Alerting Rules

Example Prometheus alerting rules:

```yaml
groups:
  - name: monitor-nodejs
    rules:
      - alert: ServiceDown
        expr: up{job="monitor-nodejs"} == 0
        for: 1m
        annotations:
          summary: "Monitor service is down"
          
      - alert: HighMemoryUsage
        expr: process_resident_memory_bytes > 500000000
        for: 5m
        annotations:
          summary: "High memory usage detected"
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process using port 3001
lsof -ti:3001 | xargs kill -9

# Or change the port
PORT=3002 npm start
```

### Docker Build Issues
```bash
# Clear Docker cache
docker system prune -a

# Rebuild without cache
docker build --no-cache -t monitor-project-nodejs .
```

### Kubernetes Pod Not Starting
```bash
# Check pod logs
kubectl logs -f <pod-name>

# Describe pod for events
kubectl describe pod <pod-name>

# Check resource constraints
kubectl top pods
```

## 🤝 Contributing

Contributions are welcome! Here are some ways you can contribute:

### Ideas for Improvement
- Add support for more metric types (Summary, Gauge)
- Implement authentication/authorization
- Add GraphQL endpoint for metrics
- Create Grafana dashboard templates
- Add more comprehensive health checks
- Implement distributed tracing
- Add metric aggregation features

### How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- [prom-client](https://github.com/siimon/prom-client) - Prometheus client for Node.js
- [Express.js](https://expressjs.com/) - Fast, unopinionated web framework
- [Prometheus](https://prometheus.io/) - Monitoring system and time series database

## 👤 Author

**bI3ear**

- GitHub: [@bI3ear](https://github.com/bI3ear)
- Repository: [monitor-project-nodejs](https://github.com/bI3ear/monitor-project-nodejs)

## 📊 Project Stats

![JavaScript](https://img.shields.io/badge/JavaScript-39.7%25-yellow)
![CSS](https://img.shields.io/badge/CSS-38.2%25-blue)
![HTML](https://img.shields.io/badge/HTML-22.1%25-orange)
![License](https://img.shields.io/badge/License-MIT-green)

## 🔗 Related Resources

- [Prometheus Documentation](https://prometheus.io/docs/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)

## ⭐ Show Your Support

Give a ⭐️ if this project helped you with monitoring and observability!

---

Built with 📊 for modern application monitoring
