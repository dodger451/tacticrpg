

var items = [
	{itemId: 10000, slotId:'mainhand', name: 'dagger', itemlevel: 5, bind: 'ON_PICKUP',
		isTwoHand: false,
		weaponType: 'DAGGER',
		isMeleeWeapon : true,
		maxDamage : 7,
		minDamage : 3,
		speed : 2.0,
		damageType: "DAMAGETYPE_WHITE", 
	},
	{itemId: 10001, slotId:'mainhand', name: 'kitchenknife', itemlevel: 8, bind: 'ON_PICKUP',
		isTwoHand: false,
		weaponType: 'DAGGER',
		isMeleeWeapon : true,
		maxDamage : 9,
		minDamage : 4,
		speed : 1.7,
		damageType: "DAMAGETYPE_WHITE", 
	},
	{itemId: 10002, slotId:'mainhand', name: 'Used dagger', itemlevel: 8, bind: null,
		isTwoHand: false,
		weaponType: 'DAGGER',
		isMeleeWeapon : true,
		maxDamage : 5,
		minDamage : 2,
		speed : 1.6,
		damageType: "DAMAGETYPE_WHITE", 
	},
	{itemId: 10003, slotId:'mainhand', name: 'Used long dagger', itemlevel: 8, bind: null,
		isTwoHand: false,
		weaponType: 'DAGGER',
		isMeleeWeapon : true,
		maxDamage : 5,
		minDamage : 2,
		speed : 1.6,
		damageType: "DAMAGETYPE_WHITE", 
	},
	{itemId: 10100, slotId:'mainhand', name: 'sword', itemlevel: 5, bind: 'ON_PICKUP',
		isTwoHand: false,
		weaponType: 'SWORD',
		isMeleeWeapon : true,
		maxDamage : 9,
		minDamage : 4,
		speed : 2.2,
		damageType: "DAMAGETYPE_WHITE",
	},
	{itemId: 10101, slotId:'mainhand', name: 'Used shortsword', itemlevel: 5, bind: 'ON_PICKUP',
		isTwoHand: false,
		weaponType: 'SWORD',
		isMeleeWeapon : true,
		maxDamage : 5,
		minDamage : 2,
		speed : 1.9,
		damageType: "DAMAGETYPE_WHITE",
	},
	{itemId: 10102, slotId:'mainhand', name: 'Claymore', itemlevel: 5, bind: 'ON_PICKUP',
		isTwoHand: true,
		weaponType: 'SWORD',
		isMeleeWeapon : true,
		maxDamage : 9,
		minDamage : 5,
		speed : 2.9,
		damageType: "DAMAGETYPE_WHITE",
	},
	{itemId: 10200, slotId:'mainhand', name: 'Small Pistol', itemlevel: 5, bind: 'ON_PICKUP',
		isTwoHand: true,
		weaponType: 'GUN',
		isMeleeWeapon : false,
		maxDamage : 9,
		minDamage : 4,
		speed : 2.8,
		damageType: "DAMAGETYPE_WHITE",
	},
	{itemId: 10201, slotId:'mainhand', name: 'Medium Pistol', itemlevel: 5, bind: 'ON_PICKUP',
		isTwoHand: true,
		weaponType: 'GUN',
		isMeleeWeapon : false,
		maxDamage : 11,
		minDamage : 5,
		speed : 2.3,
		damageType: "DAMAGETYPE_WHITE",
	},

	{itemId: 20000, slotId:'armor', name: 'Casual Cloth',
	 	armor: 33
	},
	{itemId: 20001, slotId:'armor', name: 'Light Letheroutfit',
		armor: 61
	},
	{itemId: 20002, slotId:'armor', name: 'Novice Combatarmor',
		armor: 97
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
