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

// add all content to a placeholder tag
document.addEventListener('DOMContentLoaded', function () {
  buildContent();
});
