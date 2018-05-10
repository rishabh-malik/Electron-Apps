const newLinkUrl=document.querySelector('#new-link-url');
const newLikSubmit=document.querySelector('.new-link-form--submit');
const newLinkForm=document.querySelector('.new-link-form');

//to see if the url is valid or not
newLinkUrl.addEventListener('keyup',()=>{
    newLikSubmit.disabled=!newLinkUrl.validity.valid;
});

//parse the webpage
const parser=new DOMParser;
const parseResponse=(text)=>parser.parseFromString(text,'text/html');


//get the title of the webpage
const findTitle=(nodes)=> nodes.querySelector('title').textContent;


//on form submit
newLinkForm.addEventListener('submit',()=>{
    event.preventDefault();
    const url=newLinkUrl.value;
    console.log(url);
    
    fetch(url)
    .then(response=>response.text())
    .then(parseResponse)
    .then(findTitle)
    .then(title=>console.log(title))
    .catch(error=>console.log(error));
});