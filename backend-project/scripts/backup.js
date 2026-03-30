#!/usr/bin/env node
/**
 * backup.js — Daily MongoDB backup
 * 
 * CARA PAKAI:
 *   node scripts/backup.js                 → backup manual
 *   node scripts/backup.js --restore <file> → restore dari backup
 * 
 * CRON (setiap hari jam 02:00):
 *   0 2 * * * cd /path/to/project && node scripts/backup.js >> logs/backup.log 2>&1
 * 
 * INSTALL DEPS:
 *   npm install node-cron   (opsional, untuk scheduled backup dalam process)
 */

require('dotenv').config();
const { exec } = require('child_process');
const path     = require('path');
const fs       = require('fs');
const https    = require('https');

const BACKUP_DIR     = path.join(__dirname, '../backups');
const MAX_BACKUPS    = 7;       // simpan 7 hari terakhir
const MONGODB_URI    = process.env.MONGODB_URI;
const DISCORD_WEBHOOK = process.env.BACKUP_DISCORD_WEBHOOK || ''; // optional notif

// ── Helpers ────────────────────────────────────────────────────────
const log = (msg) => console.log(`[${new Date().toISOString()}] ${msg}`);

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

const notify = async (message) => {
  if (!DISCORD_WEBHOOK) return;
  const body = JSON.stringify({ content: message });
  const url  = new URL(DISCORD_WEBHOOK);
  const req  = https.request({
    hostname: url.hostname,
    path:     url.pathname + url.search,
    method:   'POST',
    headers:  { 'Content-Type': 'application/json', 'Content-Length': body.length },
  });
  req.write(body);
  req.end();
};

const rotateOldBackups = () => {
  const files = fs.readdirSync(BACKUP_DIR)
    .filter(f => f.endsWith('.gz') || f.endsWith('.archive'))
    .map(f => ({ name: f, time: fs.statSync(path.join(BACKUP_DIR, f)).mtime }))
    .sort((a, b) => b.time - a.time);

  const toDelete = files.slice(MAX_BACKUPS);
  toDelete.forEach(({ name }) => {
    fs.rmSync(path.join(BACKUP_DIR, name), { recursive: true, force: true });
    log(`Deleted old backup: ${name}`);
  });
};

// ── Parse DB name from URI ─────────────────────────────────────────
const getDbName = (uri) => {
  try {
    const url = new URL(uri);
    return url.pathname.replace('/', '') || 'winosa';
  } catch {
    return 'winosa';
  }
};

// ── Run backup ─────────────────────────────────────────────────────
const runBackup = () => {
  return new Promise((resolve, reject) => {
    if (!MONGODB_URI) {
      return reject(new Error('MONGODB_URI not set in environment'));
    }

    ensureDir(BACKUP_DIR);

    const timestamp  = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const dbName     = getDbName(MONGODB_URI);
    const outputFile = path.join(BACKUP_DIR, `${dbName}_${timestamp}.archive`);

    // mongodump must be installed: https://www.mongodb.com/docs/database-tools/
    const cmd = `mongodump --uri="${MONGODB_URI}" --archive="${outputFile}" --gzip`;

    log(`Starting backup → ${path.basename(outputFile)}`);
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        log(`Backup failed: ${error.message}`);
        notify(`**Winosa Backup FAILED** at ${new Date().toISOString()}\n\`${error.message}\``);
        return reject(error);
      }

      const stats    = fs.statSync(outputFile);
      const sizeMB   = (stats.size / 1024 / 1024).toFixed(2);
      log(`Backup complete: ${path.basename(outputFile)} (${sizeMB} MB)`);
      notify(`**Winosa Backup OK** — ${path.basename(outputFile)} (${sizeMB} MB)`);

      rotateOldBackups();
      resolve(outputFile);
    });
  });
};

// ── Restore ────────────────────────────────────────────────────────
const runRestore = (archiveFile) => {
  return new Promise((resolve, reject) => {
    if (!MONGODB_URI) return reject(new Error('MONGODB_URI not set'));
    if (!fs.existsSync(archiveFile)) return reject(new Error(`File not found: ${archiveFile}`));

    const cmd = `mongorestore --uri="${MONGODB_URI}" --archive="${archiveFile}" --gzip --drop`;

    log(`Restoring from ${path.basename(archiveFile)}...`);
    log('This will DROP existing collections first!');

    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        log(`Restore failed: ${error.message}`);
        return reject(error);
      }
      log('Restore complete');
      resolve();
    });
  });
};

// ── Entry point ────────────────────────────────────────────────────
const args = process.argv.slice(2);

if (args[0] === '--restore') {
  const file = args[1];
  if (!file) {
    console.error('Usage: node scripts/backup.js --restore <path/to/archive>');
    process.exit(1);
  }
  runRestore(file).catch(err => { log(err.message); process.exit(1); });
} else {
  runBackup().catch(err => { log(err.message); process.exit(1); });
}

module.exports = { runBackup, runRestore };
