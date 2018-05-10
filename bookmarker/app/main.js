const {app,BrowserWindow} = require('electron');

//when app gets ready
app.on('ready',()=>{
    //console.log('the app is ready!');
    const mainWindow=new BrowserWindow({
        width:500,
        height:600,
        titleBarStyle:'hidden-inset',
        show:false
    });

    mainWindow.once('ready-to-show',()=>{
        mainWindow.show();
    });

    //load our own page in the window
    mainWindow.loadURL(`file://${__dirname}/index.html`);
});
