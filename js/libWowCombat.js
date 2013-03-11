/// Combatrules

function Combatrules() {
	this.ATTACKRESULT_MISS = 0;
	this.ATTACKRESULT_DODGE = 1;
	this.ATTACKRESULT_PARRY = 2;
	this.ATTACKRESULT_GLANCING_BLOW = 3;
	this.ATTACKRESULT_BLOCK = 4;
	this.ATTACKRESULT_CRITICALHIT = 5;
	this.ATTACKRESULT_CRUSHING_BLOW = 6;
	this.ATTACKRESULT_ORDINARY_HIT = 7;

}

/**
 * 
 * Pre-3.0. With Patch 3.0, both hit and spell hit use the same basic hit rating attribute within the combat rating system,
 * @see http://www.wowwiki.com/Miss 
 */
Combatrules.prototype.getMissChance = function(attacker, defender) {
	
	if (10 >= Math.abs(defender.getDefenseSkill() - attacker.getAttackSkill())) {
		var basechance = 5;
		if (attacker.isDualWielding()) {
			basechance = 24;
		}
		return basechance + (defender.getDefenseSkill() - attacker.getAttackSkill()) * 0.1;
	} else {
		var basechance = 6;
		if (attacker.isDualWielding()) {
			basechance = 25;
		}
		return basechance + (defender.getDefenseSkill() - attacker.getAttackSkill() - 10) * 0.4;
	
	}
	
}

Combatrules.prototype.getDodgeChance = function(attacker, defender) {
	return 5;
	//TODO calc getDodgeChance
}

Combatrules.prototype.getParryChance = function(attacker, defender) {
	return 5;
	//TODO calc getParryChance
}

Combatrules.prototype.getGlancingBlowChance = function(attacker, defender) {
	return 5;
	//TODO calc getGlancingBlowChance
}
Combatrules.prototype.getBlockChance = function(attacker, defender) {
	return 5;
	//TODO calc getBlockChance
}

Combatrules.prototype.getCriticalHitChance = function(attacker, defender) {
	return 5;
	//TODO calc getCriticalHitChance
}

Combatrules.prototype.getCrushingBlowChance = function(attacker, defender) {
	return 5;
	//TODO calc getCrushingBlowChance
}

Combatrules.prototype.getAutoAttackTable = function(attacker, defender) {
	var attacktablebuilder = new AttackTableBuilder();
	attacktablebuilder.add(this.ATTACKRESULT_MISS, this.getMissChance(attacker, defender));
	attacktablebuilder.add(this.ATTACKRESULT_DODGE, this.getDodgeChance(attacker, defender));
	attacktablebuilder.add(this.ATTACKRESULT_PARRY, this.getParryChance(attacker, defender));
	attacktablebuilder.add(this.ATTACKRESULT_GLANCING_BLOW, this.getGlancingBlowChance(attacker, defender));
	attacktablebuilder.add(this.ATTACKRESULT_BLOCK, this.getBlockChance(attacker, defender));
	attacktablebuilder.add(this.ATTACKRESULT_CRITICALHIT, this.getCriticalHitChance(attacker, defender));
	attacktablebuilder.add(this.ATTACKRESULT_CRUSHING_BLOW, this.getCrushingBlowChance(attacker, defender));
	attacktablebuilder.add(this.ATTACKRESULT_ORDINARY_HIT, 100);
	var attacktable = attacktablebuilder.getTable();
	
	return attacktable;
}
Combatrules.prototype.getRangeAttackTable = function(attacker, defender) {
	var attacktablebuilder = new AttackTableBuilder();
	attacktablebuilder.add(this.ATTACKRESULT_MISS, this.getMissChance(attacker, defender));
	attacktablebuilder.add(this.ATTACKRESULT_DODGE, this.getDodgeChance(attacker, defender));
	//attacktablebuilder.add(this.ATTACKRESULT_PARRY, this.getParryChance(attacker, defender));
	//attacktablebuilder.add(this.ATTACKRESULT_GLANCING_BLOW, this.getGlancingBlowChance(attacker, defender));
	attacktablebuilder.add(this.ATTACKRESULT_BLOCK, this.getBlockChance(attacker, defender));
	attacktablebuilder.add(this.ATTACKRESULT_CRITICALHIT, this.getCriticalHitChance(attacker, defender));
	attacktablebuilder.add(this.ATTACKRESULT_CRUSHING_BLOW, this.getCrushingBlowChance(attacker, defender));
	attacktablebuilder.add(this.ATTACKRESULT_ORDINARY_HIT, 100);
	var attacktable = attacktablebuilder.getTable();
	
	return attacktable;
}

Combatrules.prototype.getAutoAttackResult = function(attacker, defender) {
	return this.getAttackResult(this.getAutoAttackTable(attacker, defender));
}

Combatrules.prototype.getAttackResult = function(attackTable) {
	var rnd = Math.random() * 100.0;
	for (var i = 0; i < attackTable.length; i++) {
		if (rnd < attackTable[i].maxrole) {
			return attackTable[i].type;
		}
	}	
	throw new Exception('unknown result for throw ' + rnd);
}

Combatrules.prototype.attackResultToString = function(resulttype) {

	switch(resulttype) {
		case this.ATTACKRESULT_MISS:
			return 'MISS';
		case this.ATTACKRESULT_DODGE:
			return 'DODGE';
		case this.ATTACKRESULT_PARRY:
			return 'PARRY';
		case this.ATTACKRESULT_GLANCING_BLOW:
			return 'GLANCING BLOW';
		case this.ATTACKRESULT_BLOCK:
			return 'BLOCK';
		case this.ATTACKRESULT_CRITICALHIT:
			return 'CRITICALHIT';
		case this.ATTACKRESULT_CRUSHING_BLOW:
			return 'CRUSHING BLOW';
		case this.ATTACKRESULT_ORDINARY_HIT:
			return 'ORDINARY HIT';
		default:
			return 'unknown result ' + result;

	}

}
//
///AttackTableBuilder
//
function AttackTableBuilder() {
	this._lastMaxRole = 0;
	this._attackTable = new Array();

}

AttackTableBuilder.prototype.add = function(pType, pChance) {
	this._lastMaxRole = Math.min(100, this._lastMaxRole + pChance);
	this._attackTable.push({
		type : pType,
		chance : pChance,
		maxrole : Math.min(100, this._lastMaxRole)
	});
}

AttackTableBuilder.prototype.getTable = function() {
	return this._attackTable;
}

//
/// Combatant
//
function Combatant() {
	//TODO constructor for character (and rest)
	//create with dummy equipment
	this._level = 80;
	this._currentAttackWeapon = new Weapon();
}

Combatant.prototype.getLevel = function() {
	return this._level;
}
/**
 * if false it's a player
 */
Combatant.prototype.isMob = function() {
	return true;
}


Combatant.prototype.getAttackWeapon = function() {
	return this._currentAttackWeapon;
}


Combatant.prototype.getDefenseSkill = function() {
	return 100;
	//TODO calc getDefenseSkill
}
Combatant.prototype.getAttackSkill = function() {
	return 100;
	//TODO calc getAttackSkill
}

Combatant.prototype.isDualWielding = function() {
	return false;
	//TODO calc isDualWielding
}
/**
 * Effective defensive skill for calculaions in combat
 */
Combatant.prototype.getDefenseSkill = function() {
	//TODO calc getDefenseSkill
	// It is the Mob's level multiplied by 5. 
	return 299;
}

/**
 * Effective melee attack skill for calculations in combat
 */
Combatant.prototype.getAttackSkill = function() {
	//TODO calc getAttackSkill depending on current attackWeapon inlcuding all mods
	// It is the Mob's level multiplied by 5. 
	return 299;
}

/**
 * @see http://www.wowwiki.com/Damage_per_second 
 * Minimum Range = (((Minimum damage / Weapon Speed) + (Melee Attack Power / 14)) * (Weapon Speed)) * (Dual Wield Penalty)/
 * Minimum Range = (((Minimum damage + Scope damage bonus) / Weapon Speed) + (Ranged Attack Power / 14) + Ammo DPS bonus) * Weapon Speed

 */
Combatant.prototype.getMinDps = function() {
	var attackWeapon = this.getAttackWeapon();
	var minDmg = 0;
	if (attackWeapon.isMelee()) {
		//minDmg = ((attackWeapon.getMinDamage() / attackWeapon.getWeaponSpeed()) + (Melee Attack Power / 14))
	} else { //range-weapon
		
	}
}

//
/// Weapon
//
function Weapon() {
	this._speed = 2.0;
	this._minDamage = 10.0;
	this._maxDamage = 15.0;
	this._isMeleeWeapon = true;//false = ranged

}


Weapon.prototype.isMelee = function() {
	return this._isMeleeWeapon;
}

Weapon.prototype.getSpeed = function() {
	//TODO get effective speed of weapon including weapon-mods
	return this._speed;
}
Weapon.prototype.getMinDamage = function() {
	//TODO get effective minDamage of weaponincluding weapon-mods
	return this._minDamage;
}
Weapon.prototype.getMaxDamage = function() {
	//TODO get effective maxDamage of weapon including weapon-mods
	return this._maxDamage;
}



//
// TEST
//
var attackerMob = new Combatant();
var defenderMob = new Combatant();
var ruleBook = new Combatrules();

var result = ruleBook.getAutoAttackResult(attackerMob, defenderMob);
alert(ruleBook.attackResultToString(result));

