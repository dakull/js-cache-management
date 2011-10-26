/*
*  Cache management classes
*    author: Marian Posaceanu
*    version: 1.1
* 
*/
function sha1Hash(msg){var K=[1518500249,1859775393,2400959708,3395469782];msg+=String.fromCharCode(128);var l=msg.length/4+2;var N=Math.ceil(l/16);var M=new Array(N);for(var i=0;i<N;i++){M[i]=new Array(16);for(var j=0;j<16;j++){M[i][j]=(msg.charCodeAt(i*64+j*4)<<24)|(msg.charCodeAt(i*64+j*4+1)<<16)|(msg.charCodeAt(i*64+j*4+2)<<8)|(msg.charCodeAt(i*64+j*4+3));}}M[N-1][14]=((msg.length-1)*8)/Math.pow(2,32);M[N-1][14]=Math.floor(M[N-1][14]);M[N-1][15]=((msg.length-1)*8)&4294967295;var H0=1732584193;var H1=4023233417;var H2=2562383102;var H3=271733878;var H4=3285377520;var W=new Array(80);var a,b,c,d,e;for(var i=0;i<N;i++){for(var t=0;t<16;t++){W[t]=M[i][t];}for(var t=16;t<80;t++){W[t]=ROTL(W[t-3]^W[t-8]^W[t-14]^W[t-16],1);}a=H0;b=H1;c=H2;d=H3;e=H4;for(var t=0;t<80;t++){var s=Math.floor(t/20);var T=(ROTL(a,5)+f(s,b,c,d)+e+K[s]+W[t])&4294967295;e=d;d=c;c=ROTL(b,30);b=a;a=T;}H0=(H0+a)&4294967295;H1=(H1+b)&4294967295;H2=(H2+c)&4294967295;H3=(H3+d)&4294967295;H4=(H4+e)&4294967295;}return H0.toHexStr()+H1.toHexStr()+H2.toHexStr()+H3.toHexStr()+H4.toHexStr();}function f(s,x,y,z){switch(s){case 0:return(x&y)^(~x&z);case 1:return x^y^z;case 2:return(x&y)^(x&z)^(y&z);case 3:return x^y^z;}}function ROTL(x,n){return(x<<n)|(x>>>(32-n));}Number.prototype.toHexStr=function(){var s="",v;for(var i=7;i>=0;i--){v=(this>>>(i*4))&15;s+=v.toString(16);}return s;};

/*
*  class: ObjectKey
*  deps: sha1Hash.function
*/
var ObjectKey = function(id_original) {  
  this.id_original = id_original;
  this.id_hash = sha1Hash(this.id_original);
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
var ObjectCreator = function(create_callback) {
  
  if( !create_callback ) { 
    this.create_callback = function(objKey) {};
  } else {
    this.create_callback = create_callback;
  }

};

  ObjectCreator.prototype = {
    
    createObject: function(objKey,cache) {
      var res = this.create_callback(objKey,cache);
    }
  };


/* 
*  class: Cache
*  deps: -
*  example:
*    this.cache['c27e3220e7ddbc7ab334099753efcf743d412624'] = "This is a test";
*/
var Cache = function() {
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
      // console.log( "  Add to Cache: ["+objKey.getIdHash()+"] "+objKey.getIdOriginal() );
      this.cache[ objKey.getIdHash() ] = fresh_obj;
    }
    
  };


/* 
*  class: CacheManager 
*  deps: Cache
*  example:
*   this.cache.fetchObject(objKey);
*/
var CacheManager = function(create_callback) {
  this.objectCreator = new ObjectCreator(create_callback);
  this.cache = new Cache();
};

  CacheManager.prototype = {
    
    fetchObject: function(objKey) {

      var keyed_obj = new ObjectKey(objKey);
      var buff = this.cache.fetchObject(keyed_obj);
      
      if( buff === false ) {
        // console.warn( "NOT in cache: ["+keyed_obj.getIdHash()+"] "+keyed_obj.getIdOriginal() );
        var fresh_obj = this.objectCreator.createObject(keyed_obj,this.cache);
        return fresh_obj;
      } else {
        // console.info( "FROM cache: ["+keyed_obj.getIdHash()+"] "+keyed_obj.getIdOriginal() );
        return buff;
      }
      
    }
    
  };