
ButtonDialog = BaseEntity.extend({
//ButtonDialog = MessageDialog.extend({

defaults: {
	    'entity': null,
	    'bgEntity': null,
	    'x':0,
	    'y':0,
	    'h':50,
	    'w':50,
	    'z':3000,
	    'text':'ok',
	    'color':'darkblue'
   },
   initialize: function(){
    	var model = this;
		
		var entity = Crafty.e("2D, DOM, Mouse, Text, Draggable")
            .attr({x: this.get('x'), y: this.get('y'), h:this.get('h'), w: this.get('w'), z: this.get('z')+1})
//            .attr({x: entity._x, y: entity._y, h:entity._h, w: entity._w, z: entity._w+1})
            .textColor("ffffff")
            //.text('ok')
            .text(this.get('text'))
            .bind("Click", function(){
            	//TODO animate  btn-click
            });


            
        var bgEntity = Crafty.e("2D, DOM, Color")
            .attr({x: this.get('x'), y: this.get('y'), h:this.get('h'), w: this.get('w'), z: this.get('z')})
            .color(this.get('color'));
        
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

