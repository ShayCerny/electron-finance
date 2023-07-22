import { app, BrowserWindow } from "electron";
import path from "node:path";

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = path.join(__dirname, "../dist");
process.env.PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, "../public");

let win: BrowserWindow | null;
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];

const isMac = process.platform === "darwin";

function createWindow() {
	win = new BrowserWindow({
		icon: path.join(process.env.PUBLIC, "electron-vite.svg"),
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
			nodeIntegration:true,
		},
		minWidth:1000,
		minHeight:650,
		show: false,
		autoHideMenuBar:true,
		title:"Finance",
	});

	const splash = new BrowserWindow({
		width: 500,
		height: 300,
		transparent: true,
		frame: false,
		alwaysOnTop: true,
	});

	splash.loadFile(path.join(process.env.DIST, "splash.html"));
	splash.center;

	// Test active push message to Renderer-process.
	win.webContents.on("did-finish-load", () => {
		win?.webContents.send("main-process-message", new Date().toLocaleString());
	});

	if (VITE_DEV_SERVER_URL) {
		win.loadURL(VITE_DEV_SERVER_URL);
	} else {
		// win.loadFile('dist/index.html')
		win.loadFile(path.join(process.env.DIST, "index.html"));
	}

	setTimeout(() => {
		splash.close();
		win?.show();
	}, 2000);
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
	if (!isMac) app.quit();
});