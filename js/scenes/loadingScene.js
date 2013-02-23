/**
 *
 * Loadingscreen is displayed before battlefield while images and resources are being loaded.
 *  
 * @TODO loadingscreeen needs design.
 */
loadingScene = function() {
				Crafty.background("#000");
				showLogo();
				var startTime = new Date().getTime();
				Crafty.load(images,
					function() {
						var timeLoading = new Date().getTime() - startTime;

						setTimeout(function() {
							Crafty.scene("game");
						}, Math.max(700 - timeLoading, 0));
					});
			}