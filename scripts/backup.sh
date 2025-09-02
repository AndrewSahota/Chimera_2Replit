
#!/bin/bash

# Chimera Trading Terminal Backup Script
# This script backs up the database and important configuration files

BACKUP_DIR="backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="chimera_backup_$TIMESTAMP"

echo "🔄 Starting Chimera Trading Terminal backup..."

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Database backup
if [ -n "$DATABASE_URL" ]; then
    echo "📊 Backing up database..."
    pg_dump $DATABASE_URL > "$BACKUP_DIR/${BACKUP_FILE}_database.sql"
    echo "✅ Database backup completed"
else
    echo "⚠️ DATABASE_URL not found, skipping database backup"
fi

# Configuration backup
echo "📁 Backing up configuration files..."
tar -czf "$BACKUP_DIR/${BACKUP_FILE}_config.tar.gz" \
    .env* \
    prisma/ \
    docker-compose.yml \
    package.json \
    tsconfig.json \
    vite.config.ts 2>/dev/null

echo "✅ Configuration backup completed"

# Application backup
echo "📦 Backing up application code..."
tar -czf "$BACKUP_DIR/${BACKUP_FILE}_app.tar.gz" \
    apps/ \
    components/ \
    pages/ \
    packages/ \
    scripts/ \
    types.ts \
    App.tsx \
    index.tsx 2>/dev/null

echo "✅ Application backup completed"

echo "🎉 Backup completed successfully!"
echo "📁 Backup files created in $BACKUP_DIR/"
ls -la $BACKUP_DIR/*$TIMESTAMP*

# Clean up old backups (keep last 10)
echo "🧹 Cleaning up old backups..."
cd $BACKUP_DIR
ls -t chimera_backup_* | tail -n +11 | xargs -r rm
echo "✅ Cleanup completed"
