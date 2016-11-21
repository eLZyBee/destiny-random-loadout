console.log("I've been injected into Gear Manager");

function filterTypes(gear) {
  var armory = {
    primary: [],
    special: [],
    heavy: []
  };

  for (var i = 0; i < gear.length; i++) {
    var item = gear[i];
    var type = item.getAttribute('data-bucketid');
    var name = item.getAttribute('data-itemname');
    var perks = item.getAttribute('data-perks');
    var id = item.getAttribute('data-itemhash');
    type = type.split("_")[1];

    if (type === "PRIMARY") {
      armory.primary.push({ p: name, pp: perks, ph: id });
    } else if (type === "SPECIAL") {
      armory.special.push({ s: name, sp: perks, sh: id });
    } else if (type === "HEAVY") {
      armory.heavy.push({ h: name, hp: perks, hh: id });
    }
  }

  return armory;
}

function getArmory() {
  var gear = document.getElementsByClassName('gear-item');;
  var armory = filterTypes(gear);
  return armory;
}

function fillSearch(text) {
  var searchBox = document.getElementById("gear-manager-search").children[0];
  var e = new Event('change');
  searchBox.value = text;
  searchBox.dispatchEvent(e);
}

function move(itemhash, char) {
  var item = document.querySelector("[data-itemhash=\"" + itemhash + "\"]");
  console.log(item);
  item.click();

  var opts = document.getElementsByClassName("menu-transfer");
  // Infinite loop, got to click item again to bring this up??
  // while (opts.length === 0) {
  //   opts = document.getElementsByClassName("menu-transfer");
  // }
  console.log(opts);
  for (var i = 0; i < opts.length; i++) {
    var opt = opts[i].children[0].innerHTML;
    if (opt.indexOf(char) !== -1) {
      opts[i].click();
    }
  }
}

chrome.runtime.onMessage.addListener(function(request) {
  if (request.get === "armory") {
    chrome.runtime.sendMessage(getArmory());
  } else if (request.get === "search") {
    fillSearch(request.search);
  } else if (request.get === "move") {
    console.log(request);
    move(request.item, request.char);
  }
});
