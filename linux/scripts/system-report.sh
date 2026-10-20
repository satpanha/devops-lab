#!/usr/bin/env bash

# Linux System Health Report

print_section() {
    printf '\n--- %s ---\n' "$1"
}

# 1. Basic system information
printf '===== LINUX SYSTEM HEALTH REPORT =====\n'
printf 'Generated: %s\n' "$(date '+%Y-%m-%d %H:%M:%S')"
printf 'Hostname:  %s\n' "$(hostname)"
printf 'Uptime:    %s\n' "$(uptime -p)"

# 2. Disk usage
print_section "Disk Usage"
df -h /

# 3. Memory usage
print_section "Memory Usage"
free -h

# 4. Docker availability
print_section "Docker Status"

if ! command -v docker >/dev/null 2>&1; then
    printf 'WARNING: Docker command was not found.\n'
elif docker info >/dev/null 2>&1; then
    printf 'OK: Docker daemon is accessible.\n'
else
    printf 'WARNING: Docker is installed, but the daemon is not accessible.\n'
fi

# 5. Finish the report
printf '\nReport complete.\n'
