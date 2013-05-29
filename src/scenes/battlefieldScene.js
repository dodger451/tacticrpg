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
       "src/interfaces/MessageDialog.js",
       "src/interfaces/ButtonDialog.js"
	];
	
	//when everything is loaded, run the main scene
	require(elements, function() {	
		Crafty.background("#010");
		infc['queue'] = new BattleQueue();
		
		
		var btnPush = new ButtonDialog({x: 0, y: 10 , text:"push", z:1000});
		btnPush.getEntity().bind("Click", function(){
			addCharacter(generateRandomChar());
            });				

		var btnPop = new ButtonDialog({x: 0, y: 120 , text:"pop", z:1000});
		btnPop.getEntity().bind("Click", function(){
			infc['queue'].pop();
            });				
		var btnTestMsg = new ButtonDialog({x: 0, y: 240, text:"msg", z:1000});
		btnTestMsg.getEntity().bind("Click", function(){
			message("this is also message");
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

//debug stuff

function generateRandomChar() {
	var names = ['David', 'Luis', 'Mark', 'Fabian', 'Fritz', 'Max', 'Moritz', 'Mika', 'Mario'];
	var lastnames = ['Gomez', 'Boateng', 'Ribery', 'Hummels', 'Robben', 'Lahm', 'Müller', 'Abba'];
	
	var newCharId = 'char' + Crafty.math.randomInt(0,100);
    var c = new Character();
    c.set({'characterId': newCharId});
    c.set({'name': names[Crafty.math.randomInt(0,names.length-1)] + ' ' +lastnames[Crafty.math.randomInt(0,lastnames.length-1)]});
    
    return c;
}
