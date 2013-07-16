/**
   Example:
   var acd = new AttackConfirmDialog();
	acd.set({'attackerName':'dave',
		'defenderName':'orc',
		'hitChance':10.32,
		'attackAbilityName':'sword',
		'effectDescription': '21 - 24 health damage',
		'attackTable':attackTable});
		
	acd.getBtnConfirm().getEntity().bind("Click", function(){
		executeAttack(attacker, defender);
	});	
 */
AttackConfirmDialog = BaseEntity.extend({
defaults: {
	    'btnAbort':null,
	    'btnConfirm':null,
	    'entity': null,
	    'bgEntity': null,
	    'x':270,
	    'y':70,
	    'h':400,
	    'w':400,
	    'z':2000,
	    'attackerName':'placeholder',
	    'defenderName':'placeholder',
	    'hitChance':'placeholder',
	    'attackAbilityName':'placeholder',
	    'effectDescription':'placeholder',
	    'defenseDescription':'placeholder',
	    'attackDuration':'placeholder',
	    'attackTable':'placeholder',
    },
    initialize: function(){
    	var model = this;
		
		var entity = Crafty.e("2D, DOM, Mouse, Text, Draggable")
            .attr({x: this.get('x'), y: this.get('y'), h:this.get('h'), w: this.get('w'), z: this.get('z')+1})
            .textColor("ffffff");
            
            
        var bgEntity = Crafty.e("2D, DOM, Color")
            .attr({x: this.get('x'), y: this.get('y'), h:this.get('h'), w: this.get('w'), z: this.get('z')})
            .color("#4a1100");
        entity.attach(bgEntity);

		var btnConfirm = new ButtonDialog({x: this.get('x')+280, y: this.get('y')+330, z: this.get('z')+1 , text:"attack"});
        btnConfirm.getEntity().bind("Click", function(){
			model.remove();
		});
		entity.attach(btnConfirm.getEntity());

		var btnAbort = new ButtonDialog({x: this.get('x')+20, y: this.get('y')+330, z: this.get('z')+1 , text:"abort"});
        btnAbort.getEntity().bind("Click", function(){
			model.remove();
		});
		entity.attach(btnAbort.getEntity());
		
     	model.set({'entity' : entity });
        model.set({'bgEntity' : bgEntity });
		model.set({'btnConfirm' : btnConfirm });
		model.set({'btnAbort' : btnAbort });

		model.on("change", function(charModel){
			this.updateContent();
      	});     	

     	
	},
	getBgEntity: function() {
		return this.get('bgEntity');
	},
	getBtnConfirm: function() {
		return this.get('btnConfirm');
	},
	getBtnAbort: function() {
		return this.get('btnAbort');
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
        var btnConfirm = this.getBtnConfirm();
		btnConfirm.remove(); 
		var btnAbort = this.getBtnAbort();
		btnAbort.remove();        
    },
    updateContent: function() {
    	var ret = this.get('attackerName') + ' attacks ' + this.get('defenderName') + '<br/>\n';
    	ret += 'with ' + this.get('attackAbilityName') + '<br/>\n';
    	ret += '&nbsp;&nbsp;&nbsp;defense: ' + this.get('defenseDescription') + 's<br/>\n';
    	ret += '&nbsp;&nbsp;&nbsp;effect:' + this.get('effectDescription') + '<br/>\n';
    	ret += '&nbsp;&nbsp;&nbsp;chance:' + this.get('hitChance').toFixed(2) + '% <br/>\n';
    	ret += '&nbsp;&nbsp;&nbsp;time: ' + this.get('attackDuration') + 's<br/>\n';
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
			absChance = (attackTable[i].maxrole - prev);
			if (absChance>0) {
				newContent = newContent 
						+ ruleBook.attackResultToString(attackTable[i].type) + ': ' 
						+ prev.toFixed(2) + ' - ' + attackTable[i].maxrole.toFixed(2) 
						+ ' ('+absChance.toFixed(2)+'%)<br/>\n';
			}
			prev = attackTable[i].maxrole;
		}
		return newContent;
    }
    
});
