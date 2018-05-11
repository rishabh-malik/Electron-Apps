const $ = require('jquery');
const electron = require('electron');
const ipc = electron.ipcRenderer;
const request = require('request');

const gistApi = {
  url: 'https://api.github.com/gists',
  headers: {
    'User-Agent': 'Clipmaster 9000'
  }
};

const createClippingElement = require('./support/create-clipping-element');

const clipboard = electron.clipboard;

const $clippingsList = $('.clippings-list');
const $copyFromClipboardButton = $('#copy-from-clipboard');

function addClippingToList() {
  var text = clipboard.readText();
  var $clipping = createClippingElement(text);
  $clippingsList.append($clipping);
}

$copyFromClipboardButton.on('click', addClippingToList);

$clippingsList.on('click', '.remove-clipping', function () {
  $(this).parents('.clippings-list-item').remove();
});

$clippingsList.on('click', '.copy-clipping', function () {
  var text = $(this).parents('.clippings-list-item').find('.clipping-text').text();
  clipboard.writeText(text);
});

$clippingsList.on('click', '.publish-clipping', function () {
  var text = $(this).parents('.clippings-list-item').find('.clipping-text').text();
  request.post({
    url: 'https://api.github.com/gists',
    headers: {
      'User-Agent': 'Clipmaster 9000'
    },
    body: JSON.stringify({
      description: "Created with Clipmaster 9000",
      public: "true",
      files:{
        "clipping.txt": {
          content: text
        }
      }
    })
  }, function (err, response, body) {
    if (err) {
      return new Notification('Error Publishing Your Clipping', {
        body: JSON.parse(err).message
      });
    }

    var gistUrl = JSON.parse(body).html_url;
    var notification = new Notification('Your Clipping Has Been Published', {
      body: `Click to open ${gistUrl} in your browswer.`
    });

    notification.onclick = function () {
      electron.shell.openExternal(gistUrl);
    };

    clipboard.writeText(gistUrl);
  });
});

ipc.on('create-new-clipping', function (event) {
  addClippingToList();
  new Notification('Clipping Added', {
    body: `${clipboard.readText()}`
  });
});
