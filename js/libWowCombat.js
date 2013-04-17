/// Combatrules

function Combatrules() {
	this.ATTACKRESULT_MISS = "ATTACKRESULT_MISS";
	this.ATTACKRESULT_DODGE = "ATTACKRESULT_DODGE";
	this.ATTACKRESULT_PARRY = "ATTACKRESULT_PARRY";
	this.ATTACKRESULT_GLANCING_BLOW = "ATTACKRESULT_GLANCING_BLOW";
	this.ATTACKRESULT_BLOCK = "ATTACKRESULT_BLOCK";
	this.ATTACKRESULT_CRITICALHIT = "ATTACKRESULT_CRITICALHIT";
	this.ATTACKRESULT_CRUSHING_BLOW = "ATTACKRESULT_CRUSHING_BLOW";
	this.ATTACKRESULT_ORDINARY_HIT = "ATTACKRESULT_ORDINARY_HIT";
	
	this.DAMAGETYPE_WHITE = "DAMAGETYPE_WHITE";
	
	return 0;

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
	return defender.getDodgeChance();	
}


/**
 * Your chance to parry is based on the formula: 
 * % = 5% base chance + contribution from parry rating + contribution from talents + ((Defense skill - attacker's weapon skill) * 0.04) 
 * 
 * @see http://www.wowwiki.com/Parry
 * 
 */
Combatrules.prototype.getParryChance = function(attacker, defender) {
	return defender.getParryChance() + ((defender.getDefenseSkill() - attacker.getAttackSkill()) * 0.04) ;
}
/**
 * http://www.wowwiki.com/Glancing_blow
 * 
 * The new formula seems to be: glancing blow chance = 10 + mob defense - player weapon skill 
 */
Combatrules.prototype.getGlancingBlowChance = function(attacker, defender) {
	if (
		!defender.isMob() 
		|| defender.getLevel() < attacker.getLevel() 
		|| attacker.getDamageType() != Combatrules.DAMAGETYPE_WHITE
		) {
		return 0;
	}
	return Math.max(0, 10 + (defender.getDefenseSkill() - attacker.getAttackSkill()));
}

/**
 * @see http://www.wowwiki.com/Block
 */
Combatrules.prototype.getBlockChance = function(attacker, defender) {
	return 5;
	//TODO calc Combatrules.getBlockChance
}
Combatrules.prototype.getCriticalHitChance = function(attacker, defender) {
	return 5;
	//TODO calc Combatrules.getCriticalHitChance
}
Combatrules.prototype.getCrushingBlowChance = function(attacker, defender) {
	return 5;
	//TODO calc Combatrules.getCrushingBlowChance
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
function Combatant(id) {
	//TODO Combatant.constructor for character (rest attributes)
	//create with dummy equipment
	this._id = id;
	this._level = 80;
	this._currentAttackWeapon = new Weapon({
		isMeleeWeapon : true,
		maxDamage : 15,
		minDamage : 10,
		speed : 2.0
	});
}

Combatant.prototype.getId = function() {
	return this._id;
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
Combatant.prototype.setAttackWeapon = function(weapon) {
	this._currentAttackWeapon = weapon;
}
Combatant.prototype.getDefenseSkill = function() {
	return 100;
	//TODO calc Combatant.getDefenseSkill
}
Combatant.prototype.getAttackSkill = function() {
	return 100;
	//TODO calc Combatant.getAttackSkill
}
Combatant.prototype.isDualWielding = function() {
	return false;
	//TODO calc Combatant.isDualWielding
}
/**
 * Effective defensive skill for calculaions in combat
 */
Combatant.prototype.getDefenseSkill = function() {
	//TODO calc Combatant.getDefenseSkill
	// It is the Mob's level multiplied by 5.
	return 299;
}
/**
 * Effective melee attack skill for calculations in combat
 */
Combatant.prototype.getAttackSkill = function() {
	//TODO calc Combatant.getAttackSkill depending on current attackWeapon inlcuding all mods
	// It is the Mob's level multiplied by 5.
	return 299;
}
/**
 * Effective melee attack power for calculating damage in combat
 * http://www.wowwiki.com/Attack_power
 */
Combatant.prototype.getMeleeAttackPower = function() {
	//TODO calc Combatant.getMeleeAttackPower based on attributes (Strength, agility,...) and all mods
	return 28;
	//dummy
}
/**
 * Effective range attack power for calculating damage in combat
 * http://www.wowwiki.com/Attack_power
 */
Combatant.prototype.getRangeAttackPower = function() {
	//TODO calc Combatant.getRangeAttackPower based on attributes (Strength, agility,...) and all mods
	return 28;
	//dummy
}
/**
 *
 * Uses weapon's speed, not players speed  
 *
 * @see http://www.wowwiki.com/Damage_per_second
 * Minimum Range = (((Minimum damage / Weapon Speed) + (Melee Attack Power / 14)) * (Weapon Speed)) * (Dual Wield Penalty)/
 * Minimum Range = (((Minimum damage + Scope damage bonus) / Weapon Speed) + (Ranged Attack Power / 14) + Ammo DPS bonus) * Weapon Speed
 */
Combatant.prototype.getDamage = function(weaponDamage) {
	var attackWeapon = this.getAttackWeapon();
	var dmg = 0;
	if (attackWeapon.isMelee()) {
		dmg = (
			(weaponDamage / attackWeapon.getBaseSpeed())  
			+ (this.getMeleeAttackPower() / 14)
			) * attackWeapon.getBaseSpeed();
	} else {//range-weapon
		dmg = (
			((weaponDamage + attackWeapon.getScopeDamageBonus()) / attackWeapon.getBaseSpeed()) 
			+ (this.getRangeAttackPower() / 14) 
			+ attackWeapon.getAmmoDpsBonus()
			) * attackWeapon.getBaseSpeed();
	}
	return dmg;
}

/**
 * Effective max damage of combatant when attacking with autoattack.
 *  
 */
Combatant.prototype.getMaxDamage = function() {
	//TODO Make getMaxDamage return effectiv max damage (including combatants mods)
	//note attack-weapon applies weapon-mods biund to weapon
	return this.getDamage(this.getAttackWeapon().getMaxDamage());
}
Combatant.prototype.getMinDamage = function() {
	return this.getDamage(this.getAttackWeapon().getMinDamage());
}

/**
 *http://www.wowwiki.com/Attack_speed 
 */
Combatant.prototype.getAttackSpeed = function() {
	return this.getAttackWeapon().getBaseSpeed();
}


/**
 * The amount of dodge you have is affected by your class, level, talents, agility, dodge rating, defense rating, and defense skill.
 * 
 * Dodge generally goes into two pools that are added together: undiminished and diminished dodge.
 * Your undiminished dodge includes your class's base dodge, dodge from any talents (such as Anticipation),
 * and the dodge your receive from your base agility. 
 * @see http://www.wowwiki.com/Dodge
 */
Combatant.prototype.getDodgeChance = function() {
	var b = this.getBaseDodgeChance();//todo
	var t = this.getDodgeChanceFromTalents();//todo
	var ab = this.getDodgeChanceFromBaseAgility();//todo
	var d = this.getDiminishedDodgeChance();//todo
	return b + t + ab + d;	
}

/**
 * @see http://www.wowwiki.com/Dodge
 */
Combatant.prototype.getBaseDodgeChance = function() {
	//TODO getBaseDodgeChance based on class and level
	return 3;//percetage

}

/**
 * @see http://www.wowwiki.com/Dodge
 */
Combatant.prototype.getDodgeChanceFromTalents = function() {
	//TODO getDodgeChanceFromTalents based on real talents
	return 0;
}

/**
 * Ab
 * 
 * @see http://www.wowwiki.com/Dodge
 */
Combatant.prototype.getDodgeChanceFromBaseAgility = function() {
	var dodgeFromAgility = this.getUndiminishedAgility() / this.getAgilityDodgeRate();
	var dodgeFromDefense = (this.getUndiminishedDefenseSkill() - (this.getLevel() * 5) * 0.04) / this.getAgilityDodgeRate();
	return dodgeFromAgility + dodgeFromDefense;
	
}


/**
 * Fs
 * 
 * @see http://www.wowwiki.com/Dodge
 */
Combatant.prototype.getUndiminishedDefenseSkill = function() {
	return this.getBaseDefenceSkill() + this.getDefenseSkillBonusFromTalents();
}

/**
 * @see http://www.wowwiki.com/Dodge
 */
Combatant.prototype.getBaseDefenceSkill = function() {
	//TODO getBaseDefenceSkill from base value
	return 100;
}

/**
 * @see http://www.wowwiki.com/Dodge
 */
Combatant.prototype.getDefenseSkillBonusFromTalents = function() {
	//TODO getDefenseSkillBonusFromTalents from talents
	return 0;
}

/**
 * Db
 * 
 * @see http://www.wowwiki.com/Dodge
 */
Combatant.prototype.getUndiminishedAgility = function() {
	//TODO getUndiminishedAgility based on base-agility and talents
	return this.getBaseAgility() + this.getAbilityBonusFromTalents();
}

/**
 * @see http://www.wowwiki.com/Dodge
 */
Combatant.prototype.getBaseAgility = function() {
	//TODO getBaseAgility based on base-agility value
	return 92;
}


/**
 * @see http://www.wowwiki.com/Dodge
 */
Combatant.prototype.getAbilityBonusFromTalents = function() {
	//TODO getAbilityBonusFromTalents based on talents.enchants ect (but not gear)
	return 0;
}


/**
 *  Rd
 * @see http://www.wowwiki.com/Dodge
 */
Combatant.prototype.getAgilityDodgeRate = function() {
	//TODO getAgilityDodgeRate based on class and level
	return 52;
	
}

/**
 * @see http://www.wowwiki.com/Dodge
 */
Combatant.prototype.getDiminishedDodgeChance = function() {
	//TODO getDiminishedDodgeChance based on described method
	return 0;
}



/**
 * 5% base chance + contribution from parry rating + contribution from talents
 * 
 * @see http://www.wowwiki.com/Parry
 */
Combatant.prototype.getParryChance = function() {
	//TODO getParryChance also based on contribution from parry rating + contribution from talents
	return this.getBaseParryChance();
}
/**
 * 5% base chance 
 * 
 * @see http://www.wowwiki.com/Parry
 */
Combatant.prototype.getBaseParryChance = function() {
	return 5;
}

/**
 * 
 */
Combatant.prototype.getParryChanceFromRating = function() {
	return this.getParryRating() / this.getParryRatingParryRate();
}

/**
 * @see http://www.wowwiki.com/Combat_rating_system
 */
Combatant.prototype.getParryRating = function() {
	//TODO getParryRating
	return 10;
}
/**
 * 
 * @see http://www.wowwiki.com/Combat_rating_system
 */
Combatant.prototype.getParryRatingParryRate = function() {
//	13.8 	21.76 	45.25
	return 45.25;
}

/**
 * 
 * @see http://www.wowwiki.com/Glancing_blow
 */
Combatant.prototype.getDamageType = function() {
	this.getAttackWeapon().getDamageType();
}




//	13.8 	21.76 	45.25
//
/// Weapon
//
function Weapon(weaponConfig) {
	this._config = weaponConfig;
}

Weapon.prototype.isMelee = function() {
	return this._config.isMeleeWeapon;
}

/**
 * Returns base speed, not effective player's attack-speed
 */	
Weapon.prototype.getBaseSpeed = function() {
	return this._config.speed;
}
Weapon.prototype.geBaseMinDamage = function() {
	return this._config.minDamage;
}

Weapon.prototype.getMinDamage = function() {
	//TODO get Weapon.effective minDamage of weaponincluding weapon-mods
	return this.geBaseMinDamage();
}
Weapon.prototype.getBaseMaxDamage = function() {
	return this._config.maxDamage;
}
Weapon.prototype.getMaxDamage = function() {
	//TODO get Weapon.effective maxDamage of weapon including weapon-mods
	return this.getBaseMaxDamage();
}
Weapon.prototype.getScopeDamageBonus = function() {
	//TODO get Weapon.effective Scope Damage Bonus of weapon including all mods
	return 5;
}
Weapon.prototype.getAmmoDpsBonus = function() {
	//TODO get Weapon.effective Ammo Damage Bonus of weapon including all mods in dps
	return 1;
}

/**
 * 
 * @see http://www.wowwiki.com/Glancing_blow
 */
Weapon.prototype.getDamageType = function() {
	return this._config.damageType;
}

var defaultMeleeWeaponConfig = {
	isMeleeWeapon : true,
	maxDamage : 15,
	minDamage : 10,
	speed : 2.0,
	damageType: "DAMAGETYPE_WHITE"
}
var heavyMeleeWeaponConfig = {
	isMeleeWeapon : true,
	maxDamage : 30,
	minDamage : 15,
	speed : 3.0,
	damageType: "DAMAGETYPE_WHITE"
}
var defaultRangeWeaponConfig = {
	isMeleeWeapon : false,
	maxDamage : 20,
	minDamage : 15,
	speed : 2.5,
	damageType: "DAMAGETYPE_WHITE"
}

