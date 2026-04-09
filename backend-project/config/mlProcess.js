const { spawn } = require('child_process');
const path      = require('path');
const fs        = require('fs');

const ML_DIR = path.join(__dirname, '../../ml/blog-recommendation');

let mlProcess    = null;
let restartCount = 0;
const MAX_RESTART = 3;

const getPythonCmd = () => {
  // Cari conda ml-env
  const condaPath = path.join(
    process.env.USERPROFILE || 'C:\\Users\\LAPTOP',
    'anaconda3', 'envs', 'ml-env', 'python.exe'
  );
  if (fs.existsSync(condaPath)) return condaPath;

  // Cari anaconda3 base
  const anacondaPath = path.join(
    process.env.USERPROFILE || 'C:\\Users\\LAPTOP',
    'anaconda3', 'python.exe'
  );
  if (fs.existsSync(anacondaPath)) return anacondaPath;

  return process.platform !== 'win32' ? 'python3' : 'python';
};

const checkMLExists = () => {
  const appPath = path.join(ML_DIR, 'app.py');
  if (!fs.existsSync(appPath)) {
    console.warn(`⚠️  ML service tidak ditemukan di: ${ML_DIR}`);
    return false;
  }
  return true;
};

const startMLService = () => {
  if (!checkMLExists()) return;

  const pythonCmd = getPythonCmd();

  console.log(`\n🤖 Starting ML service...`);
  console.log(`   Command : ${pythonCmd} app.py`);
  console.log(`   Dir     : ${ML_DIR}`);

  mlProcess = spawn(pythonCmd, ['app.py'], {
    cwd: ML_DIR,
    env: {
      ...process.env,
      BACKEND_API_URL: process.env.ML_BACKEND_API_URL || `http://localhost:${process.env.PORT || 5000}/api`,
      ML_PORT: process.env.ML_PORT || '5001',
      AUTO_TRAIN: 'true',
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  mlProcess.stdout.on('data', (data) => {
    data.toString().trim().split('\n')
      .forEach(line => { if (line.trim()) console.log(`  [ML] ${line}`); });
  });

  mlProcess.stderr.on('data', (data) => {
    data.toString().trim().split('\n')
      .forEach(line => { if (line.trim()) console.log(`  [ML] ${line}`); });
  });

  mlProcess.on('close', (code) => {
    mlProcess = null;
    if (code === 0) { console.log('✅ ML service stopped normally'); return; }
    console.warn(`⚠️  ML service exited with code ${code}`);
    if (restartCount < MAX_RESTART) {
      restartCount++;
      console.log(`🔄 Restarting ML service (attempt ${restartCount}/${MAX_RESTART}) in 5s...`);
      setTimeout(startMLService, 5000);
    } else {
      console.error(`❌ ML service failed ${MAX_RESTART} times. Not restarting.`);
    }
  });

  mlProcess.on('error', (err) => {
    mlProcess = null;
    console.error(`❌ ML service error: ${err.message}`);
  });
};

const stopMLService = () => {
  if (mlProcess) {
    console.log('\n🛑 Stopping ML service...');
    mlProcess.kill('SIGTERM');
    mlProcess = null;
  }
};

module.exports = { startMLService, stopMLService };