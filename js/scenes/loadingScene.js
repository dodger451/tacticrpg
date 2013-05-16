/**
 *
 * Loadingscreen is displayed before battlefield while images and resources are being loaded.
 *  
 * @TODO loadingscreeen needs design.
 */
loadingScene = function() {
	if (typeof(resource) == "undefined" || typeof(resource.requiredImages) == "undefined") {
		throw "resource not initialized";
	}
	Crafty.background("#020");
				
	var startTime = new Date().getTime();
	Crafty.load(resource.requiredImages||[],
		function() {
			var timeLoading = new Date().getTime() - startTime;

			setTimeout(function() {
				alert("done loading, go o battlefield.");
				Crafty.scene("battlefield");//TODO goto 'gamemenu'
			}, Math.max(700 - timeLoading, 0));
		});
	var label = Crafty.e("2D, DOM, Text").attr({w: 100, h: 20, x: 150, y: 120}).textColor('#FF0000');
	
	label.text("Loading")
       .css({"text-align": "center"});
	
	//showLogo();
	
}

showLogo = function() {
	label.text("Loading")
       .css({"text-align": "center"});
	//TODO show logo while loading
	
}
