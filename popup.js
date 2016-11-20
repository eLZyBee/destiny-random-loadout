var ARMORY;

function getRandom(array) {
  return array[Math.floor(Math.random() * array.length)];
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
  return {
    primary: primary,
    special: special,
    heavy: heavy
  };
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

  function updateLoadout(guns) {
    primary.children[0].innerHTML = "PRIMARY: " + guns.primary.p;
    primary.children[1].innerHTML = "PERKS: " + guns.primary.pp;
    special.children[0].innerHTML = "SPECIAL: " + guns.special.s;
    special.children[1].innerHTML = "PERKS: " + guns.special.sp;
    heavy.children[0].innerHTML = "HEAVY: " + guns.heavy.h;
    heavy.children[1].innerHTML = "PERKS: " + guns.heavy.hp;
  }


  getButton.addEventListener('click', function(e) {
    e.preventDefault();
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {get: "armory"});
    });
  });

  button.addEventListener('click', function(e) {
    e.preventDefault();
    if (ARMORY) {
      var gear = createLoadout();
      updateLoadout(gear);
    } else {
      special.children[1].innerHTML = "No gear found. Try refreshing the page."
    }
  });

  chrome.runtime.onMessage.addListener(function(request) {
    if (request.hasOwnProperty("heavy")) {
      ARMORY = request;
      present.style.background = "rgb(20, 99, 31)";
    }
  });
});
