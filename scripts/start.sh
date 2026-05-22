#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

SERVER_IP=$(hostname -I | awk '{print $1}')

cd "$PROJECT_DIR/backend"
source venv/bin/activate 2>/dev/null || echo "Warning: venv not found, using system Python"
nohup python -m uvicorn app.main:app --host 0.0.0.0 --port 5677 > /tmp/torneos-backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend started (PID: $BACKEND_PID)"

cd "$PROJECT_DIR/frontend"
VITE_API_URL="http://${SERVER_IP}:5677" nohup npm run dev -- --host 0.0.0.0 --port 5679 > /tmp/torneos-frontend.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend started (PID: $FRONTEND_PID)"

echo "$BACKEND_PID" > /tmp/torneos-backend.pid
echo "$FRONTEND_PID" > /tmp/torneos-frontend.pid

echo "Torneos app started successfully"
echo "Backend: http://${SERVER_IP}:5677"
echo "Frontend: http://${SERVER_IP}:5679"