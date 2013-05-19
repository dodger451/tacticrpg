/**
 * 
 *
 * @see https://github.com/ahilles107/CraftyBoilerplate/blob/master/src/entities/base/BaseEntity.js 
 */
BaseEntity = Backbone.Model.extend({
defaults: {
        'entity' : null
    },
    initialize: function(){
    
    },
    getEntity : function(){
        return this.get('entity');
    },
    remove : function(){
        var entity = this.getEntity();

        if (entity){
            entity.destroy();
        }
    }
});