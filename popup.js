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

  var button = document.getElementsByClassName("randomize")[0];
  var getButton = document.getElementsByClassName("get")[0];
  var primary = document.getElementsByClassName("primary")[0];
  var pPerk = document.getElementsByClassName("primary-perks")[0];
  var special = document.getElementsByClassName("special")[0];
  var sPerk = document.getElementsByClassName("special-perks")[0];
  var heavy = document.getElementsByClassName("heavy")[0];
  var hPerk = document.getElementsByClassName("heavy-perks")[0];
  var present = document.getElementsByClassName("gear-present")[0];

  // pull from storage and if present, updateLoadout with present data.
  var loadout;
  chrome.storage.local.get("loadout", function(response) {
    loadout = response.loadout;
    updateLoadout(loadout);
  });

  function updateLoadout(guns) {
    primary.children[0].innerHTML = "PRIMARY: " + guns.primary.p;
    primary.children[1].innerHTML = "PERKS: " + guns.primary.pp;
    special.children[0].innerHTML = "SPECIAL: " + guns.special.s;
    special.children[1].innerHTML = "PERKS: " + guns.special.sp;
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

  getButton.addEventListener('click', function(e) {
    e.preventDefault();
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (tabs[0].url.indexOf("bungie.net/en/Gear/Manager") !== -1) {
        chrome.tabs.sendMessage(tabs[0].id, {get: "armory"});
      } else {
        invalidTab();
      }
    });
  });

  button.addEventListener('click', function(e) {
    e.preventDefault();
    var gear = createLoadout();
    updateLoadout(gear);
  });

  chrome.runtime.onMessage.addListener(function(request) {
    console.log(request);
    if (request.hasOwnProperty("heavy")) {
      ARMORY = request;
      present.style.background = "rgb(20, 99, 31)";
    }
  });
});
