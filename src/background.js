// PinView App - background script

var ports = [];
var pinnedTabSet = [];

function hasOwnProperty(obj, prop) {
    var proto = obj.__proto__ || obj.constructor.prototype;
    return (prop in obj) &&
        (!(prop in proto) || proto[prop] !== obj[prop]);
}

if ( Object.prototype.hasOwnProperty ) {
    var hasOwnProperty = function(obj, prop) {
        return obj.hasOwnProperty(prop);
    }
}


function makePinnedTabs(tabs) {
  let r = [];
  pinnedTabSet = [];
  for( const oneTab of tabs ) {
    let oneRow = { title: oneTab.title, id: oneTab.id, favIconUrl: oneTab.favIconUrl };
    r.push(oneRow);
    pinnedTabSet.push(oneTab.id);
  }
  return r;
}


function listTabs() {
  let queryOptions = { pinned: true };
  return chrome.tabs.query(queryOptions).then( (tabs) => {
    let r = [];
    if( ports.length < 1 ) {
      return;
    }
    if( tabs.length ) {
      r = makePinnedTabs(tabs);
    }

    // broadcast to all ports
    for( i = 0; i < ports.length; ++i ) {
      ports[i].postMessage({id: 'tablist', contents:r});
    }
  });
}

function clickOnTab(tabId) {
  var updateProperties = { 'active': true };
  chrome.tabs.update(tabId, updateProperties).then( (tab) => {
    tabWindow = tab.windowId;
    var windowUpdateProps = { 'focused': true };
    chrome.windows.update(tabWindow, windowUpdateProps).then(
       (wnd) => { } );
  });
}

function removePort(p) {
  let i = 0;
  for(; i < ports.length; ++i ) {
    if( ports[i].sender.tab.id == p.sender.tab.id ) {
      ports.splice(i, 1);
      break;
    }
  }
}

function addOneListener(p) {
  ports.push( p );

  p.onMessage.addListener(function(msg, sendingPort) {
     if( msg.id == 'list' ) {
       listTabs();
     } else if( msg.id == 'click' ) {
       clickOnTab( msg.tab );
     }
     return true;
  });

  p.onDisconnect.addListener( function(p) {
    removePort(p);
    listTabs();
  });

  if( ports.length > 1 ) {
    return;
  }

  // first one only
  chrome.tabs.onUpdated.addListener( function(tabId, changeInfo, tab) {
    if( hasOwnProperty(changeInfo, 'pinned') ) {
      listTabs();
    }
  });

  chrome.tabs.onRemoved.addListener( function(tabId, removeInfo) {
    let i = 0;
    for( ; i < pinnedTabSet.length; ++i ) {
      if( pinnedTabSet[i] == tabId ) {
        listTabs();
        break;
      }
    }
  });

  chrome.tabs.onCreated.addListener( function(tab) {
    if( tab.pinned ) {
      listTabs();
    }
  });
}



chrome.runtime.onConnect.addListener(function(p) {
  if(p.name == "pinviewconn") {
    addOneListener(p);
  }
  return true;
});
