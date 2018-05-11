const { app, BrowserWindow, dialog } = require('electron');
const fs=require('fs');

//for multiple windows of our app , set is a data structure
const windows=new Set();

const createWindow=exports.createWindow=(file)=>{
  let newWindow = new BrowserWindow({ show: false });
  windows.add(newWindow);

  newWindow.loadURL(`file://${__dirname}/index.html`);

  newWindow.once('ready-to-show', () => {
    if (file) openFile(newWindow,file);
    newWindow.show();
  });

  //event triggered before closing app
  newWindow.on('close',(event)=>{
    if(newWindow.isDocumentEdited()){
      event.preventDefault();
      const result=dialog.showMessageBox(newWindow,{
        type:'warning',
        title:'Quit with unsaved changes?',
        message:'Your changes will be lost.',
        buttons:[
          'Quit Anyway',
          'Cancel'
        ],
        defaultId:1,
        cancelId:1
      });

      if(result===0){
        newWindow.destroy();
      }
    }
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

  //adding to recent files
  app.addRecentDocument(file);

  //sending the file and contents to the renderer process
  targetWindow.webContents.send('file-opened',file,content);
  
  //only for macos
  targetWindow.setRepresentedFilename(file);
}

app.on('ready', () => {
  createWindow();
});

//launching recent files
app.on('will-finish-launching',()=>{
  app.on('open-file',(event,filePath)=>{
    createWindow(filePath);
  });
});