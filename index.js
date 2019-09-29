'use strict';

var apiservicePhpCrud = require('./services/ApiService_PhpCrud');

module.exports =  {

     helloWorld() {
    	console.log("hello world - module is up and running");
    },

    debug : true,

    mode : null,

    default_mode : { 
    				// API MODE PROPERTIES
                    apitype : null,
                    urlbase : null,
                    urlpath : null,
	        		port : 443,

	        		// REQUEST
                    search_phrase : null,
                    context : null,
                    identity : null,

                    // RESULT : ITEMS
                    items : [],
                    // RESULT : MODEL
                    model : null
                },


    alterMode(mode){
        if(this.mode){
            this.mode = Object.assign(this.mode, mode);
        }else{
            this.mode = mode;
        }
        if(this.debug) console.log("MODE ALTERED TO : ", this.mode);
        return this.mode;
    },
     setMode(mode){
        this.mode = mode;
        if(this.debug) console.log("MODE SET AS : ", this.mode);
    },	
     getMode(){
    	return this.mode;
    },

     requireModePropertiesOrError(arr){
        if(this.debug)  console.log("requireModePropertiesOrError");
    	var mode = this.getMode();
    	var missing = [];
    	for(var i=0; i<arr.length; i++){
    		if(!mode.hasOwnProperty(arr[i]) || mode[arr[i]]===null ){
    			missing.push(arr[i]);
    		}
    	}
    	if(missing.length>0){
            //throw "ERROR : MODE IS MISSING PROPS : " + missing;
    		console.log("ERROR : MODE IS MISSING PROPS : ",missing);
            //throw "ERROR : MODE IS MISSING PROPS : " + missing;
    		return false
    	}


    	return true;
    },


     getItems(mode=null) {
    	if(mode) this.setMode(mode)
    	mode = this.getMode();
    	//------------------------

    	if(!this.requireModePropertiesOrError(['urlbase','urlpath','port','apitype'])){
            throw "ERROR : MISSING PROPERTIES";
    	}

        if(this.debug)  console.log("getItems");
        var prom;
        if(mode.apitype === "phpcrud"){

	        return new Promise(function(resolve, reject) {
	        	apiservicePhpCrud.apiGetItems(mode.urlbase,mode.urlpath,mode.port,mode.context,mode.search_phrase)
		        .then(function(response) {
		        	var recItems = response.ge001;
                    // ADD ITEMS PROPERTY IF IT DOESNT EXIST
                    if(!mode.hasOwnProperty('items')){
                        mode['items'] = [];
                    }else{
                        mode.items.length = 0; // TO EMPTY THE ARRAY
                    }
		        	mode.items.push(...recItems);
		            resolve();
		        }, function(err) {
		            reject();
		        });
	        });


        }else{
            //prom = apiserviceCyolo.apiGet(baseurl,context,search);
        }


    },

     getItem(mode=null) {
    	if(mode) this.setMode(mode)
    	mode = this.getMode();
    	//------------------------

    	if(!this.requireModePropertiesOrError(['urlbase','urlpath','port','apitype','identity'])){
    		return null;
    	}

        if(this.debug)  console.log("getItem");
        var prom;
        if(mode.apitype === "phpcrud"){

            return new Promise(function(resolve, reject) {
                apiservicePhpCrud.apiGetItem(mode.urlbase,mode.urlpath,mode.port,mode.identity)
                .then(function(response) {
                    mode['model'] = response;
                    resolve();
                }, function(err) {
                    reject();
                });
            });


        }else{
            //prom = apiserviceCyolo.apiGet(baseurl,context,search);
        }

        return prom;
    },


     updateItem(mode=null) {
    	if(mode) this.setMode(mode)
    	mode = this.getMode();
    	//------------------------

    	if(!this.requireModePropertiesOrError(['urlbase','urlpath','port','apitype','model'])){
    		return null;
    	}

        if(this.debug) console.log("getItem");
        var prom;
        if(mode.apitype === "phpcrud"){
            prom = apiservicePhpCrud.apiUpdateItem(mode.urlbase,mode.urlpath,mode.port,mode.model);
        }else{
            //prom = apiserviceCyolo.apiGet(baseurl,context,search);
        }

        return prom;
    },


     createItem(mode=null) {
    	if(mode) this.setMode(mode)
    	mode = this.getMode();
    	//------------------------

    	if(!this.requireModePropertiesOrError(['urlbase','urlpath','port','apitype','model'])){
    		return null;
    	}

        if(this.debug) console.log("getItem");
        var prom;
        if(mode.apitype === "phpcrud"){
            prom = apiservicePhpCrud.apiCreateItem(mode.urlbase,mode.urlpath,mode.port,mode.model);
        }else{
            //prom = apiserviceCyolo.apiGet(baseurl,context,search);
        }

        return prom;
    },


     deleteItem(mode=null) {
    	if(mode) this.setMode(mode)
    	mode = this.getMode();
    	//------------------------

    	if(!this.requireModePropertiesOrError(['urlbase','urlpath','port','apitype','identity'])){
    		return null;
    	}

        if(this.debug) console.log("getItem");
        var prom;
        if(mode.apitype === "phpcrud"){
            prom = apiservicePhpCrud.apiDeleteItem(mode.urlbase,mode.urlpath,mode.port,mode.identity);
        }else{
            //prom = apiserviceCyolo.apiGet(baseurl,context,search);
        }

        return prom;
    },


    // A SIMPLE TEST FUNCTION
	 numberFormatter(number, locale) {
	    return number.toLocaleString(locale);
	}

}