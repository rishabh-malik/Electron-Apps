const electron = require('electron');
const Menubar = require('menubar');
const globalShortcut = electron.globalShortcut;

const menubar = Menubar();

menubar.on('ready', function () {
  console.log('Application is ready.');

  var createClipping = globalShortcut.register('CommandOrControl+!', function () {
    menubar.window.webContents.send('create-new-clipping');
  });

  var copyClipping = globalShortcut.register('CmdOrCtrl+Alt+@', function () {
    menubar.window.webContents.send('clipping-to-clipboard');
  });

  var publishClipping = globalShortcut.register('CmdOrCtrl+Alt+#', function () {
    menubar.window.webContents.send('publish-clipping');
  });

  if (!createClipping) { console.log('Registration failed', 'createClipping'); }
  if (!copyClipping) { console.log('Registration failed', 'copyClipping'); }
  if (!publishClipping) { console.log('Registration failed', 'publishClipping'); }
});

menubar.on('after-create-window', function () {
  menubar.window.loadURL(`file://${__dirname}/index.html`);
});
