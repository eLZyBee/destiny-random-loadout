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

function determineSpace() {
  var space = {};
  var vaultSlots = document.querySelectorAll(
    '[class~="vaulted"][data-itemtypeid="Weapon"]'
  ).length + document.querySelectorAll(
    '[class~="vaulted"][data-itemtype="Primary Weapon Engram"]'
  ).length + document.querySelectorAll(
    '[class~="vaulted"][data-itemtype="Special Weapon Engram"]'
  ).length + document.querySelectorAll(
    '[class~="vaulted"][data-itemtype="Heavy Weapon Engram"]'
  ).length;

  space["Vault"] = 108 - vaultSlots;

  var types = ["primary", "special", "heavy"];
  var buckets = [
    "BUCKET_PRIMARY_WEAPON",
    "BUCKET_SPECIAL_WEAPON",
    "BUCKET_HEAVY_WEAPON"
  ];
  space["Warlock"] = {
    primary: [], special: [], heavy: []
  };
  space["Titan"] = {
    primary: [], special: [], heavy: []
  };
  space["Hunter"] = {
    primary: [], special: [], heavy: []
  };

  for (var i = 0; i < buckets.length; i++) {
    var weaponsList = document.querySelectorAll(
      '[data-containerbucketid="' + buckets[i] + '"]'
    )
    var weapons = [];
    for (var k = 0; k < weaponsList.length; k++) {
      weapons.push({
        site: weaponsList[k].getElementsByClassName('unequipped-message')[0],
        id: weaponsList[k].getAttribute('data-itemhash')
      });
    }

    for (var j = 0; j < weapons.length; j++) {
      if (weapons[j].site.innerHTML.indexOf("Warlock") !== -1) {
        space["Warlock"][types[i]].push(weapons[j].id);
      } else if (weapons[j].site.innerHTML.indexOf("Titan") !== -1) {
        space["Titan"][types[i]].push(weapons[j].id);
      } else if (weapons[j].site.innerHTML.indexOf("Hunter") !== -1) {
        space["Hunter"][types[i]].push(weapons[j].id);
      }
    }
  }

  return space;
}

function makeSpace(itemhash, location) {
  var space = determineSpace();
  var item = document.querySelector(
    "[class~=\"gear-item\"][data-itemhash=\"" + itemhash + "\"]"
  );
  var slot = item.getAttribute(
    'data-containerbucketid').split("_")[1].toLowerCase();
  var classes = ["Warlock", "Hunter", "Titan"];

  if (space[location][slot].length === 10) {
    var mostSpace = "Vault";
    var available = space["Vault"];

    for (var i = 0; i < classes.length; i++) {
      if((10 - space[classes[i]][slot].length) >= available) {
        mostSpace = classes[i];
        available = 10 - space[classes[i]][slot].length;
      }
    }

    var hashArr = space[location][slot];
    move(hashArr[hashArr.length-1], mostSpace);
  }
}

function move(itemhash, location) {
  var item = document.querySelector(
    "[class~=\"gear-item\"][data-itemhash=\"" + itemhash + "\"]"
  );
  item.click();

  var opts = document.getElementsByClassName("menu-transfer");
  for (var i = 0; i < opts.length; i++) {
    var opt = opts[i].children[0].innerHTML;
    if (opt.indexOf(location) !== -1) {
      opts[i].click();
    }
  }
}

function equip(itemhash, location) {
  var item = document.querySelector(
    "[class~=\"gear-item\"][data-itemhash=\"" + itemhash + "\"]"
  );
  item.click();
  var equip = document.getElementsByClassName("equip")[0];
  equip.click();
}

function handleMove(itemhash, location) {
  makeSpace(itemhash, location);
  move(itemhash, location);
  equip(itemhash, location);
}

chrome.runtime.onMessage.addListener(function(request) {
  if (request.get === "armory") {
    chrome.runtime.sendMessage(getArmory());
  } else if (request.get === "search") {
    fillSearch(request.search);
  } else if (request.get === "move") {
    handleMove(request.item, request.char);
  }
});
