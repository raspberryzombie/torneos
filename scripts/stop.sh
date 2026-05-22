#!/bin/bash

if [ -f /tmp/torneos-backend.pid ]; then
    kill $(cat /tmp/torneos-backend.pid) 2>/dev/null
    rm /tmp/torneos-backend.pid
    echo "Backend stopped"
fi

if [ -f /tmp/torneos-frontend.pid ]; then
    kill $(cat /tmp/torneos-frontend.pid) 2>/dev/null
    rm /tmp/torneos-frontend.pid
    echo "Frontend stopped"
fi

pkill -f "uvicorn app.main:app" 2>/dev/null
pkill -f "vite" 2>/dev/null

echo "Torneos app stopped"