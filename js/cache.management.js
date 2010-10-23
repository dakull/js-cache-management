/*
*	Cache management classes
*		author: Marian Posaceanu
*		version: 1.0
*		date: 11/04/2010
*/

/* 
*	clasa: ObjectKey 
*	dependente: sha-1-v-1-0.js
*/

// constructor
var ObjectKey = function(id_original) {
	
	this.id_original = id_original;
	this.id_hash = sha1Hash(this.id_original);

};

	// metode
	ObjectKey.prototype = {
		
		getIdOriginal: function() {
			return this.id_original;
		},
		getIdHash: function() {
			return this.id_hash;
		}
		
	};

// end clasa ObjectKey


/* 
*	clasa: ObjectCreator 
*	dependente: -
*/

// constructor
var ObjectCreator = function() {
	this.raspuns = 'loading';
};

	// metode
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
// end clasa ObjectCreator


/* 
*	clasa: Cache
*	dependente: -
*/

// constructor
var Cache = function() {
	console.log("Init Cache");
	this.cache = new Array();
	//this.cache['c27e3220e7ddbc7ab334099753efcf743d412624'] = "Acesta este un test";

};

	// metode
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
			console.log( "	Add to Cache: ["+objKey.getIdOriginal()+"] "+objKey.getIdHash() );
			this.cache[ objKey.getIdHash() ] = fresh_obj;
		}
		
	};

// end clasa CacheManager


/* 
*	clasa: CacheManager 
*	dependente: -
*/

// constructor
var CacheManager = function() {
	console.log("Init CacheManager");
	this.objectCreator = new ObjectCreator();
	this.cache = new Cache();

};

	// metode
	CacheManager.prototype = {
		
		fetchObject: function(objKey) {
			
			var buff = this.cache.fetchObject(objKey);
			
			if( buff === false ) {
				console.warn( "Nu din cache: ["+objKey.getIdOriginal()+"] "+objKey.getIdHash() );
				var fresh_obj = this.objectCreator.createObject(objKey,this.cache);
				//this.cache.addObject(objKey,fresh_obj);
				return fresh_obj;
			} else {
				console.info( "Obiectul preluat din cache: ["+objKey.getIdOriginal()+"] "+objKey.getIdHash() );
				return buff;
			}
			
		}
		
	};

// end clasa CacheManager