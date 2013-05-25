/**
 *
 * Battlefield screen show tactical map, queue with aattck-order, hud, dialogs and menus.
 *  
 * @TODO battlefield-screeen.
 */
Crafty.scene('battlefield',  function() {
	var elements = [
        "src/interfaces/BattleQueue.js"
	];
	
	//when everything is loaded, run the main scene
	require(elements, function() {	
		Crafty.background("#010");
		infc['queue'] = new BattleQueue();
		
		var pushButtonEntity = Crafty.e("2D, DOM, Text, Mouse, Color");//, MouseHover
	    pushButtonEntity
            .attr({x: 0, y: 10, z: 1000, w: 100, h:100})
            .text('push')
            .textColor('#ffffff')
            .textFont({'size' : '24px', 'family': 'Arial'})
            .bind('Click', function(){
            	var newCharId = 'char' + Crafty.math.randomInt(0,100);
            	infc['queue'].push(newCharId, Crafty.math.randomInt(0,10));
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