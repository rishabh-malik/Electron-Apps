//convert markdown to html
const marked = require('marked');

//for getting the function from main process
//ipcRenderer for listening to main events
const {remote,ipcRenderer}= require('electron');
const mainProcess=remote.require('./main');
const currentWindow=remote.getCurrentWindow();

const markdownView = document.querySelector('#markdown');
const htmlView = document.querySelector('#html');
const newFileButton = document.querySelector('#new-file');
const openFileButton = document.querySelector('#open-file');
const saveMarkdownButton = document.querySelector('#save-markdown');
const revertButton = document.querySelector('#revert');
const saveHtmlButton = document.querySelector('#save-html');

//render function
const renderMarkdownToHtml=(markdown)=>{
    htmlView.innerHTML=marked(markdown,{sanitize:true});
}

//adding event listener
markdownView.addEventListener('keyup',(event)=>{
    renderMarkdownToHtml(event.target.value);
});

openFileButton.addEventListener('click',()=>{
    mainProcess.openFile(currentWindow);
});

newFileButton.addEventListener('click',()=>{
    
})

ipcRenderer.on('file-opened',(event,file,content)=>{
    markdownView.value=content;
    renderMarkdownToHtml(content);
});