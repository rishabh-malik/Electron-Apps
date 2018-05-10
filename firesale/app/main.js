const { app, BrowserWindow, dialog } = require('electron');
const fs=require('fs');

//for multiple windows of our app , set is a data structure
const windows=new Set();

const createWindow=exports.createWindow=()=>{
  let newWindow = new BrowserWindow({ show: false });
  windows.add(newWindow);

  newWindow.loadURL(`file://${__dirname}/index.html`);

  newWindow.once('ready-to-show', () => {
    newWindow.show();
  });

  newWindow.on('closed', () => {
    windows.delete(newWindow);
    newWindow = null;
  });
}

//opening a file since dialog is only available in the main
const getFileFromUserSelection=exports.getFileFromUserSelection=(targetWindow)=>{
  const files=dialog.showOpenDialog(targetWindow,{
    properties:['openFile'],
    filters:[
      {name:'Text Files',extensions:['txt','text']},
      {name:'Markdown Files',extensions:['md']}
    ]
  });

  if(!files) return;

  return files[0];
 
}

const openFile=exports.openFile=(targetWindow, filePath)=>{
  const file=filePath || getFileFromUserSelection(targetWindow);
  const content=fs.readFileSync(file).toString();
  //console.log(content);

  //sending the file and contents to the renderer process
  targetWindow.webContents.send('file-opened',file,content);
}

app.on('ready', () => {
  createWindow();
});
