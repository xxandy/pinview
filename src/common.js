// PinView extension - code that is common for both foreground and
// scripts.

function focusTab( evt ) {
  target = evt.currentTarget;
  target.classList.remove('standardentry');
  target.classList.add('highlightentry');
}

function deFocusTab( evt ) {
  target = evt.currentTarget;
  target.classList.remove('highlightentry');
  target.classList.add('standardentry');
}

function parseTabs(tabs) {
  let pinlistElem = document.getElementById('bootstrap');
  let noPinElem = document.getElementById('nopinwarning');
  pinlistElem.textContent = '';
  if( addPinnedTabs( pinlistElem, tabs ) === true ) {
    noPinElem.classList.remove('showguide');
    noPinElem.classList.add('hideguide');
    pinlistElem.classList.remove('hideguide');
  } else {
    noPinElem.classList.remove('hideguide');
    noPinElem.classList.add('showguide');
    pinlistElem.classList.add('hideguide');
  }
}

// make the HTML for one row, containing one tab's data
function makeTableRow(oneTab) {
  let cell = document.createElement("td");

  let entry = document.createElement("div");
  entry.setAttribute("class", "paddedtext");

  let divimg = document.createElement("div");
  divimg.setAttribute("class", "paddedimage");

  if(oneTab.favIconUrl) {
    let img = document.createElement("img");
    img.setAttribute("width", "16em");
    img.setAttribute("height", "16em");
    img.setAttribute("src", oneTab.favIconUrl);
    divimg.appendChild(img);
  }

  let cellimg = document.createElement("td");
  cellimg.setAttribute("width", "26em");

  cellimg.appendChild(divimg);
  entry.appendChild(document.createTextNode(oneTab.title));

  cell.appendChild( entry );

  let row = document.createElement("tr");
  row.setAttribute("class", "standardentry");
  row.appendChild(cellimg);
  row.appendChild(cell);

  return row;
}

// Cycle through all pinned tabs, add textContent
// and event handlers for each
function addPinnedTabs(pinListArea, tabs) {
  if( tabs.length ) {
    let outerTable = document.createElement("table");
    outerTable.setAttribute("id", "mainTable");
    for( const oneTab of tabs ) {
      let oneRow = makeTableRow(oneTab);
      outerTable.appendChild(oneRow);

      oneRow.evtTabId = oneTab.id;
      oneRow.addEventListener( 'click', clickOnTab );
      oneRow.addEventListener( 'mouseover', focusTab );
      oneRow.addEventListener( 'mouseout', deFocusTab );
    }
    pinListArea.appendChild(outerTable);
    return true;
  } else {
    return false;
  }
}
