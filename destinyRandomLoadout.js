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
    type = type.split("_")[1];

    if (type === "PRIMARY") {
      armory.primary.push({ p: name, pp: perks });
    } else if (type === "SPECIAL") {
      armory.special.push({ s: name, sp: perks });
    } else if (type === "HEAVY") {
      armory.heavy.push({ h: name, hp: perks });
    }
  }

  return armory;
}



function getArmory() {
  var gear = document.getElementsByClassName('gear-item');
  var armory = filterTypes(gear);
  return armory;
  // var primary = getRandom(armory.primary);
  // var special = getRandom(armory.special);
  // var heavy = getRandom(armory.heavy);
  // console.log(
  //   primary.getAttribute('data-itemname'),
  //   primary.getAttribute('data-perks')
  // );
  // console.log("--------");
  // console.log(
  //   special.getAttribute('data-itemname'),
  //   special.getAttribute('data-perks')
  // );
  // console.log("--------");
  // console.log(
  //   heavy.getAttribute('data-itemname'),
  //   heavy.getAttribute('data-perks')
  // );
  // console.log("--------");
}


// chrome.runtime.sendMessage(getArmory());

chrome.runtime.onMessage.addListener(function(request, _, sendResponse) {
  if (request.get === "armory") {
    chrome.runtime.sendMessage(getArmory());
  }
});
