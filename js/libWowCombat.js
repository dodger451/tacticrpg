/// Combatant

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

Combatrules.prototype.getMissChance = function(attacker, defender) {
	return 5;
	//todo: calc MissChance
}

Combatrules.prototype.getDodgeChance = function(attacker, defender) {
	return 5;
	//todo: calc getDodgeChance
}

Combatrules.prototype.getParryChance = function(attacker, defender) {
	return 5;
	//todo: calc getParryChance
}

Combatrules.prototype.getGlancingBlowChance = function(attacker, defender) {
	return 5;
	//todo: calc getGlancingBlowChance
}
Combatrules.prototype.getBlockChance = function(attacker, defender) {
	return 5;
	//todo: calc getBlockChance
}

Combatrules.prototype.getCriticalHitChance = function(attacker, defender) {
	return 5;
	//todo: calc getCriticalHitChance
}

Combatrules.prototype.getCrushingBlowChance = function(attacker, defender) {
	return 5;
	//todo: calc getCrushingBlowChance
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

Combatrules.prototype.getAutoAttackResult = function(attacker, defender) {
	var attackTable = this.getAutoAttackTable(attacker, defender);
	var rnd = Math.random() * 100.0;
	for (var i = 0; i < attackTable.length; i++) {
		if (rnd < attackTable[i].maxrole) {
			return attackTable[i];
		}
	}
	throw new Exception('unknown result for throw ' + rnd);
}

Combatrules.prototype.attackResultToString = function(result) {

	switch(result.type) {
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

//AttackTableBuilder
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
/// Combatant

function Combatant() {
	var _level = 80;

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

Combatant.prototype.getDefenseSkill = function() {
	return 100;
	//TODO calc getDefenseSkill
}
Combatant.prototype.getAttackSkill = function() {
	return 100;
	//TODO calc getAttackSkill
}
//
// TEST
//
var attackerMob = new Combatant()
var defenderMob = new Combatant()
var ruleBook = new Combatrules();

var result = ruleBook.getAutoAttackResult(attackerMob, defenderMob);
alert(ruleBook.attackResultToString(result));

