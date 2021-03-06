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

	var diff = defender.getDefenseSkill() - attacker.getAttackSkill();
	//console.log('getMissChance : diff='+diff+'= defender "'+defender.getId()+'" getDefenseSkill() = '+defender.getDefenseSkill()+' - attacker "'+attacker.getId()+'" getAttackSkill()='+attacker.getAttackSkill()+'');
	if (!defender.isMob()) {//vs player
		//When a player or mob attacks a player, the base miss rate is 5%.
		var basechance = 5;
		//For each point of the defender's defense skill over the attacker's attack rating, the base miss rate increases by 0.04%.
		if (diff>0) {
			return basechance + (0.04*diff);
		} else {
			//For each point of the attacker's attack rating over the defender's defense skill, the base miss rate decreases by 0.02%. 
			return Math.max(0.0, basechance + (0.02*diff));
		}
	} else {//vs mob
		
		if (10 >= Math.abs(diff)) {
			var basechance = 5;
			if (attacker.isDualWielding()) {
				basechance = 24;
			}
			//console.log('getMissChance: return for diff smaller 10 against mob');
			return basechance + (diff) * 0.1;
		} else {
			var basechance = 6;
			if (attacker.isDualWielding()) {
				basechance = 25;
			}
			//console.log("last caase, diff:" + diff);
			return Math.max(0.0, (basechance + (diff - 10)* 0.4));
		}
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
 * The formula: 
 * Block% = 5% base chance 
 * 			+ contribution from Block Rating 
 * 			+ contribution from talents 
 * 			+ ((Defense skill - attacker's weapon skill) * 0.04) 
 * 
 * @see http://www.wowwiki.com/Block
 */
Combatrules.prototype.getBlockChance = function(attacker, defender) {
	return 5 + defender.getBlockChanceFromRating() 
	+ defender.getBlockChanceFromTalents() 
	+ (defender.getDefenseSkill() - attacker.getAttackSkill()) * 0.04;
}
/**
 * 
 * Mobs which are the same level as you always have a 5% chance to crit.
 * The attack rating equals the skill with the currently equipped weapon (WS = Weapon Skill), 
 * being level * 5 for mobs and the same for player chars with maximum weapon skill. 
 * Each point of AR exceeding the target's Defense will increase chance to crit by 0.04%. 
 * 
 * @see http://www.wowwiki.com/Critical_strike
 */
Combatrules.prototype.getCriticalHitChance = function(attacker, defender) {
	var critModifier=0;
	var attDiff = defender.getDefenseSkill() - attacker.getAttackSkill(); 
	if (defender.isMob()) {
		if (attDiff > 0) {
			critModifier = -0.2 * attDiff;
		}
	} else {
		critModifier = -0.4 * attDiff;
	}
	return attacker.getCritChance() + critModifier;
	
}
/**
 * The chance of being hit by a crushing blow is:
 * (Mob's Weapon Skill - Player's level-capped Defense Skill [mininum difference 20]) * 2% - 15% 
 * where "Mob's Weapon Skill" is the mob's level * 5, 
 * and "Player's level-capped Defense Skill" is the player's Defense skill (normally the player's level * 5). 
 */
Combatrules.prototype.getCrushingBlowChance = function(attacker, defender) {
	if (!attacker.isMob() || (defender.getLevel() - attacker.getLevel() > -4)) {
		return 0;
	}
	return Math.max(20, attacker.getAttackSkill() - defender.getDefenseSkill()) * 2 - 15;
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

/**
 * Returns effective damagereduction as percentage (0-100).
 * 
 * For enemies from level 1 to 59, the reduction to physical damage, as a percentage, is given by the following formula:
 * %Reduction = (Armor / ([85 * Enemy_Level] + Armor + 400)) * 100
 * 
 * For enemies from level 60 and up, the reduction to physical damage, as a percentage, is given by the following formula:
 * %Reduction = (Armor / ([467.5 * Enemy_Level] + Armor - 22167.5)) * 100
 * 
 * For level 80 and raid bosses, this simplifies to:
 *  %Reduction for 80 = (Armor / (Armor + 15232.5)) * 100
 *  %Reduction for 83 = (Armor / (Armor + 16635)) * 100
 * 
 * Note that the maximum damage reduction is capped at 75%.
 * 
 * @see http://www.wowwiki.com/Damage_reduction
 */
Combatrules.prototype.getDamageReduction = function(attacker, defender) {
	var defenderArmor = defender.getArmor();
	var attackerLevel = attacker.getLevel();
	
	var reduction = (defenderArmor / ((85 * attackerLevel) + defenderArmor + 400)) * 100;
	return Math.min(75, reduction);
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

Combatrules.prototype.rollDamage= function(attacker, defender) {
	var result = this.getAutoAttackResult(attacker, defender);
	var reduction = this.getDamageReduction(attacker, defender);
	var minDmg = attacker.getMinDamage();
	var maxDmg = attacker.getMaxDamage();
	return  (1 - (reduction/100)) * this.between(minDmg, maxDmg); 
}



Combatrules.prototype.between= function(minDmg, maxDmg) {
	return (minDmg + ((Crafty.math.randomInt(0,100)/ 100) * (maxDmg-minDmg)));
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
function Combatant(id, def) {
	//TODO Combatant.constructor for character (rest attributes)

	this._id = id;
	
	var definition = def || {};
	this._level = definition.level || 80;
	
	this.currentHealth = definition.currentHealth || 100;
	this.baseHealth = definition.baseHealth || 100;
	this.currentMana = definition.currentMana || 100;
	this.baseMana = definition.baseMana || 100;
	//
	// ATTRIBUTES
	//
	//Attributes are the basic building blocks for a character's combat ability. 
	//These are often referred to as simply stats.
	 
	this.baseStrength = definition.baseStrength || 20;
	this.baseAgility = definition.baseAgility || 20;
	this.baseStamina = definition.baseStamina || 20;
	this.baseIntellect = definition.baseIntellect || 20;
	this.baseSpirit = definition.baseSpirit || 21;
	
	//create with dummy equipment
	
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

/**
 * @return int
 */
Combatant.prototype.getLevel = function() {
	return this._level;
}

/**
 * current health
 * @return int
 */
Combatant.prototype.getCurrentHealth = function() {
	return this.currentHealth;
}

Combatant.prototype.setCurrentHealth = function(newHealth) {
	this.currentHealth = Math.max(0, Math.min(newHealth, this.getHealth()));
	return this;
}
/**
 * returns applied dmg (between 0 - getCurrentHealth())
 */
Combatant.prototype.applyHealthDamage = function(dmg) {
	currentHealth = this.getCurrentHealth();
	return currentHealth - this.setCurrentHealth(currentHealth - dmg).getCurrentHealth();
}



/**
 * base max health
 * @return int
 */
Combatant.prototype.getBaseHealth = function() {
	return this.baseHealth;
}
/**
 * Effective max health
 * 
 * @return int
 */
Combatant.prototype.getHealth = function() {
	//TODO Combatant getHealth add bonus from equipment and other
	//Stamina provides 1 health per stamina for the first 20 points of stamina, and 10 health per point of stamina thereafter. 
	var healthFromStamina = Math.min(20, this.getStamina()) + (Math.max(0, this.getStamina()-20) * 10);
	return this.getBaseHealth() + healthFromStamina;
}
/**
 * current Mana
 * @return int
 */
Combatant.prototype.getCurrentMana = function() {
	return this.currentMana;
}

/**
 * base max Mana
 * @return int
 */
Combatant.prototype.getBaseMana = function() {
	return this.baseMana;
}
/**
 * Effective max Mana
 * 
 * @return int
 */
Combatant.prototype.getMana = function() {
	//TODO Combatant getMana add bonus from equipment and others 
	//Each point of intellect gives player characters 15 mana points 
	//(except from the first 20 points of Intellect that provide 1 mana for each point instead).
	//
	var manaFromInt = Math.min(20, this.getIntellect()) + (Math.max(0, this.getIntellect()-20) * 15);
	return this.getBaseMana() + manaFromInt;
}


/**
 * @return int
 */
Combatant.prototype.getBaseStrength = function() {
	return this.baseStrength;
}
/**
 * Effective
 * 
 * @return float
 */
Combatant.prototype.getStrength = function() {
	//TODO Combatant getStrength add bonus from equipment and others 
	return this.getBaseStrength() ;
}

/**
 * @return int
 */
Combatant.prototype.getBaseAgility = function() {
	return this.baseAgility;
}
/**
 * Effective agilty from base-agility and talens, buffs, ect. 
 *  
 * @return float
 */
Combatant.prototype.getAgility = function() {
	//TODO Combatant getAgility add bonus from equipment and others 
	return this.getBaseAgility() + this.getAbilityBonusFromTalents();
}

/**
 * @return int
 */
Combatant.prototype.getBaseStamina = function() {
	return this.baseStamina;
}

/**
 * @return float
 */
Combatant.prototype.getStamina = function() {
	//TODO Combatant getStamina add bonus from equipment and others
	return this.getBaseStamina();
}

/**
 * @return int
 */
Combatant.prototype.getBaseIntellect = function() {
	return this.baseIntellect;
}


/**
 * @return float
 */
Combatant.prototype.getIntellect = function() {
	//TODO Combatant getIntellect add bonus from equipment and others
	return this.getBaseIntellect();
}


/**
 * @return int
 */
Combatant.prototype.getBaseSpirit = function() {
	return this.baseSpirit;
}

/**
 * @return float
 */
Combatant.prototype.getSpirit = function() {
	//TODO Combatant getBaseSpirit add bonus from equipment and others
	return this.getBaseSpirit();
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
/**
 * 
 */
Combatant.prototype.getBaseAttackSkill = function() {
	return this.getLevel()*5;
}

/**
 * Based on current equipped weapon's skill.
 * 
 * @see http://www.wowwiki.com/Attack_Rating
 */
Combatant.prototype.getAttackSkill = function() {
	if(this.isMob()) {
		//Calculating a mob's Defense Skill or Attack Rating
		//This is a rather simple formula. It is the Mob's level multiplied by 5
		return this.getLevel() * 5;
		//For Skull Bosses, the formula is your level plus 3, multiplied by 5
	} else {
		return this.getBaseAttackSkill(); 
		//TODO calc Combatant.getAttackSkill: add buff, equip...		
	}
}

/**
 * Effective defensive skill for calculaions in combat
 * @see http://www.wowwiki.com/Miss
 */
Combatant.prototype.getDefenseSkill = function() {
	if(this.isMob()) {
		//Calculating a mob's Defense Skill or Attack Rating
		//This is a rather simple formula. It is the Mob's level multiplied by 5
		//console.log('returning for "'+this.getId()+'" mobbased def for level ...' + this.getLevel() + '=' + (this.getLevel() * 5));
		return this.getLevel() * 5;
		//For Skull Bosses, the formula is your level plus 3, multiplied by 5
	} else {
		//console.log('returning getBaseDefenseSkill...');
		return this.getBaseDefenseSkill(); //TODO calc Combatant.getDefenseSkill add bonus from equip, buffs, ect..
		
	}
}
Combatant.prototype.isDualWielding = function() {
	return false;
	//TODO calc Combatant.isDualWielding based on curretn equip
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
	return this.getBaseDefenseSkill() + this.getDefenseSkillBonusFromTalents();
}

/**
 * @see http://www.wowwiki.com/Dodge
 */
Combatant.prototype.getBaseDefenseSkill = function() {
	return this.getLevel()*5;
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
	return this.getBaseAgility() + this.getAbilityBonusFromTalents();
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
	return this.getAttackWeapon().getDamageType();
}

/**
 * 
 * @see http://www.wowwiki.com/Block
 */
Combatant.prototype.getBlockChanceFromRating = function() {
	//TODO impl Combatant getBlockChanceFromRating 
	return 0;
}
/**
 * 
 * @see http://www.wowwiki.com/Block
 */
Combatant.prototype.getBlockChanceFromTalents = function() {
	//TODO impl Combatant getBlockChanceFromTalents
	return 0;
}


/**
 * 
 * See table under header 'Agility' in url.
 * @see http://www.wowwiki.com/Critical_strike
 *  
 */
Combatant.prototype.getAgilityCritRate = function() {
	//TODO getAgilityCritRate by class and level
	return 62.5;
}
	 
/**
 * @see http://www.wowwiki.com/Critical_strike 
 *  
 */
Combatant.prototype.getCritChance = function() {
	//TODO get Combatant getCritChance based on agilit  
	return 5;
}
/**
 * Base Armor = 2 * Agility + gear armor + magic armor
 * 
 * @see http://www.wowwiki.com/Damage_reduction
 *  
 */
Combatant.prototype.getArmor = function() {
	return 2 * this.getAgility() + this.getArmorFromGear() + this.getArmorFromMagic();
}
/**
 * 
 * @see http://www.wowwiki.com/Armor
 *  
 */
Combatant.prototype.getArmorFromGear = function() {
	return 23;//TODO Combatant getArmorFromGear calc from gear
}

/**
 * 
 * @see http://www.wowwiki.com/Armor
 *  
 */
Combatant.prototype.getArmorFromMagic = function() {
	return 2;//TODO Combatant getArmorFromMagic calc from current effects
}

//TODO getMAnaReg
//TODO getHealthReg

//	

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

Weapon.prototype.getName = function() {
	return this._config.name;
}
