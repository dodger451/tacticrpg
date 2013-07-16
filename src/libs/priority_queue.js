/**
 * PriorityQueue
 * 
 * @see https://github.com/STRd6/PriorityQueue.js
 */
(function() {
  /**
   * @private
   */
  var prioritySortHigh = function(a, b) {
    return b.priority - a.priority; //original
    //return a <= b ? 1 : -1
  };

  /**
   * @private
   */
  var prioritySortLow = function(a, b) {
    return a.priority - b.priority;
  };

  /*global PriorityQueue */
  /**
   * @constructor
   * @class PriorityQueue manages a queue of elements with priorities. Default
   * is highest priority first.
   *
   * @param [options] If low is set to true returns lowest first.
   */
  PriorityQueue = function(options) {
    var contents = [];

    var sorted = false;
    var sortStyle;

    if(options && options.low) {
    	console.log('PriorityQueue created using low-sort');
      sortStyle = prioritySortLow;
    } else {
      sortStyle = prioritySortHigh;
    }

    /**
     * @private
     */
    var sort = function() {
      contents.sort(sortStyle);
      sorted = true;
    };

    var self = {
      /**
       * Removes and returns the next element in the queue.
       * @member PriorityQueue
       * @return The next element in the queue. If the queue is empty returns
       * undefined.
       *
       * @see PrioirtyQueue#top
       */
      pop: function() {
        if(!sorted) {
          sort();
        }

        var element = contents[0];
		contents = contents.slice(1, contents.length)
        if(element) {
          return element.object;
        } else {
          return undefined;
        }
      },

      /**
       * Returns but does not remove the next element in the queue.
       * @member PriorityQueue
       * @return The next element in the queue. If the queue is empty returns
       * undefined.
       *
       * @see PriorityQueue#pop
       */
      top: function() {
        if(!sorted) {
          sort();
        }

        //var element = contents[contents.length - 1];
		var element = contents[0];
        if(element) {
          return element.object;
        } else {
          return undefined;
        }
      },

      /**
       * @member PriorityQueue
       * @param object The object to check the queue for.
       * @returns true if the object is in the queue, false otherwise.
       */
      includes: function(object) {
        for(var i = contents.length - 1; i >= 0; i--) {
          if(contents[i].object === object) {
            return true;
          }
        }

        return false;
      },

      /**
       * @member PriorityQueue
       * @returns the current number of elements in the queue.
       */
      size: function() {
        return contents.length;
      },

      /**
       * @member PriorityQueue
       * @returns true if the queue is empty, false otherwise.
       */
      empty: function() {
        return contents.length === 0;
      },

      /**
       * @member PriorityQueue
       * @param object The object to be pushed onto the queue.
       * @param priority The priority of the object.
       */
      push: function(object, priority) {
        contents.push({object: object, priority: priority});
        sorted = false;
      },
      
      //custom methods
      /**
       * Adds a priority to all objects (priority cannot become less than 0)
       * 
       * @member PriorityQueue
 	   * @param priority The priority-delta
       */
      addPriorityToAll: function(diff) {
      	if(!sorted) {
          sort();
        }
        for(var i = contents.length - 1; i >= 0; i--) {
          contents[i].priority = Math.max(0, (contents[i].priority + diff ));
        }
      },
      
      getAll: function() {
      	//console.log('getAll invoked');
      	if(!sorted) {
        	console.log('getAll sorts');
      	  	sort();
        }
        return contents;
      },
      
      topPriority: function() {
        return this.getPrioAtIdx(0);
      },
      removeAtIdx: function(idx) {
      	return contents.splice(idx, 1)[0].object;
      }
	  ,
      getPrioAtIdx: function(idx) {
      	if(!sorted) {
          sort();
        }

        var element = contents[idx];

        if(element) {
          return element.priority;
        } else {
          return undefined;
        }
      }
      
      
    };

    return self;
  };
})();