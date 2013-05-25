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
		infc['queue'] = new BattleQueue();
		Crafty.background("#010");
		var queue = Crafty.e('BattleQueue');

	
	});
	//alert('battlefield. click to attack.');
	//alert('battlefield. click to end turn.');
	//Crafty.scene("battlefield");				

	//TODO show queue
	//TODO temporary display button to execute next attack				
});