/**
 *
 * Battlefield screen show tactical map, queue with aattck-order, hud, dialogs and menus.
 *  
 * @TODO battlefield-screeen.
 */
Crafty.scene('battlefield',  function() {
	var elements = [
        "src/entities/Character.js",
        "src/interfaces/BattleQueue.js"
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

		
	//TODO temporary display button to execute next attack				

	
	});
	
});

function addCharacter(c) {
	sc[c.get('characterId')] = c;
    infc['queue'].push(c.get('characterId'), Crafty.math.randomInt(0,10));//TODO get start prio from char
	//TODO add to strategic map
}

//debug stuff

function generateRandomChar() {
	var names = ['David', 'Luis', 'Mark', 'Fabian', 'Fritz', 'Max', 'Moritz', 'Mika', 'Mario'];
	var lastnames = ['Gomez', 'Boateng', 'Lewandowski', 'Ribery', 'Hummels', 'Robben', 'Lahm', 'Müller', 'Abba'];
	
	var newCharId = 'char' + Crafty.math.randomInt(0,100);
    var c = new Character();
    c.set({'characterId': newCharId});
    c.set({'name': names[Crafty.math.randomInt(0,names.length-1)] + ' ' +lastnames[Crafty.math.randomInt(0,lastnames.length-1)]});
    
    
    return c;
}
