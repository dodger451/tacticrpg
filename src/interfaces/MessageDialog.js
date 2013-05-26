
MessageDialog = BaseEntity.extend({
defaults: {
	    'entity': null,
	    'textEntity': null,
	    'x':1,
	    'y':2,
	    'h':200,
	    'w':400,
	    'z':2000
    },
    initialize: function(){
    	console.log('init MEssagebox with x: '+this.get('x')+', y: '+this.get('y')+', h:'+this.get('h')+', w: '+this.get('w')+', z: '+this.get('z'));
    	var model = this;
		var entity = Crafty.e("2D, DOM, Mouse, Draggable, Color")
            .attr({x: this.get('x'), y: this.get('y'), h:this.get('h'), w: this.get('w'), z: this.get('z')})
            .color('blue');

		var textEntity = Crafty.e("2D, DOM, Mouse, Text")
            .attr({x: this.get('x'), y: this.get('y'), h:this.get('h'), w: this.get('w'), z: this.get('z')+1})
//            .attr({x: entity._x, y: entity._y, h:entity._h, w: entity._w, z: entity._w+1})
            .textColor("ffffff")
            .text(this.get('text'));
            
            
        entity.attach(textEntity);

            
        textEntity.bind('Click', function(data){
        	model.remove();
        });
        
        model.set({'textEntity' : textEntity });
     	model.set({'entity' : entity });
	},
    remove : function(){
        var entity = this.getEntity();

        if (entity){
            entity.destroy();
        }
        
        if (this.get('textEntity')){
        	this.get('textEntity').destroy();
        }
    },
    setText: function(txt){
    	model.get('textEntity').text(txt);
    }
    
});