# Beszel

Lightweight server monitoring with Docker stats, historical data, and alerts.

## What is Beszel?

Beszel is a lightweight server monitoring platform with a friendly web interface, simple configuration, and is ready to use out of the box. It supports automatic backup, multi-user OAuth authentication, and API access.

**Key features:**

- **Lightweight** – Smaller and less resource-intensive than leading solutions
- **Simple** – Easy setup with little manual configuration required
- **Docker stats** – Tracks CPU, memory, and network usage history for each container
- **Alerts** – Configurable alerts for CPU, memory, disk, bandwidth, temperature, load average, and status
- **Multi-user** – Users manage their own systems. Admins can share systems across users.
- **OAuth / OIDC** – Supports many OAuth2 providers. Password auth can be disabled.
- **Automatic backups** – Save to and restore from disk or S3-compatible storage

## Getting Started

1. Start Beszel
2. Open the Web UI from the **Properties** section of the service
3. Create your admin account
4. Add systems to monitor by following the prompts in the web UI

### Adding Systems to Monitor

Systems to monitor use the **Beszel Agent**, which runs as a lightweight client on each machine. When adding a system in the Beszel web UI:

1. Click **Add System** in the dashboard
2. Follow the instructions to install and configure the agent on the target machine
3. The agent will report metrics back to this hub automatically

## Actions

No actions are currently exposed for this service. All configuration is done through the web UI.

## Backups

This service stores its data in a single volume (`main`). Standard StartOS backup/restore is supported.

## Security

- Access is controlled through the Beszel web UI (user accounts)
- OAuth integration is available for SSO
- All traffic is encrypted via StartOS's Tor or LAN interfaces
