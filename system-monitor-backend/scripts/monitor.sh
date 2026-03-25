#!/bin/bash

# Detect Environment
IS_WINDOWS=false
if [[ "$OSTYPE" == "cygwin" || "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    IS_WINDOWS=true
fi

if [ "$IS_WINDOWS" = true ]; then
    # Fallback to powershell if called directly on Windows
    powershell.exe -NoProfile -ExecutionPolicy Bypass -File "$(dirname "$0")/monitor.ps1"
    exit 0
fi

# --- LINUX / UNIX ---
# CPU Info
cpu_val=$(top -bn1 | grep "Cpu(s)" | awk '{print $2 + $4}' || echo 0)
cpu_model=$(grep -m1 "model name" /proc/cpuinfo | cut -d: -f2 | sed 's/^[ \t]*//' || echo "Unknown")
cpu_cores=$(grep -c ^processor /proc/cpuinfo || echo 0)
cpu_threads=$(nproc || echo 0)
base_clock=$(grep -m1 "cpu MHz" /proc/cpuinfo | awk '{print $4/1000 " GHz"}' || echo "N/A")
cache_size=$(grep -m1 "cache size" /proc/cpuinfo | cut -d: -f2 | sed 's/^[ \t]*//' || echo "N/A")

# Memory Info (GB)
if command -v free >/dev/null 2>&1; then
    total_mem=$(free -h | grep Mem | awk '{print $2}')
    used_mem=$(free -h | grep Mem | awk '{print $3}')
    free_mem=$(free -h | grep Mem | awk '{print $4}')
    memo_val=$(free | grep Mem | awk '{print ($3/$2)*100}')
else
    total_mem="N/A"
    used_mem="N/A"
    free_mem="N/A"
    memo_val=0
fi

# Disk Info
disk_val=$(df / | tail -1 | awk '{print $5}' | sed 's/%//' || echo 0)

# Uptime
uptime_val=$(uptime -p 2>/dev/null || uptime | awk -F'up ' '{print $2}' | awk -F',' '{print $1}')

# Output JSON
printf '{\n  "cpu": %s,\n  "cpuModel": "%s",\n  "cpuCores": %s,\n  "cpuThreads": %s,\n  "baseClock": "%s",\n  "cache": "%s",\n  "memory": %s,\n  "totalMemory": "%s",\n  "usedMemory": "%s",\n  "freeMemory": "%s",\n  "disk": %s,\n  "uptime": "%s"\n}\n' \
    "$cpu_val" \
    "$cpu_model" \
    "$cpu_cores" \
    "$cpu_threads" \
    "$base_clock" \
    "$cache_size" \
    "$memo_val" \
    "$total_mem" \
    "$used_mem" \
    "$free_mem" \
    "$disk_val" \
    "$uptime_val"
