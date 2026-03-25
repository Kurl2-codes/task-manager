# Contributing to System Monitor Dashboard

Thank you for your interest in contributing! This project is designed to be a high-performance, modular system monitoring tool.

## 🛠️ Tech Stack
- **Frontend**: Next.js 15, Tailwind CSS, Motion (Framer Motion), Recharts.
- **Backend**: Node.js, Express, Shell/PowerShell scripts.

## 📁 Project Structure
- `/components/common`: Shared UI components (Modals, Notifications).
- `/components/monitor`: Feature-specific components for hardware telemetry.
- `/system-monitor-backend`: Express API and data collection scripts.
  - `/scripts`: OS-specific telemetry collectors.
  - `/services`: Business logic and script orchestration.

## 🚀 Getting Started
1. **Environment Setup**:
   - Copy `.env.example` to `.env` in both the root and `system-monitor-backend`.
   - Ensure `NEXT_PUBLIC_API_URL` points to your backend.
2. **Installation**:
   ```bash
   npm install
   cd system-monitor-backend && npm install
   ```
3. **Execution**:
   ```bash
   # Terminal 1 (Frontend)
   npm run dev
   # Terminal 2 (Backend)
   cd system-monitor-backend && node server.js
   ```

## 📝 Coding Standards
- **Modularity**: Keep components small and focused. Reuse `common` components where possible.
- **Environment**: Never hardcode ports or external URLs. Use `process.env`.
- **Types**: Use TypeScript interfaces for all component props.
- **Security**: Never commit `.env` files. Always update `.env.example` if you add new variables.

## 🐛 Bug Reports & Feature Requests
Please use the GitHub Issue tracker to report bugs or suggest enhancements.
