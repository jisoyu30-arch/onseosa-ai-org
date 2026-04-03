const { app, BrowserWindow, Tray, Menu, nativeImage, shell, ipcMain, screen } = require('electron');
const { spawn } = require('child_process');
const path = require('path');
const http = require('http');

const isDev = process.argv.includes('--dev');
const WORKER_PORT = 3001;
const UI_PORT = 5173;

let mainWindow = null;
let widgetWindow = null;
let tray = null;
let workerProcess = null;

// ── 워커 서버 시작 ──────────────────────────────────────────────
function startWorker() {
  const workerDir = isDev
    ? path.join(__dirname, '..', 'claude-worker')
    : path.join(process.resourcesPath, 'worker');

  const cmd = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';
  workerProcess = spawn(cmd, ['dev'], {
    cwd: workerDir,
    env: { ...process.env },
    shell: true,
  });

  workerProcess.stdout.on('data', d => console.log('[Worker]', d.toString().trim()));
  workerProcess.stderr.on('data', d => console.error('[Worker]', d.toString().trim()));
  workerProcess.on('exit', code => console.log('[Worker] 종료:', code));
}

// ── 워커 준비 대기 ──────────────────────────────────────────────
function waitForWorker(retries = 20) {
  return new Promise((resolve, reject) => {
    const check = (n) => {
      http.get(`http://localhost:${WORKER_PORT}/health`, res => {
        if (res.statusCode === 200) resolve();
        else retry(n);
      }).on('error', () => retry(n));
    };
    const retry = (n) => {
      if (n <= 0) return reject(new Error('워커 시작 실패'));
      setTimeout(() => check(n - 1), 1000);
    };
    check(retries);
  });
}

// ── 메인 윈도우 생성 ────────────────────────────────────────────
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 900,
    minHeight: 600,
    title: 'ONS Studio 운영실',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
    show: false,
  });

  const url = isDev
    ? `http://localhost:${UI_PORT}`
    : `file://${path.join(__dirname, 'ui', 'index.html')}`;

  mainWindow.loadURL(url);
  // 시작 시 자동으로 열지 않음 — 트레이 클릭 또는 위젯의 "운영실" 버튼으로 열기

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.on('close', (e) => {
    if (!app.isQuitting) {
      e.preventDefault();
      mainWindow.hide();
    }
  });
}

// ── 위젯 윈도우 생성 (항상 위에 떠있는 사무실 씬) ──────────────────
function createWidget() {
  const { width: sw, height: sh } = screen.getPrimaryDisplay().workAreaSize;

  widgetWindow = new BrowserWindow({
    width: 84,
    height: 84,
    x: sw - 104,
    y: sh - 104,          // 우하단 카드로 시작
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    skipTaskbar: true,
    hasShadow: false,
    webPreferences: {
      preload: path.join(__dirname, 'widget-preload.js'),
      contextIsolation: true,
    },
  });

  widgetWindow.loadFile(path.join(__dirname, 'widget.html'));

  widgetWindow.on('close', (e) => {
    if (!app.isQuitting) {
      e.preventDefault();
      widgetWindow.hide();
    }
  });
}

// ── IPC: 위젯 → 메인 윈도우 제어 ───────────────────────────────
ipcMain.on('hide-widget', () => {
  if (widgetWindow) widgetWindow.hide();
});

ipcMain.on('show-main', () => {
  if (mainWindow) {
    mainWindow.show();
    mainWindow.focus();
  }
});

ipcMain.on('widget-resize', (e, { mode }) => {
  if (!widgetWindow) return;
  const { width: sw, height: sh } = screen.getPrimaryDisplay().workAreaSize;
  if (mode === 'card') {
    widgetWindow.setSize(84, 84);
    widgetWindow.setPosition(sw - 104, sh - 104);
  } else {
    widgetWindow.setSize(1100, 300);
    widgetWindow.setPosition(Math.round((sw - 1100) / 2), sh - 320);
  }
});

// ── 시스템 트레이 ───────────────────────────────────────────────
function createTray() {
  let icon;
  try {
    icon = nativeImage.createFromPath(path.join(__dirname, 'assets', 'icon.png'));
  } catch {
    icon = nativeImage.createEmpty();
  }

  tray = new Tray(icon);
  tray.setToolTip('ONS Studio 운영실');

  const menu = Menu.buildFromTemplate([
    {
      label: '운영실 열기',
      click: () => { mainWindow.show(); mainWindow.focus(); },
    },
    {
      label: '위젯 보이기/숨기기',
      click: () => {
        if (widgetWindow.isVisible()) widgetWindow.hide();
        else widgetWindow.show();
      },
    },
    { type: 'separator' },
    {
      label: '종료',
      click: () => { app.isQuitting = true; app.quit(); },
    },
  ]);

  tray.setContextMenu(menu);
  tray.on('click', () => {
    if (mainWindow.isVisible()) mainWindow.focus();
    else mainWindow.show();
  });
}

// ── 앱 시작 ─────────────────────────────────────────────────────
app.whenReady().then(async () => {
  createTray();

  const workerAlreadyRunning = await waitForWorker(2).then(() => true).catch(() => false);
  if (!workerAlreadyRunning) {
    startWorker();
    await waitForWorker(30).catch(err => {
      console.error('[Desktop] 워커 시작 실패:', err.message);
    });
  } else {
    console.log('[Desktop] 워커 이미 실행 중');
  }

  createWindow();
  createWidget();
});

app.on('window-all-closed', () => {
  // 트레이에 남아있게
});

app.on('activate', () => {
  if (mainWindow) mainWindow.show();
});

app.on('before-quit', () => {
  app.isQuitting = true;
  if (workerProcess) workerProcess.kill();
});
