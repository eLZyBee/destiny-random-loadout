var ARMORY;

function getRandom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function saveSelection(weapons) {
  chrome.storage.local.set({ "loadout": weapons }, function() {
    console.log("Weapons saved");
  })
}

function createLoadout() {
  var primary = getRandom(ARMORY.primary);
  var special = getRandom(ARMORY.special);
  var heavy = getRandom(ARMORY.heavy);
  console.log(primary.p, primary.pp);
  console.log("--------");
  console.log(special.s, special.sp);
  console.log("--------");
  console.log(heavy.h, heavy.hp);
  console.log("--------");
  var weapons = { primary: primary, special: special, heavy: heavy };
  // save this selection
  saveSelection(weapons);
  return weapons;
}

document.addEventListener("DOMContentLoaded", function() {

  var button = document.getElementsByClassName("get")[0];
  var primary = document.getElementsByClassName("primary")[0];
  var pPerk = document.getElementsByClassName("primary-perks")[0];
  var special = document.getElementsByClassName("special")[0];
  var sPerk = document.getElementsByClassName("special-perks")[0];
  var heavy = document.getElementsByClassName("heavy")[0];
  var hPerk = document.getElementsByClassName("heavy-perks")[0];

  // pull from storage and if present, updateLoadout with present data.
  var loadout;
  chrome.storage.local.get("loadout", function(response) {
    loadout = response.loadout;
    updateLoadout(loadout);
  });

  // CLEAN UP (for sanity)
  function updateLoadout(guns) {
    removeNodes(document.getElementsByClassName("search"));
    removeNodes(document.getElementsByClassName("move"));

    var primButton = document.createElement("button");
    primButton.className = "search";
    primButton.style.position = "static";
    primButton.innerHTML = "Search for " + guns.primary.p;
    primary.appendChild(primButton);
    addSearchListener(primButton, guns.primary.p);

    var primMove = document.createElement("button");
    primMove.className = "move";
    primMove.style.position = "static";
    primMove.innerHTML = "Move: " + guns.primary.p;
    primary.appendChild(primMove);
    addMoveListener(primMove, guns.primary.ph);

    primary.children[0].innerHTML = "PRIMARY: " + guns.primary.p;
    primary.children[1].innerHTML = "PERKS: " + guns.primary.pp;


    var specButton = document.createElement("button");
    specButton.className = "search";
    specButton.style.position = "static";
    specButton.innerHTML = "Search for " + guns.special.s;
    special.appendChild(specButton);
    addSearchListener(specButton, guns.special.s);

    var specMove = document.createElement("button");
    specMove.className = "move";
    specMove.style.position = "static";
    specMove.innerHTML = "Move: " + guns.special.s;
    special.appendChild(specMove);
    addMoveListener(specMove, guns.special.sh);

    special.children[0].innerHTML = "SPECIAL: " + guns.special.s;
    special.children[1].innerHTML = "PERKS: " + guns.special.sp;


    var heavyButton = document.createElement("button");
    heavyButton.className = "search";
    heavyButton.style.position = "static";
    heavyButton.innerHTML = "Search for " + guns.heavy.h;
    heavy.appendChild(heavyButton);
    addSearchListener(heavyButton, guns.heavy.h);

    var heavyMove = document.createElement("button");
    heavyMove.className = "move";
    heavyMove.style.position = "static";
    heavyMove.innerHTML = "Move: " + guns.heavy.h;
    heavy.appendChild(heavyMove);
    addMoveListener(heavyMove, guns.heavy.hh);

    heavy.children[0].innerHTML = "HEAVY: " + guns.heavy.h;
    heavy.children[1].innerHTML = "PERKS: " + guns.heavy.hp;
  }

  function invalidTab() {
    primary.children[0].innerHTML = "";
    primary.children[1].innerHTML = "Uh oh, no gear found, is this a valid bungie gear manager page?";
    special.children[0].innerHTML = "";
    special.children[1].innerHTML = "If it is, try refreshing the page.";
    heavy.children[0].innerHTML = "";
    heavy.children[1].innerHTML = "";
  }

  function addSearchListener(node, name) {
    node.addEventListener('click', function(e) {
      e.preventDefault();

      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {get: "search", search: name});
      });

    });
  }

  function addMoveListener(node, hash) {
    node.addEventListener('click', function(e) {
      e.preventDefault();

      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
          get: "move", item: hash
        });
      });
    });
  }

  function removeNodes(array) {
    for (var i = array.length - 1; i >= 0; i--) {
      array[i].remove();
    }
  }

  button.addEventListener('click', function(e) {
    e.preventDefault();

    if (ARMORY === undefined) {

      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (tabs[0].url.indexOf("bungie.net/en/Gear/Manager") !== -1) {
          chrome.tabs.sendMessage(tabs[0].id, {get: "armory"});
        } else {
          invalidTab();
        }
      });

    } else {
      var gear = createLoadout();
      updateLoadout(gear);
    }
  });

  chrome.runtime.onMessage.addListener(function(request) {
    if (request.hasOwnProperty("heavy")) {
      ARMORY = request;
      button.className = "button randomize";
      button.innerHTML = "Randomize";
      present.style.background = "rgb(20, 99, 31)";
    }
  });
});
