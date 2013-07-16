/**
 *
 * Battlefield screen show tactical map, queue with aattck-order, hud, dialogs and menus.
 *  
 * @TODO battlefield-screeen.
 */
Crafty.scene('battlefield',  function() {
	var elements = [
        "src/entities/Character.js",
        "src/interfaces/BattleQueue.js",
       "src/interfaces/dialogs/MessageDialog.js",
       "src/interfaces/dialogs/AttackConfirmDialog.js",
       "src/interfaces/dialogs/ButtonDialog.js"
	];
	
	//when everything is loaded, run the main scene
	require(elements, function() {	
		Crafty.background("#010");
		var queue = new BattleQueue();
		queue.getEntity().bind('QueuePortraitClicked', function(data){
        	//sc[data.characterId].set({'currentHealth':12});
        	//model.removeCharacter(data.characterId);
        	var attacker = sc[infc['queue'].top().characterId];
			var defender = sc[data.characterId];
			
        	attackCharacter(attacker, defender);
        });
        infc['queue'] = queue;
        
		//button to push a new randomw char in queue
		var btnPush = new ButtonDialog({x: 0, y: 10 , text:"push", z:1000});
		btnPush.getEntity().bind("Click", function(){
			addCharacter(generateRandomChar());
            });				

		//button to pop top char from queue
		var btnPop = new ButtonDialog({x: 0, y: 120 , text:"pop", z:1000});
		btnPop.getEntity().bind("Click", function(){
			infc['queue'].pop();
            });
                 				
        //button for something
		var btnTestMsg = new ButtonDialog({x: 0, y: 240, text:"msg", z:1000});
		btnTestMsg.getEntity().bind("Click", function(){
			//message("this is also message");
		});
	});
});

/**
 * @param String txt
 * 
 */
function message(txt) {
	infc['msg'] = new MessageDialog({text: txt, w:400, h:200, x:150, y:70});	
	infc['msg'].getEntity().bind('Click', function(data){
        	infc['msg'].remove();
        	infc['msg'] =null;	
        });
//	infc['msg'].getEntity().attr({w:100, h:400});
}

/**
 * Adds character to scene.
 * @param {Character} c
 * 
 */
function addCharacter(c) {
	sc[c.get('characterId')] = c;
    infc['queue'].push(c.get('characterId'), Crafty.math.randomInt(0,10));//TODO get start prio from char
	//TODO add to strategic map
}
/**
 * Show attackDialog that shows show win-chances with button to run executeAttack(attacker, defender);
 * @param {Character} attacker
 * @param {Character} defender
 */
function attackCharacter(attacker, defender){
	if (attacker.get('characterId') === defender.get('characterId')) {
		return;
	}
	
	var attackType = 'autoattack';
	var ruleBook = new Combatrules();
	var attackTable = ruleBook.getAutoAttackTable(attacker.c(), defender.c());
	var maxMissChance = 0;
	
	for (var i = 0; i < attackTable.length; i++) {
		if (attackTable[i].type == ruleBook.ATTACKRESULT_CRITICALHIT
			|| attackTable[i].type == ruleBook.ATTACKRESULT_CRUSHING_BLOW
			|| attackTable[i].type == ruleBook.ATTACKRESULT_ORDINARY_HIT
			){
			break;
		}
		maxMissChance = attackTable[i].maxrole;
	}
	var hitChance = 100 - maxMissChance;
	var reduction = ruleBook.getDamageReduction(attacker.c(), defender.c());
	var minDmg = attacker.c().getMinDamage() * (1 - (reduction/100));
	var maxDmg = attacker.c().getMaxDamage() * (1 - (reduction/100));
	
	var acd = new AttackConfirmDialog();
	acd.set({'attackerName':attacker.get('name'),
		'defenderName':defender.get('name') + ' (armor '+ defender.c().getArmor() + ', '+defender.c().getArmorFromGear()+' from gear)',
		'hitChance':hitChance,
		'attackAbilityName':attackType,
		'effectDescription': minDmg.toFixed(0) + '- ' + maxDmg.toFixed(0)  +' health damage ('+reduction+' reduction)',
		'attackTable':attackTable});
		
	acd.getBtnConfirm().getEntity().bind("Click", function(){
		executeAttack(attacker, defender);
	});	
	infc['attackConfirmDialog'] = acd;
}

/**
 * Runs attack after player confrmed  in attack-dialog
 * 
 * @param {Character} attacker
 * @param {Character} defender
 */
function executeAttack(attacker, defender) {
	console.log("execute attack on "+defender.get('name'));
	//run attack
	var ruleBook = new Combatrules();
	var topQueueItem = infc['queue'].pop();

	var attackerSpeed = attacker.c().getAttackSpeed();
	var result = ruleBook.getAutoAttackResult(attacker.c(), defender.c());
	
	//result show
	switch (result) {
		case ruleBook.ATTACKRESULT_MISS:
			onMiss(attacker, defender); 
			break;
		case ruleBook.ATTACKRESULT_DODGE:
			onDodge(attacker, defender); 
			break;
		case ruleBook.ATTACKRESULT_PARRY:
			onParry(attacker, defender); 
			break;
		case ruleBook.ATTACKRESULT_GLANCING_BLOW:
			onGlancingBlow(attacker, defender); 
			break;
		case ruleBook.ATTACKRESULT_BLOCK:
			onBlock(attacker, defender);
			break;
		case ruleBook.ATTACKRESULT_CRITICALHIT:
			onCriticalHit(attacker, defender);
			break;
		case ruleBook.ATTACKRESULT_CRUSHING_BLOW:
			onCrushingBlow(attacker, defender);
			break;
		case ruleBook.ATTACKRESULT_ORDINARY_HIT:
			onOrdinaryHit(attacker, defender);
			break;
	}
	console.log("put "+attacker.get('name') + ' back into queue with prio ' + attackerSpeed);
	infc['queue'].push(attacker.get('characterId'), attackerSpeed);

	
}
function onMiss(attacker, defender) {
	console.log('Missed!');
}
function onDodge(attacker, defender) {
	console.log('Dodge!');
}
function onParry(attacker, defender) {
	console.log('Parry!');
}
function onGlancingBlow(attacker, defender) {
	console.log('GlancingBlow!');
}
			
function onBlock(attacker, defender) {
	console.log('Blocked!');
}
function onCriticalHit(attacker, defender) {
	var ruleBook = new Combatrules();
	var dmg = 2 * ruleBook.rollDamage(attacker.c(), defender.c());
	console.log('ATTACKRESULT_CRITICALHIT! Dmg: ' + dmg);//TODO ATTACKRESULT_CRITICALHIT	
}
function onCrushingBlow(attacker, defender) {
	console.log('CrushingBlow todo');
}

function onOrdinaryHit(attacker, defender) {
	//TODO: animate attackhit
	var ruleBook = new Combatrules();
	var dmg = ruleBook.rollDamage(attacker.c(), defender.c()); 
	var dmgApplied = defender.c().applyHealthDamage(dmg);
	console.log('ATTACKRESULT_ORDINARY_HIT! Dmg: ' + dmg +' ('+dmgApplied+' apllied)');
}
//debug stuff
function generateRandomChar() {
	var names = ['David', 'Luis', 'Mark', 'Fabian', 'Fritz', 'Max', 'Moritz', 'Mika', 'Mario'];
	var lastnames = ['Gomez', 'Boateng', 'Ribery', 'Hummels', 'Robben', 'Lahm', 'Müller', 'Abba'];
	var colors = ['red', 'blue', 'yellow', 'green', 'orange'];
	var newCharId = 'char' + Crafty.math.randomInt(0,100);
    var c = new Character();
    c.set({'characterId': newCharId});
    c.set({'name': names[Crafty.math.randomInt(0,names.length-1)] + ' ' +lastnames[Crafty.math.randomInt(0,lastnames.length-1)]});
    c.set({'itemSlots':
    	{
    		'armor': armors[Crafty.math.randomInt(0,armors.length-1)].itemId,
    		
    	}
    });
    var rndConfig = weaponConfigs[Crafty.math.randomInt(0,weaponConfigs.length-1)].config;//defaultMeleeWeaponConfig defaultRangeWeaponConfig
    c.set({'attackWeapon':new Weapon(rndConfig)});
    c.set({'color': colors[Crafty.math.randomInt(0,colors.length-1)]});
    
    return c;
}
