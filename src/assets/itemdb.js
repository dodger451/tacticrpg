

var items = [
	{itemId: 10000, slotId:'mainhand', name: 'knife',
		isMeleeWeapon : true,
		maxDamage : 15,
		minDamage : 10,
		speed : 2.0,
		damageType: "DAMAGETYPE_WHITE", 
	},
	{itemId: 10001, slotId:'mainhand', name: 'sword',
		isMeleeWeapon : true,
		maxDamage : 30,
		minDamage : 15,
		speed : 3.0,
		damageType: "DAMAGETYPE_WHITE",
	},
	{itemId: 10002, slotId:'mainhand', name: 'pistol',
		isMeleeWeapon : false,
		maxDamage : 20,
		minDamage : 15,
		speed : 2.5,
		damageType: "DAMAGETYPE_WHITE",
	},

	{itemId: 20000, slotId:'armor', name: 'Casual cloth',
	 	armor: 1
	},
	{itemId: 20001, slotId:'armor', name: 'Heavy Lether outfit',
		armor: 3
	},
	{itemId: 20002, slotId:'armor', name: 'Ares Combat armor',
		armor: 10
	},

];


var itemdb = [];
itemdb.getById = function(iid) {
	for (var i = items.length - 1; i >= 0; i--){
	  if(items[i].itemId == iid) {
	  	return items[i];
	  }
	};
}

itemdb.getBySlot = function(slotId) {
	var slotItems = new Array();
	for (var i = items.length - 1; i >= 0; i--){
	  if(items[i].slotId == slotId) {
	  	slotItems.push(items[i]);
	  }
	};
	return slotItems;
}
