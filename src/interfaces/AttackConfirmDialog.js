
AttackConfirmDialog = BaseEntity.extend({
defaults: {
	    'entity': null,
	    'bgEntity': null,
	    'x':270,
	    'y':70,
	    'h':200,
	    'w':400,
	    'z':2000,
	    'attackerName':'placeholder',
	    'defenderName':'placeholder',
	    'hitChance':'placeholder',
	    'attackAbilityName':'placeholder',
	    'effectDescription':'placeholder',
	    'attackTable':'placeholder',
    },
    initialize: function(){
    	var model = this;
		
		var entity = Crafty.e("2D, DOM, Mouse, Text, Draggable")
            .attr({x: this.get('x'), y: this.get('y'), h:this.get('h'), w: this.get('w'), z: this.get('z')+1})
            .textColor("ffffff");
            
            
        var bgEntity = Crafty.e("2D, DOM, Color")
            .attr({x: this.get('x'), y: this.get('y'), h:this.get('h'), w: this.get('w'), z: this.get('z')})
            .color('blue');
        
        entity.attach(bgEntity);

		
     	model.set({'entity' : entity });
        model.set({'bgEntity' : bgEntity });

		model.on("change", function(charModel){
			this.updateContent();
      	});     	

     	
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
    },
    updateContent: function() {
    	var ret = this.get('attackerName') + ' attacks ' + this.get('defenderName') + '<br/>\n';
    	ret += 'with ' + this.get('attackAbilityName') + '<br/>\n';
    	ret += this.get('hitChance') + '%' + '<br/>\n';
    	ret += this.get('effectDescription') + '<br/>\n';
    	ret += '<br/>\n';
    	ret += this.getAttackTableDescription() ;
    	
    	this.getEntity().text(ret);
    },
    getAttackTableDescription: function() {
    	if (!this.get('attackTable')) {
    		return '';
    	}
    	var attackTable = this.get('attackTable');
		var ruleBook = new Combatrules();
		var newContent = 'attacktable:';
		var prev = 0;
		var newContent='';
		for (var i = 0; i < attackTable.length; i++) {
			newContent = newContent 
						+ ruleBook.attackResultToString(attackTable[i].type) + ':' 
						+ prev.toFixed(2) + ' - ' + attackTable[i].maxrole.toFixed(2) 
						+ ' ('+(attackTable[i].maxrole - prev).toFixed(2)+'%)<br/>\n';
			prev = attackTable[i].maxrole;
		}
		return newContent;
    }
    
});
