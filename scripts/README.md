# Deployment - Raspberry Pi

## Quick Start

### Manual
```bash
cd /home/pi/torneos
./scripts/start.sh
```

### Auto-start on boot (systemd)

1. Copy service file:
```bash
sudo cp torneos.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable torneos
sudo systemctl start torneos
```

2. Check status:
```bash
sudo systemctl status torneos
```

## Ports
- Backend: http://localhost:5677
- Frontend: http://localhost:5678

## Logs
```bash
tail -f /tmp/torneos-backend.log
tail -f /tmp/torneos-frontend.log
```