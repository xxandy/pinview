// PinView extension - generator for the popup textContent
// And management of the events.

// query all pinned tabs asynchronously, pass it to the
// synchronous content builder
function buildContent() {
  let queryOptions = { pinned: true };
  return chrome.tabs.query(queryOptions).then( (tabs) => {
    parseTabs(tabs);
  });
}

function clickOnTab( evt ) {
  tabId = evt.currentTarget.evtTabId;
  var updateProperties = { 'active': true };
  chrome.tabs.update(tabId, updateProperties).then( (tab) => {
    tabWindow = tab.windowId;
    var windowUpdateProps = { 'focused': true };
    chrome.windows.update(tabWindow, windowUpdateProps).then(
       (wnd) => { window.close(); } );
  });
}

function hidepwatip() {
  let pwtip = document.getElementById('installpwa');
  pwtip.classList.remove('showinlineguide');
  pwtip.classList.add('hideguide');
}

function showpwatip() {
  let pwtip = document.getElementById('installpwa');
  pwtip.classList.remove('hideguide');
  pwtip.classList.add('showinlineguide');
}

function messageReceived(msg) {
  if( msg.popuphint == 'pwaarrived' ) {
    hidepwatip();
  } else if( msg.popuphint == 'pwaleft' ) {
    showpwatip();
  }
}

// add all content to a placeholder tag
document.addEventListener('DOMContentLoaded', function () {

  // keep up with changes on the PWA status
  chrome.runtime.onMessage.addListener(messageReceived);

  // request an initial update of the PWA status and apply that
  chrome.runtime.sendMessage({popuphint: "syncstatus"}, function(response) {
    messageReceived(response);
  });

  buildContent();
});
