/*
*  Cache management classes
*    author: Marian Posaceanu
*    version: 1.1
*    date: --/--/----
*/

/*
*  class: ObjectKey
*  deps: sha-1-v-1-0.js
*/
var ObjectKey = function(id_original,id_hash = '') {
  
  this.id_original = id_original;
  if( id_hash == '' ) {
    this.id_hash = sha1Hash(this.id_original);
  } else {
    this.id_hash = id_hash;
  }
};

  ObjectKey.prototype = {
    
    getIdOriginal: function() {
      return this.id_original;
    },
    getIdHash: function() {
      return this.id_hash;
    }
    
  };

/*
*  class: ObjectCreator
*  deps: - 
*/
var ObjectCreator = function() {
  this.raspuns = 'loading';
};

  ObjectCreator.prototype = {
    
    getRaspuns: function() {  
      return this.raspuns;
    },
    createObject: function(objKey,cache) {
      var make_req_to = objKey.getIdOriginal();
      
      $.ajax({url: make_req_to,
           context: this, 
           success: function(html){
             $('#project_dialog').append(html);
                cache.addObject(objKey,html);
          }
        });
    }
  };

/* 
*  class: Cache
*  deps: -
*  example:
*    this.cache['c27e3220e7ddbc7ab334099753efcf743d412624'] = "This is a test";
*/
var Cache = function() {
  console.log("Init Cache");
  this.cache = new Array();
};

  Cache.prototype = {
    
    fetchObject: function(objKey) {
      
      for (var i in this.cache) {
        if( i == objKey.getIdHash() ) {
          return this.cache[i];
        }
      }
      
      return false;
    
    },
    addObject: function(objKey,fresh_obj) {
      console.log( "  Add to Cache: ["+objKey.getIdOriginal()+"] "+objKey.getIdHash() );
      this.cache[ objKey.getIdHash() ] = fresh_obj;
    }
    
  };
// end clasa CacheManager

/* 
*  class: CacheManager 
*  deps: -
*  example:
*   this.cache.addObject(objKey,fresh_obj);
*/
var CacheManager = function() {
  this.objectCreator = new ObjectCreator();
  this.cache = new Cache();
};

  CacheManager.prototype = {
    
    fetchObject: function(objKey) {
      
      var buff = this.cache.fetchObject(objKey);
      
      if( buff === false ) {
        // console.warn( "Nu din cache: ["+objKey.getIdOriginal()+"] "+objKey.getIdHash() );
        var fresh_obj = this.objectCreator.createObject(objKey,this.cache);
        return fresh_obj;
      } else {
        // console.info( "Obiectul preluat din cache: ["+objKey.getIdOriginal()+"] "+objKey.getIdHash() );
        return buff;
      }
      
    }
    
  };