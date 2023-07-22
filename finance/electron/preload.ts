const { contextBridge } = require("electron");
const fs = require("fs");
const path = require("path");

const API = {
	fs: fs,
	path: path,
  dirName: __dirname,
};

contextBridge.exposeInMainWorld("api", API);
