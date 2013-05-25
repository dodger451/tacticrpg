
BattleQueue = BaseEntity.extend({
defaults: {
	    'entity': null,
	    'queue' : null,
        'queueOffset' : {x:150, y:0},
    },
    initialize: function(){
    	
	    var model = this;
		var queue = PriorityQueue({
			low : true
		});

     	model.set({'queue' : queue });
		var entity = Crafty.e("2D, DOM, Text, Mouse, Color")
            .attr({x: 0, y: 10, z: 1000});
     	model.set({'entity' : entity });
    },
    getQueue : function(){
    	return this.get('queue');
    },
    remove : function(){
        var entity = this.getEntity();

        if (entity){
            entity.destroy();
        }
        
        var queueElements = this.getQueue().getAll();
        for (var i = 0; i < queueElements.length; i++) {
			queueElements[i].remove();
		}
    },
    push: function(cId, prio){
    	console.log('push');
    	 
	    var queueLength = this.getQueue().getAll().length;
	    //create new queueitem and render portrait view of character
	    var newCharPortrait = new QueuePortrait({characterId: cId});


		var colors = ["red", "blue", "green"];
	    newCharPortrait.getEntity()
			.color(colors[Crafty.math.randomInt(0,100)%colors.length]);//helper while boxes are not unique
	    
        this.getEntity().attach(newCharPortrait.getEntity());

    	this.getQueue().push(newCharPortrait, prio);

		//re-render queue
		this.updateQueue();	
	    

    	Crafty.trigger('QueuePush', {characterId:cId, prio:prio});
    	//TODO: add queueitem - entity for new character with animation shift other items + fadein 
    	
    },
    pop: function(){
    	
    	console.log('push');
    	var prio = this.getQueue().topPriority();
    	var charPortrait = this.getQueue().pop();
        
    	this.getQueue().addPriorityToAll(-1 * prio);    	
    	var val = {character:charPortrait.get('characterId'), prio:prio};
    	
    	this.getEntity().detach(charPortrait.getEntity());
		charPortrait.remove();
		//TODO: remove queueitem - entity with animation fadeout + shift other items    	
		//re-render queue
		this.updateQueue();
    	
    	Crafty.trigger('QueuePop', val);
    	return val;
    },
    top: function(){
    	var prio = this.getQueue().topPriority();
    	var charPortrait = this.getQueue().top();
    	return {characterId:charPortrait.get('characterId'), prio:prio};
    },
    updateQueue: function(){
    	var offset = 0;
		var queueElements = this.getQueue().getAll();
		for (var i = 0; i < queueElements.length; i++) {
			queueElements[i].object.getEntity()
				.attr({x: this.getEntity()._x + offset+ this.get('queueOffset').x, y: this.getEntity()._y + this.get('queueOffset').y, z: this.getEntity()._z+1})
			offset += queueElements[i].object.getEntity()._w;
		}
    }
    
    
});

QueuePortrait = BaseEntity.extend({
defaults: {
        'characterId' : null,
    },
    initialize: function(){
    	
	    var model = this;

     	model.set({'characterId' : this.attributes.characterId });
		var entity = Crafty.e("2D, DOM, Text, Mouse, Color");//, MouseHover


	    entity
            .text(model.get('characterId'))
            .textColor('#ffffff')
            .textFont({'size' : '24px', 'family': 'Arial'})
            .attr({w: 120, h:200})
            .bind('Click', function(){
            	alert('i\'m ' + model.get('characterId'));
            })
            
     	model.set({'entity' : entity });
     
    } 
    
});