# System Monitor Dashboard Backend

A modular Node.js/Express backend that executes a Bash script to collect system metrics (CPU, Memory, Disk, Uptime) and returns the data as JSON.

## Features
- **Node.js + Express**: Scalable and lightweight backend.
- **Child Process Execution**: Runs a Bash script to interface with the system.
- **Caching**: Results are cached for 3 seconds to prevent system overhead.
- **Execution Locking**: Prevents multiple overlapping script executions.
- **Security**: Minimal endpoint exposure and sanitized script execution.
- **Modular Structure**: Clean separation of routes, services, and logic.

## Prerequisites
- [Node.js](https://nodejs.org/) (v14+)
- A Bash environment (Git Bash, WSL, or Linux/macOS terminal)

## Installation
1. Navigate to the project directory:
   ```bash
   cd system-monitor-backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Server
Start the server in development mode:
```bash
node server.js
```
The server will start at `http://localhost:3000`.

## API Endpoints
- `GET /stats`: Returns system metrics as JSON.
- `GET /health`: Returns API status and current timestamp.

## Project Structure
```text
system-monitor-backend/
├── middleware/
│   └── logger.js         # Request logging
├── routes/
│   └── stats.js          # Route definitions
├── scripts/
│   └── monitor.sh        # Bash monitoring script
├── services/
│   └── monitorService.js # Script execution & logic
├── server.js             # Entry point
└── package.json          # Dependencies
```

## Response Format (Example)
```json
{
  "cpu": 45.2,
  "memory": 70.5,
  "disk": 60,
  "uptime": "up 3 hours, 15 minutes"
}
```
