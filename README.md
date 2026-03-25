# 🖥️ System Monitor Dashboard

A high-end, real-time hardware telemetry dashboard built with Next.js and Node.js. It provides deep visibility into CPU, Memory, Disk, and Uptime metrics with a premium, motion-driven user interface.

## ✨ Features
- **Dynamic Hardware Detection**: Real-time identification of host CPU model, cores, threads, and clock speeds.
- **High-End UI**: Dark-mode glassmorphism design with interactive charts and hover specifications.
- **Cross-Platform Telemetry**: Automated metric collection via PowerShell (Windows) and Bash (Unix).
- **Critical Alerts**: Visual notifications for system spikes and performance thresholds.

## 🏗️ Architecture
- **Backend**: Lightweight Express server executing native OS scripts to minimize overhead.
- **Frontend**: Next.js App Router with Server Components for performance and Client Components for rich interactions.
- **Communication**: Environment-driven REST API with a 3-second polling interval.

## 🛠️ Security & Scaling
- **Zero-Secret Baseline**: No hardcoded credentials or ports. Configuration is decoupled via `.env`.
- **Modular Components**: Clean separation between `common` UI elements and `monitor` features.

## 👨‍💻 Contributing
See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.
