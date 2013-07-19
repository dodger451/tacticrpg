Character = BaseEntity.extend({
	/*
	 *
	 Character's Name, Level, Race, Class, Guild, Title information (upper center).
	 Equipment Manager.
	 Paper doll 3D representation of the character with currently equipped items
	 Equipment slots around the paper doll. Hovering over the item icons allows you to view the items' stats.
	 Stats panel:

	 -General: Health, Mana/Energy/Rage/etc., Mastery
	 -Attributes: Strength, Agility, Stamina, Intellect, Spirit, Armor
	 -Melee: Damage, DPS, Attack Power, Speed, Haste, Hit chance, Crit Chance, Expertise
	 -Ranged: Damage, DPS, Attack Power, Speed, Hit chance, Crit Chance
	 -Spell: Spell powerHaste, , Hit chance, Penetration, Mana Regen, Combat Regen, Crit Chance
	 Defenses: Armor, Defense, Dodge, Parry, Block, Resilience
	 Resistances,
	 
	 
	 slots: see http://www.wowwiki.com/Character_info?file=Paper_doll_labeled.png
	 */
	defaults : {
		'characterId' : null,
		'currentHealth': 100,
		'baseHealth': 100,
		'currentMana': 100,
		'baseMana': 80,
		'c':null,
		'agility':10,
		'stamina':10,
		'intellect':10,
		'spirit':10,
		'isMob':true,
		'attackWeapon':null,//TODO check if better default possible
		'level':1,

	},
	initialize: function() {

		var c = this.createCombatant();
		this.set('c', c);
	},
	c: function() {
		return this.get('c');
	},
	createCombatant: function(){
		var c = new Combatant();
		
		//override methods
		c.model = this;
		c.getCurrentHealth = function() {
			return this.model.get('currentHealth');
		};
		Combatant.prototype.setCurrentHealth = function(newHealth) {
			this.model.set('currentHealth', Math.max(0, Math.min(newHealth, this.getHealth())));			
			return this;
		}

		c.getBaseHealth = function() {
			return this.model.get('baseHealth');
		};
		c.getCurrentMana = function() {
			return this.model.get('currentMana');
		};
		c.getBaseMana = function() {
			return this.model.get('baseMana');
		};
	
		c.getBaseAgility = function() {
			return this.model.get('agility');
		}
		c.getBaseStamina = function() {
			return this.model.get('stamina');
		}
		c.getBaseIntellect = function() {
			return this.model.get('intellect');
		}
		c.getBaseSpirit = function() {
			return this.model.get('spirit');
		}
		c.isMob = function() {
			return this.model.get('isMob');
		}
		c.getAttackWeapon = function() {
			return this.model.get('attackWeapon');
		}
		c.getLevel = function() {
			return this.model.get('level');
		}
		c.getId = function() {
			return this.model.get('characterId');
		}

		c.getArmorFromGear = function() {
			var equip = this.model.get('itemSlots');
			return armors[equip.armor].armor;
		}
		
		return c;
	},
	isAlive: function() {
		return 0 < this.get('currentHealth');
	}, 
	
 

}); 