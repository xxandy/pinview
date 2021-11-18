// PinView extension - generator for the popup textContent
// And management of the events.

var listenerAdded = false;
var port = null;

function clickOnTab( evt ) {
  tabId = evt.currentTarget.evtTabId;
  port.postMessage({id: 'click', tab:tabId});
}

function clearConnState() {
  if( port != null ) {
    port.onMessage.removeListener(messageListener);
    port.onDisconnect.removeListener(disconnectListener);
    port = null;
  }
  listenerAdded = false;
}

function disconnectListener(p) {
  clearConnState();
  setTimeout(setupConnection, 300); // pause to avoid tight loop
}

function messageListener(msg) {
  if( msg.id && msg.id == 'tablist' ) {
    if( !listenerAdded ) {
      listenerAdded = true;
      port.onDisconnect.addListener(disconnectListener);
    }
    parseTabs(msg.contents);
  }
}

function informConnectionError(error) {
  let pinlistElem = document.getElementById('bootstrap');
  pinlistElem.textContent = '';
  pinlistElem.classList.add('hideguide');

  let noPinElem = document.getElementById('nopinwarning');
  noPinElem.classList.remove('showguide');
  noPinElem.classList.add('hideguide');

  let noConnElem = document.getElementById('noconnwarning');
  noConnElem.classList.remove('hideguide');
  noConnElem.classList.add('showguide');
}

function setupConnection() {
  try {
    port = chrome.runtime.connect({name: "pinviewconn"});
    port.postMessage({id: 'list'});
    port.onMessage.addListener(messageListener);
  } catch(error) {
    clearConnState();
    informConnectionError(error);
    setTimeout(function() {window.location.reload(false);}, 2000);
  }
}

setupConnection();
