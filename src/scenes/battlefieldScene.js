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

function message(txt) {
	infc['msg'] = new MessageDialog({text: txt, w:400, h:200, x:150, y:70});	
	infc['msg'].getEntity().bind('Click', function(data){
        	infc['msg'].remove();
        	infc['msg'] =null;	
        });
//	infc['msg'].getEntity().attr({w:100, h:400});
}

function addCharacter(c) {
	sc[c.get('characterId')] = c;
    infc['queue'].push(c.get('characterId'), Crafty.math.randomInt(0,10));//TODO get start prio from char
	//TODO add to strategic map
}

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
	
	var acd = new AttackConfirmDialog();
	acd.set({'attackerName':attacker.get('name'),
		'defenderName':defender.get('name'),
		'hitChance':hitChance,
		'attackAbilityName':attackType,
		'effectDescription': attacker.c().getMinDamage() + '- ' + attacker.c().getMaxDamage() +' health damage',
		'attackTable':attackTable});
		
	acd.getBtnConfirm().getEntity().bind("Click", function(){
		console.log("execute attack on "+defender.get('name'));
		var result = ruleBook.getAutoAttackResult(attacker.c(), defender.c());
		switch (result) {
			case ruleBook.ATTACKRESULT_MISS:
				console.log('Missed!');
				break;
			case ruleBook.ATTACKRESULT_DODGE:
				console.log('Dodged!');
				break;
			case ruleBook.ATTACKRESULT_BLOCK:
				console.log('Blocked!');
				break;
			case ruleBook.ATTACKRESULT_PARRY:
				console.log('Parried!');
				break;
		}
		console.log(result);

	});	
	infc['attackConfirmDialog'] = acd;
		
	
	//var result = ruleBook.getAutoAttackResult(attacker.c(), defender.c());
	 
	console.log('attck Character '+defender.get('characterId'));

}
//debug stuff

function generateRandomChar() {
	var names = ['David', 'Luis', 'Mark', 'Fabian', 'Fritz', 'Max', 'Moritz', 'Mika', 'Mario'];
	var lastnames = ['Gomez', 'Boateng', 'Ribery', 'Hummels', 'Robben', 'Lahm', 'Müller', 'Abba'];
	
	var newCharId = 'char' + Crafty.math.randomInt(0,100);
    var c = new Character();
    c.set({'characterId': newCharId});
    c.set({'name': names[Crafty.math.randomInt(0,names.length-1)] + ' ' +lastnames[Crafty.math.randomInt(0,lastnames.length-1)]});
    c.set({'name': names[Crafty.math.randomInt(0,names.length-1)] + ' ' +lastnames[Crafty.math.randomInt(0,lastnames.length-1)]});
    
    var rndConfig = heavyMeleeWeaponConfig;//defaultMeleeWeaponConfig defaultRangeWeaponConfig
    c.set({'attackWeapon':new Weapon(rndConfig)});
    
    return c;
}
