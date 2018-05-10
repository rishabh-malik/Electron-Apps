const { app, BrowserWindow, dialog } = require('electron');
const fs=require('fs');

let mainWindow = null;

//opening a file since dialog is only available in the main
const getFileFromUserSelection=exports.getFileFromUserSelection=()=>{
  const files=dialog.showOpenDialog(mainWindow,{
    properties:['openFile'],
    filters:[
      {name:'Text Files',extensions:['txt','text']},
      {name:'Markdown Files',extensions:['md']}
    ]
  });

  if(!files) return;

  return files[0];
 
}

const openFile=exports.openFile=(filePath)=>{
  const file=filePath || getFileFromUserSelection();
  const content=fs.readFileSync(file).toString();
  //console.log(content);

  //sending the file and contents to the renderer process
  mainWindow.webContents.send('file-opened',file,content);
}

app.on('ready', () => {
  mainWindow = new BrowserWindow({ show: false });

  mainWindow.loadURL(`file://${__dirname}/index.html`);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});
