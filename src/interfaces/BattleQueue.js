
BattleQueue = BaseEntity.extend({
defaults: {
	    'entity': null,
	    'queue' : null,
        'queueOffset' : {x:0, y:0},
    },
    initialize: function(){
    	
	    var model = this;
		var queue = PriorityQueue({
			low : true
		});

     	model.set({'queue' : queue });
		var entity = Crafty.e("2D, DOM, Text, Mouse, Draggable, Color")
            .attr({x: 200, y: 10, h:200, w: 500, z: 1000})
            .color('white');
            
        
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
	    var newCharPortrait = new QueuePortrait({characterId: cId});
        this.getEntity().attach(newCharPortrait.getEntity());
    	this.getQueue().push(newCharPortrait, prio);

		//TODO: add queueitem - entity for new character with animation shift other items + fadein 
    	this.updateQueue();	
	    
    	Crafty.trigger('QueuePush', {characterId:cId, prio:prio});
    	
    },
    pop: function(){
    	var prio = this.getQueue().topPriority();
    	var charPortrait = this.getQueue().pop();        
    	this.getQueue().addPriorityToAll(-1 * prio);
    	    	
    	var val = {character:charPortrait.get('characterId'), prio:prio};
    	
		//TODO: remove queueitem - entity with animation fadeout + shift other items    	
    	this.getEntity().detach(charPortrait.getEntity());
		charPortrait.remove();
		
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
			if(i==1) {
				offset += 20;
			}
			queueElements[i].object.getEntity()
				.attr(
					{
						x: this.getEntity()._x + offset+ this.get('queueOffset').x, 
						y: this.getEntity()._y + this.get('queueOffset').y, 
						z: this.getEntity()._z+1
						
					})
			queueElements[i].object.set({'prio': queueElements[i].priority});
			offset += queueElements[i].object.getEntity()._w;
		}
    },
    removeCharacter: function(characterId){
    	console.log('remove Character '+characterId);
    	var queueElements = this.getQueue().getAll();
    	for (var i = 0; i < queueElements.length; i++) {
			if (characterId == queueElements[i].object.get('characterId')) {
				removedElement = this.getQueue().removeAtIdx(i);//remove model from queue
				//TODO: remove queueitem - entity with animation fadeout + shift other items  
				removedElement.remove(); //destroy model
				this.updateQueue();
				return;
			}
		}
    }
    
});

QueuePortrait = BaseEntity.extend({
defaults: {
        'characterId' : null,
        'prio':'nullnull'
    },
    initialize: function(){
	    var model = this;
     	model.set({'characterId' : this.attributes.characterId });
     	var c = sc[model.get('characterId')];
		//TODO get character model by id and render apopriate portrait
		var entity = Crafty.e("2D, DOM, Mouse, Color");//, MouseHover
	    entity
            .attr({w: 120, h:200})
            .bind('Click', function(){
            	Crafty.trigger('QueuePortraitClicked', {characterId: c.get('characterId')});
            })
        entity.color(c.get('color'));//helper while boxes are not unique
	        
     	model.set({'entity' : entity });
     
        var labelNamePadding = 5;//from top down
        var labelArmorPadding = 45;//bottom up
        var labelHealthPadding = 30;//bottom up
        var labelPrioPadding = 15;//bottom up
        var textcolor = '#000000';
    	
    
        var labelName = Crafty.e("2D, DOM, Text")
            .text('')
            .textColor(textcolor)
            .textFont({'size' : '24px', 'family': 'Arial'})
            //.attr({x:100,  y:310})
        	.attr({
        		x: entity._x + 5,  
        		y: entity._y + labelNamePadding, 
        		w: entity._w - 5, 
        		h: entity._h, 
        		z: 1001
        		})
        entity.attach(labelName);
    	model.set({'labelName' : labelName });

    	var labelArmor = Crafty.e("2D, DOM, Text")
            .text('')
            .textColor(textcolor)
            .textFont({'size' : '12px', 'family': 'Arial'})
            //.attr({x:100,  y:310})
        	.attr({
        		x: entity._x + 5,  
        		y: entity._y + entity._h - labelArmorPadding, 
        		w: entity._w-5, 
        		h: entity._h, 
        		z: 1001
        		})
        entity.attach(labelArmor);
    	model.set({'labelArmor' : labelArmor });

    	
    	var labelHealth = Crafty.e("2D, DOM, Text")
            .text('')
            .textColor(textcolor)
            .textFont({'size' : '12px', 'family': 'Arial'})
            //.attr({x:100,  y:310})
        	.attr({
        		x: entity._x + 5,  
        		y: entity._y + entity._h - labelHealthPadding, 
        		w: entity._w-5, 
        		h: entity._h, 
        		z: 1001
        		})
        entity.attach(labelHealth);
    	model.set({'labelHealth' : labelHealth });
    		
    	var labelPrio = Crafty.e("2D, DOM, Text")
            .text('')
            .textColor(textcolor)
            .textFont({'size' : '12px', 'family': 'Arial'})
            //.attr({x:100,  y:310})
        	.attr({
        		x: entity._x + entity._w/2 ,  
        		y: entity._y + entity._h - labelPrioPadding, 
        		w: entity._w-5, 
        		h: entity._h, 
        		z: 1001
        		})
        entity.attach(labelPrio);
    	model.set({'labelPrio' : labelPrio });
    		
    	model.updateLabels(c);
    	c.on("change", function(charModel){
    		model.updateLabels(charModel);
	      });
	    this.on("change", function(queuePortraitModel) {
    		model.updateLabels(sc[queuePortraitModel.get('characterId')]);
	      });  
    	
    },
    getLabelNameEntity : function(){
    	return this.get('labelName');
    },
    getLabelHealthEntity : function(){
    	return this.get('labelHealth');
    },
    remove : function(){
        var entity = this.getLabelNameEntity();
        if (entity){
            entity.destroy();
        }
        var entity = this.getLabelHealthEntity();
        if (entity){
            entity.destroy();
        }
        var entity = this.getEntity();
        if (entity){
            entity.destroy();
        }
        
        
    } ,
    updateLabels: function(charModel) {
       var model = this;	
       model.get("labelName").text(charModel.get("name"));	
       model.get("labelHealth").text('health: ' + Math.round(charModel.c().getCurrentHealth()) + ' / ' + Math.round(charModel.c().getHealth()));	
	   model.get("labelArmor").text('armor: ' + Math.round(charModel.c().getArmor()));	
	   model.get("labelPrio").text('' + this.get('prio'));
	   
	
    }
    
});