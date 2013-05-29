
MessageDialog = BaseEntity.extend({
defaults: {
	    'entity': null,
	    'bgEntity': null,
	    'x':1,
	    'y':2,
	    'h':200,
	    'w':400,
	    'z':2000
    },
    initialize: function(){
    	var model = this;
		
		var entity = Crafty.e("2D, DOM, Mouse, Text, Draggable")
            .attr({x: this.get('x'), y: this.get('y'), h:this.get('h'), w: this.get('w'), z: this.get('z')+1})
//            .attr({x: entity._x, y: entity._y, h:entity._h, w: entity._w, z: entity._w+1})
            .textColor("ffffff")
            .text(this.get('text'));


            
        var bgEntity = Crafty.e("2D, DOM, Color")
            .attr({x: this.get('x'), y: this.get('y'), h:this.get('h'), w: this.get('w'), z: this.get('z')})
            .color('blue');
        
        entity.attach(bgEntity);
		
     	model.set({'entity' : entity });
        model.set({'bgEntity' : bgEntity });
     	
     	//animate noth? use http://craftyjs.com/api/Tween.html

     	model.afterInit();
     	
	},
	afterInit: function(){
		//to extend
	},
	getBgEntity: function() {
		return this.get('bgEntity');
	},
    remove : function(){
        var entity = this.getEntity();

        if (entity){
            entity.destroy();
        }
        var bgEntity = this.getBgEntity();
        if (bgEntity){
        	bgEntity.destroy();
        }
    }
    
});