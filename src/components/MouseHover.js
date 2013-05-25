/**
 * Add mouse-over effect style.cursor = "pointer".
 *  
 * @see https://github.com/ahilles107/CraftyBoilerplate/blob/master/src/components/MouseHover.js
 */
Crafty.c('MouseHover', {
    init: function() {
        var entity = this;

        this.requires("Mouse")
        
        entity.bind('MouseOver', function(){
            document.body.style.cursor = "pointer";
        })
        .bind('MouseOut', function(){
            document.body.style.cursor = "default";
        })
        .bind('Remove', function(){
            document.body.style.cursor = "default";
        });
    
        return this;
    }
});