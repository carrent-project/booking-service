#!/bin/bash

BACKUP_DIR="$(dirname "$0")/.backups"
mkdir -p "$BACKUP_DIR"

docker exec -t booking_db pg_dump -U postgres booking_db > "$BACKUP_DIR/booking_db_$(date +%Y%m%d_%H%M%S).sql"

echo "✅ Booking DB backup saved to $BACKUP_DIR"
