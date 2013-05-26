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
        "src/interfaces/MessageDialog.js"
	];
	
	//when everything is loaded, run the main scene
	require(elements, function() {	
		Crafty.background("#010");
		infc['queue'] = new BattleQueue();
		
		var pushButtonEntity = Crafty.e("2D, DOM, Text, Mouse, Color")
            .attr({x: 0, y: 10, z: 1000, w: 100, h:100})
            .text('push')
            .textColor('#ffffff')
            .textFont({'size' : '24px', 'family': 'Arial'})
            .bind('Click', function(){
            	addCharacter(generateRandomChar());
            })
            .color("red");
		
		var popButtonEntity = Crafty.e("2D, DOM, Text, Mouse, Color");//, MouseHover
	    popButtonEntity
            .attr({x: 0, y: 120 , z: 1000, w: 100, h:100})
            .text('pop')
            .textColor('#ffffff')
            .textFont({'size' : '24px', 'family': 'Arial'})
            .bind('Click', function(){
            	infc['queue'].pop();
            })
            .color("yellow");

		var msgButtonEntity = Crafty.e("2D, DOM, Text, Mouse, Color");//, MouseHover
	    msgButtonEntity
            .attr({x: 0, y: 240 , z: 1000, w: 100, h:100})
            .text('msg')
            .textColor('#ffffff')
            .textFont({'size' : '24px', 'family': 'Arial'})
            .bind('Click', function(){
            	message("this is a message");
            })
            .color("blue");

	//TODO temporary display button to execute next attack				

	
	});
	
});

function message(txt) {
	infc['msg'] = new MessageDialog({text: txt, w:400, h:200, x:150, y:70});	
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
