#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# --- Configuration ---
# It's best practice to source these from a secure .env file
# For example: source /path/to/your/.env
DB_USER="chimera_user"
DB_PASSWORD="chimera_password"
DB_NAME="chimera_db"
DB_HOST="localhost" # Assuming you run this from the host machine
DB_PORT="5432"
BACKUP_DIR="/path/to/your/backups" # IMPORTANT: Change this to your desired backup location
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
BACKUP_FILE="${BACKUP_DIR}/${DB_NAME}_backup_${TIMESTAMP}.sql.gz"

# --- Main Logic ---

echo "Starting database backup for '${DB_NAME}'..."


# Ensure the backup directory exists
mkdir -p "${BACKUP_DIR}"

# Set the password for pg_dump to use
export PGPASSWORD=$DB_PASSWORD

# Perform the backup using pg_dump
# -h: host, -p: port, -U: user, -d: database name
# --format=c: custom, compressed format
# --blobs: include large objects
# We pipe the output directly to gzip for compression
pg_dump -h ${DB_HOST} -p ${DB_PORT} -U ${DB_USER} -d ${DB_NAME} --format=c --blobs | gzip > "${BACKUP_FILE}"
#testing comment
# Unset the password variable for security
unset PGPASSWORD

echo "✅ Backup successful!"
echo "File created at: ${BACKUP_FILE}"

# --- Optional Cleanup ---
# Remove backups older than 30 days
echo "Cleaning up old backups (older than 30 days)..."
find "${BACKUP_DIR}" -type f -name "*.sql.gz" -mtime +30 -delete
echo "Cleanup complete."

exit 0