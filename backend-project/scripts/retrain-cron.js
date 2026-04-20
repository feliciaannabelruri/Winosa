/**
 * retrain-cron.js
 * 
 * Scheduled ML retraining pipeline for Winosa.
 * Runs every Sunday at 03:00 AM (weekly retrain).
 * 
 * Usage:
 *   node scripts/retrain-cron.js
 * 
 * Or add to package.json scripts:
 *   "cron:retrain": "node scripts/retrain-cron.js"
 * 
 * For production, run with PM2:
 *   pm2 start scripts/retrain-cron.js --name "ml-retrain-cron"
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const cron = require('node-cron');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// ── CONFIG ─────────────────────────────────────────────────────────────────────
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5001';
const BACKEND_API    = `http://localhost:${process.env.PORT || 5000}/api`;
const LOG_DIR        = path.join(__dirname, '../backups/ml-logs');
const MAX_LOG_FILES  = 30; // keep last 30 log entries

// ── Ensure log directory exists ────────────────────────────────────────────────
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

// ── Logger ─────────────────────────────────────────────────────────────────────
function log(level, msg, data = null) {
  const ts  = new Date().toISOString();
  const line = `[${ts}] [${level.toUpperCase()}] ${msg}${data ? ' ' + JSON.stringify(data) : ''}`;
  console.log(line);

  // Append to daily log file
  const date    = new Date().toISOString().slice(0, 10);
  const logFile = path.join(LOG_DIR, `ml-retrain-${date}.log`);
  fs.appendFileSync(logFile, line + '\n', 'utf8');
}

// ── Cleanup old logs ───────────────────────────────────────────────────────────
function cleanupOldLogs() {
  try {
    const files = fs.readdirSync(LOG_DIR)
      .filter(f => f.endsWith('.log'))
      .map(f => ({ name: f, mtime: fs.statSync(path.join(LOG_DIR, f)).mtime }))
      .sort((a, b) => b.mtime - a.mtime);

    if (files.length > MAX_LOG_FILES) {
      files.slice(MAX_LOG_FILES).forEach(f => {
        fs.unlinkSync(path.join(LOG_DIR, f.name));
        log('info', `Deleted old log: ${f.name}`);
      });
    }
  } catch (err) {
    log('warn', 'Failed to cleanup old logs', { error: err.message });
  }
}

// ── Health check ML service ────────────────────────────────────────────────────
async function checkMLHealth() {
  try {
    const res = await axios.get(`${ML_SERVICE_URL}/health`, { timeout: 5000 });
    return res.data;
  } catch (err) {
    throw new Error(`ML service health check failed: ${err.message}`);
  }
}

// ── Check ML stats ────────────────────────────────────────────────────────────
async function getMLStats() {
  try {
    const res = await axios.get(`${ML_SERVICE_URL}/stats`, { timeout: 5000 });
    return res.data;
  } catch {
    return null;
  }
}

// ── Fetch blogs for training ───────────────────────────────────────────────────
async function fetchBlogsForTraining() {
  const blogs = [];
  let page = 1;
  const limit = 100;

  while (true) {
    const res = await axios.get(`${BACKEND_API}/blog?page=${page}&limit=${limit}`, {
      timeout: 15000,
    });
    const data = res.data?.data || [];
    if (!data.length) break;

    blogs.push(...data);

    const totalPages = res.data?.pages || 1;
    if (page >= totalPages) break;
    page++;
  }

  return blogs;
}

// ── Main retrain function ──────────────────────────────────────────────────────
async function runRetrain() {
  const startTime = Date.now();
  log('info', '═'.repeat(55));
  log('info', '🔄 Starting scheduled ML retraining...');
  log('info', `   ML Service: ${ML_SERVICE_URL}`);
  log('info', `   Backend API: ${BACKEND_API}`);

  try {
    // 1. Health check
    log('info', 'Step 1/4: Checking ML service health...');
    const health = await checkMLHealth();
    log('info', 'ML service is healthy', {
      is_trained: health.is_trained,
      total_blogs: health.total_blogs,
    });

    // 2. Fetch blog data
    log('info', 'Step 2/4: Fetching blogs from backend...');
    let blogs = [];
    try {
      blogs = await fetchBlogsForTraining();
      log('info', `Fetched ${blogs.length} published blogs`);
    } catch (fetchErr) {
      log('warn', 'Direct blog fetch failed, letting ML service auto-fetch', { error: fetchErr.message });
    }

    // 3. Train model
    log('info', 'Step 3/4: Training ML model...');
    const trainRes = await axios.post(
      `${ML_SERVICE_URL}/train`,
      blogs.length > 0 ? { blogs } : {},
      { timeout: 120000 } // 2-minute timeout
    );

    const trainData = trainRes.data;

    if (!trainData.success) {
      throw new Error(trainData.error || 'Training failed without error message');
    }

    log('info', '✅ Training completed successfully!', {
      total_blogs: trainData.total_blogs,
      mae: trainData.mae,
      algorithm: trainData.algorithm,
    });

    // 4. Verify model
    log('info', 'Step 4/4: Verifying model stats...');
    const stats = await getMLStats();
    if (stats) {
      log('info', 'Model verification passed', {
        is_trained: stats.is_trained,
        version: stats.model_version,
        semantic_available: stats.semantic_available,
      });
    }

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    log('info', `🎉 Retraining pipeline completed in ${elapsed}s`);
    log('info', '═'.repeat(55));

    // Cleanup old logs after successful run
    cleanupOldLogs();

    return { success: true, blogs: trainData.total_blogs, mae: trainData.mae };

  } catch (err) {
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    log('error', `❌ Retraining FAILED after ${elapsed}s`, { error: err.message });
    log('info', '═'.repeat(55));
    return { success: false, error: err.message };
  }
}

// ── Schedule: Every Sunday at 03:00 AM ────────────────────────────────────────
// Cron: '0 3 * * 0' = At 03:00 on Sunday
// Cron: '0 3 * * *' = Every day at 03:00 (alternative)

const CRON_SCHEDULE = process.env.ML_RETRAIN_SCHEDULE || '0 3 * * 0';

log('info', '═'.repeat(55));
log('info', '🤖 Winosa ML Retraining Cron Started');
log('info', `   Schedule: ${CRON_SCHEDULE} (Sundays @ 03:00 AM)`);
log('info', '   Run manually: set ML_RETRAIN_SCHEDULE="* * * * *" to test');
log('info', '═'.repeat(55));

// Validate cron expression
if (!cron.validate(CRON_SCHEDULE)) {
  log('error', `Invalid cron schedule: "${CRON_SCHEDULE}"`);
  process.exit(1);
}

// Register cron job
cron.schedule(CRON_SCHEDULE, async () => {
  log('info', `⏰ Cron triggered: ${new Date().toISOString()}`);
  await runRetrain();
}, {
  timezone: 'Asia/Jakarta', // WIB timezone
});

// ── Run immediately on start (optional) ───────────────────────────────────────
if (process.env.RUN_ON_START === 'true') {
  log('info', 'RUN_ON_START=true — running initial retrain now...');
  runRetrain().then((result) => {
    if (!result.success) {
      log('warn', 'Initial retrain failed, will retry on next schedule');
    }
  });
}

log('info', '✅ Cron scheduler is running. Waiting for next scheduled run...');
log('info', `   Next run: ${CRON_SCHEDULE}`);
log('info', '   Press Ctrl+C to stop.\n');

// ── Graceful shutdown ──────────────────────────────────────────────────────────
process.on('SIGINT', () => {
  log('info', 'SIGINT received — shutting down cron gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  log('info', 'SIGTERM received — shutting down cron gracefully...');
  process.exit(0);
});

process.on('uncaughtException', (err) => {
  log('error', 'Uncaught exception in cron', { error: err.message, stack: err.stack });
});
