//convert markdown to html
const marked = require('marked');

//for getting the function from main process
//ipcRenderer for listening to main events
const {remote,ipcRenderer,shell}= require('electron');
const mainProcess=remote.require('./main');
const currentWindow=remote.getCurrentWindow();

const markdownView = document.querySelector('#markdown');
const htmlView = document.querySelector('#html');
const newFileButton = document.querySelector('#new-file');
const openFileButton = document.querySelector('#open-file');
const saveMarkdownButton = document.querySelector('#save-markdown');
const revertButton = document.querySelector('#revert');
const saveHtmlButton = document.querySelector('#save-html');
const showFileButoon = document.querySelector('#show-file');
const openInDefaultButton = document.querySelector('#open-in-default');

let filePath= null;
let originalContent='';

//render function
const renderMarkdownToHtml=(markdown)=>{
    htmlView.innerHTML=marked(markdown,{sanitize:true});
}

const updateEditedState=(isEdited)=>{
    currentWindow.setDocumentEdited(isEdited);

    saveMarkdownButton.disabled=!isEdited;
    revertButton.disabled=!isEdited;

    let title='Fire Sale';
    if(filePath) title=`${filePath} - ${title}`;
    if(isEdited) title=`${filePath} (Edited)`;
    currentWindow.setTitle(title);
}

//adding event listener
markdownView.addEventListener('keyup',(event)=>{
    const currentContent=event.target.value;
    renderMarkdownToHtml(currentContent);
    currentWindow.setDocumentEdited(currentContent !== originalContent);
    updateEditedState(currentContent !== originalContent);
});

openFileButton.addEventListener('click',()=>{
    mainProcess.openFile(currentWindow);
});

newFileButton.addEventListener('click',()=>{
    mainProcess.createWindow();
})

saveMarkdownButton.addEventListener('click',()=>{
    mainProcess.saveMarkdown(currentWindow,filePath,markdownView.value);
})

showFileButoon.addEventListener('click',()=>{
    shell.showItemInFolder(filePath);
})

openInDefaultButton.addEventListener('click',()=>{
    shell.openItem(filePath);
})

ipcRenderer.on('file-opened',(event,file,content)=>{
    filePath=file;
    originalContent=content;

    markdownView.value=content;
    renderMarkdownToHtml(content);

    updateEditedState(false);
});

ipcRenderer.on('file-changed',(event,file,content)=>{
    filePath=file;
    originalContent=content;

    markdownView.value=content;
    renderMarkdownToHtml(content);

    updateEditedState(false);
})