
var defaultMeleeWeaponConfig = {
	isMeleeWeapon : true,
	maxDamage : 15,
	minDamage : 10,
	speed : 2.0,
	damageType: "DAMAGETYPE_WHITE", 
	name: 'defaultMeleeWeapon'
}
var heavyMeleeWeaponConfig = {
	isMeleeWeapon : true,
	maxDamage : 30,
	minDamage : 15,
	speed : 3.0,
	damageType: "DAMAGETYPE_WHITE", 
	name: 'heavyMeleeWeapon'
}
var defaultRangeWeaponConfig = {
	isMeleeWeapon : false,
	maxDamage : 20,
	minDamage : 15,
	speed : 2.5,
	damageType: "DAMAGETYPE_WHITE",
	name: 'defaultRangeWeapon'
}

var weaponConfigs = [
		{itemId: 0, slotId:'mainweapon', config: defaultMeleeWeaponConfig},
		{itemId: 1, slotId:'mainweapon', config: heavyMeleeWeaponConfig},
		{itemId: 2, slotId:'mainweapon', config: defaultRangeWeaponConfig},
		
	] ;


var armors = [
		{itemId: 0, slotId:'armor', name: 'Casual cloth', armor: 1},
		{itemId: 1, slotId:'armor', name: 'Heavy Lether outfit', armor: 3},
		{itemId: 2, slotId:'armor', name: 'Ares Combat armor', armor: 10},
		
	] ;
