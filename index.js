//'use strict';

//var apiservicePhpCrud = require('./services/ApiService_PhpCrud');
import apiservicePhpCrud from './services/ApiService_PhpCrud';

//var apiserviceLabrador = require('./services/ApiService_Labrador');
import apiserviceLabrador from './services/ApiService_Labrador';


// IMPORT MODE FUNCTIONS
//import Mode from '../REPO_TDR_ENCO_POODLE_MODE/index';
//import { mi } from '../REPO_TDR_ENCO_POODLE_MODE/index';
import { mfAuth } from 'enco-poodle-mode-simple';
import { mfModelAndItems } from 'enco-poodle-mode-simple';



//module.exports =  {
export default {

     helloWorld() {
    	console.log("hello world - module is up and running ",mf);
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
                    models : [],

                    schemas : []
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
        //if(this.debug) console.log("MODE SET AS : ", this.mode);
    },	
    getMode(){
    	return this.mode;
    },

    requireModePropertiesOrError(arr){
        //if(this.debug)  console.log("requireModePropertiesOrError");
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


//================================================================================

    // NEW V2 CLEAN FUNCTIONS (SPECIFIC INTERFACE LOGIC IS DELEGATED TO THE INTERFACE SERVICE)

    // NOTE : KEEP IT SIMPLE
    // NOTE : PURPOSE OF THIS LAYER IS 
    //        1) TO RECEIVE A MODE OBJECT (AND TRANSLATE IT TO A SPECIFIC SERVICE)
    //        2) DETERMINE IF THE MODE REQUEST CONTAINS THE REQUIRED PROPERTIES FOR ONE SERVICE
    //        3) DELEGATE THE REQUEST TO THE APPROPRIATE SERVICE
    //        4) SEND THE EXACT RAW INFORMATION OVER TO THE SERVICE
    //
    // NOTE : THIS CLASS UNDERSTANDS MODES AND WHAT TO SEND - BUT IT DOES NOT UNDERSTAND ANY SERVICE SPECIFIC LOGIC
    // NOTE : THE SERVICE CLASSES UNDERSTAND THEIR OWN LOGIC - BUT THEY DO NOT UNDERSTAND MODE  

//================================================================================

    // LAYER 3 : SIMPLE INTERFACE ... methods that forward to relevant layers below
    // 

    getItems(mode=null) {
        // NOTE ... could also foward to searchItemModeFunction
        // NOTE ... func provides a pointer to the promise to be executed with the mode (in its future state)
        //      ... in otherwords we can pass a generic pointer to any promise so long as that promise only needs mode as its parameter
        //      ... also mode is not provided at this stage (it will be provided later) 
        var func = function(self,mode) { return self.readItemsModeFunction(mode); };
        return this.modeAuthenticateIfNecessaryAndThenPerformPromise(mode,func)
    },
    getItem(mode=null) {
        var func = function(self,mode) { return self.readItemModeFunction(mode); };
        return this.modeAuthenticateIfNecessaryAndThenPerformPromise(mode,func)
    },
    updateItem(mode=null) {
        var func = function(self,mode) { return self.updateItemModeFunction(mode); };
        return this.modeAuthenticateIfNecessaryAndThenPerformPromise(mode,func)
    },
    updateItems(mode=null) {
        /// MISSING 
    },
    createItem(mode=null) {
        var func = function(self,mode) { return self.createItemModeFunction(mode); };
        return this.modeAuthenticateIfNecessaryAndThenPerformPromise(mode,func)
    },
    deleteItem(mode=null) {
        var func = function(self,mode) { return self.deleteItemModeFunction(mode); };
        return this.modeAuthenticateIfNecessaryAndThenPerformPromise(mode,func)
    },



//================================================================================

    // LAYER 2 : MODE INTERFACE (INPUT MODE and OUTPUT MODE)
    //    see a lower level interface below


    // Authenticate then run the function to return a promise to be executed in sequence
    modeAuthenticateIfNecessaryAndThenPerformPromise(mode,func){
        var self = this;
        return new Promise(function(resolve, reject) {
            var promToAuthenticate = self.modeAuthenticateIfNecessary(mode);
            if(promToAuthenticate){
                promToAuthenticate.then(function(response) {
                    // perform the function with the mode in the current state
                    var prom = func(self,mode)
                    if(prom){
                        prom.then(function(response) {
                            resolve(response);
                        }, function(err) {
                            reject(err);
                        });
                    }else{
                        reject(err);
                    }
                }, function(err) {
                    reject(err);
                });
            }else{
                reject();
            }
        });

    },


    // V2 MODE FUNCTION
    // RESOLVES WHEN FINISHED AUTHENTICATING .. PLUS SETS TOKEN AND STRIPS LOGIN DETAILS
    modeAuthenticateIfNecessary(mode=null){

        var self = this;
        return new Promise(function(resolve, reject) {

            if( mode.hasOwnProperty('auth') && mode.auth.hasOwnProperty('token') ){
                console.log("modeAuthenticateIfNecessary : ALREADY AUTHENTICATED")
                resolve();
            }else{
                console.log("modeAuthenticateIfNecessary : REQUIRES AUTH")
                // ---------------------------------
                var prom = self.authenticateWithEmailPassword(mode)
                if(prom){
                    prom.then(function(response) {
                        //console.log("modeAuthenticateIfNecessary : GOT AUTH")
                        // RESPONSE IS A TOKEN
                        // ----------------------------------
                        // MODE SPECIFIC FUNCTIONALITY FOLLOWS 
                        // MAY CHOSE TO PLACE THIS FUNCTIONALITY THIS INTO MODE CLASS
                        mfAuth.modeAddAuthToken(mode,response)
                        mfAuth.modeStripLoginDetails(mode)
                        // ----------------------------------
                        resolve(response);
                    }, function(err) {
                        console.log("modeAuthenticateIfNecessary : ERROR : ",err)
                        reject(err);
                    });
                }else{
                    reject();
                }
                // ---------------------------------
            }

        });

    },



    // V2 MODE FUNCTION
    // RESOLVES WHEN COMPLETE HAVING MODIFIED THE MODE
    readItemsModeFunction(mode=null) {
        var self = this;
        return new Promise(function(resolve, reject) {
            var prom = self.readItemsFromStore(mode)
            if(prom){
                prom.then(function(response) {
                    // RESPONSE IS AN ARRAY
                    // ----------------------------------
                    // MODE SPECIFIC FUNCTIONALITY FOLLOWS 
                    // MAY CHOSE TO PLACE THIS FUNCTIONALITY THIS INTO MODE CLASS
                    mfModelAndItems.modeAddItems(mode,response)
                    // ----------------------------------
                    resolve(response);
                }, function(err) {
                    reject(err);
                });
            }else{
                reject();
            }
            // ---------------------------------
        });
    },



    // V2 MODE FUNCTION
    // RESOLVES WHEN COMPLETE HAVING MODIFIED THE MODE
    readItemModeFunction(mode=null) {
        var self = this;
        return new Promise(function(resolve, reject) {
            // ---------------------------------
            var prom = self.readItemFromStore(mode)
            if(prom){
                prom.then(function(response) {
                    // RESPONSE IS AN ARRAY
                    // ----------------------------------
                    // MODE SPECIFIC FUNCTIONALITY FOLLOWS 
                    // MAY CHOSE TO PLACE THIS FUNCTIONALITY THIS INTO MODE CLASS
                    var parsedModel = mfModelAndItems.modeParseIncomingModel(mode,response)
                    mfModelAndItems.modeSetModel(mode,parsedModel)
                    // ----------------------------------
                    resolve(response);
                }, function(err) {
                    reject(err);
                });
            }else{
                reject();
            }
            // ---------------------------------
        });
    },


    // V2 MODE FUNCTION
    // RESOLVES WHEN COMPLETE HAVING MODIFIED THE MODE
    createItemModeFunction(mode=null) {
        var self = this;
        return new Promise(function(resolve, reject) {
            // ---------------------------------
            var prom = self.createItemInStore(mode)
            if(prom){
                prom.then(function(response) {
                    console.log("createItemModeFunction : ok" )
                    // RESPONSE IS ...
                    // ----------------------------------
                    // MODE SPECIFIC FUNCTIONALITY FOLLOWS 
                    // MAY CHOSE TO PLACE THIS FUNCTIONALITY THIS INTO MODE CLASS
                    mfModelAndItems.modeSetModelsAreClean(mode)
                    // ----------------------------------
                    resolve(response);
                }, function(err) {
                    console.log("createItemModeFunction : ok 2" )
                    reject(err);
                });
            }else{
                console.log("createItemModeFunction : ok 3" )
                reject();
            }
            // ---------------------------------
        });
    },

    // V2 MODE FUNCTION
    // RESOLVES WHEN COMPLETE HAVING MODIFIED THE MODE
    updateItemModeFunction(mode=null) {
        var self = this;
        return new Promise(function(resolve, reject) {
            // ---------------------------------
            var prom = self.updateItemInStore(mode)
            if(prom){
                prom.then(function(response) {
                    // RESPONSE IS ...
                    // ----------------------------------
                    // MODE SPECIFIC FUNCTIONALITY FOLLOWS 
                    // MAY CHOSE TO PLACE THIS FUNCTIONALITY THIS INTO MODE CLASS
                    mfModelAndItems.modeSetModelsAreClean(mode)
                    // ----------------------------------
                    resolve(response);
                }, function(err) {
                    reject(err);
                });
            }else{
                reject();
            }
            // ---------------------------------
        });
    },


    // V2 MODE FUNCTION
    // RESOLVES WHEN COMPLETE HAVING MODIFIED THE MODE
    searchItemModeFunction(mode=null) {
        var self = this;
        return new Promise(function(resolve, reject) {
            // ---------------------------------
            var prom = self.searchItemInStore(mode)
            if(prom){
                prom.then(function(response) {
                    // RESPONSE IS AN ARRAY
                    // ----------------------------------
                    // MODE SPECIFIC FUNCTIONALITY FOLLOWS 
                    // MAY CHOSE TO PLACE THIS FUNCTIONALITY THIS INTO MODE CLASS
                    mfModelAndItems.modeAddItems(mode,response)
                    // ----------------------------------
                    resolve(response);
                }, function(err) {
                    reject(err);
                });
            }else{
                reject();
            }
            // ---------------------------------
        });
    },



    // V2 MODE FUNCTION
    // RESOLVES WHEN COMPLETE HAVING MODIFIED THE MODE
    deleteItemModeFunction(mode=null) {
        var self = this;


        return new Promise(function(resolve, reject) {
            // ---------------------------------

            var prom = self.deleteItemInStore(mode)
            if(prom){
                prom.then(function(response) {
                    // RESPONSE IS ...
                    // ----------------------------------
                    // MODE SPECIFIC FUNCTIONALITY FOLLOWS 
                    // MAY CHOSE TO PLACE THIS FUNCTIONALITY THIS INTO MODE CLASS
                    mfModelAndItems.modeEmptyModels(mode)
                    mfModelAndItems.modeRemoveDeletedItems(mode)
                    // ----------------------------------
                    resolve(response);
                }, function(err) {
                    reject(err);
                });
            }else{
                reject();
            }



            // ---------------------------------
        });
    },




//================================================================================

    // LAYER 1 : DIRECT INTERFACE (INPUT MODE and OUTPUT DATA RESPONSE)
    //    Note : MODE, in this case, is a simple JS object 




    // V2 FUNCTION
    // RETURNS A TOKEN
    authenticateWithEmailPassword(mode=null){
        var self = this;
        if(mode) this.setMode(mode)
        mode = this.getMode();
        //------------------------

        if(!this.requireModePropertiesOrError(['urlbase','urlpath','port','apitype','auth'])){
            throw "ERROR : MISSING PROPERTIES";
        }

        //if(this.debug)  console.log("authenticateWithEmailPassword");
        var prom;
        if(mode.apitype === "phpcrud"){
            // temporarily forward request to OLD V1 FUNCTIONS
            return null
        }else if(mode.apitype === "labrador"){
            var urlpath = (mode.auth.hasOwnProperty('urlpath')) ? mode.auth.urlpath : mode.urlpath;
            return apiserviceLabrador.apiAuthenticateWithEmailAndPassword(mode.urlbase,urlpath,mode.port,mode.protocol,mode.auth)
        }else{

        }
    },


    // Returns the parameter string that would be used 
    // based on the variables inside the urlparameters variable
    getParametersString(mode=null){
        var qryStrItems = [];
        if(mode && mode.urlparameters){
            var keys = Object.keys(mode.urlparameters)
            for(var k=0; k<keys.length; k++){
                var key = keys[k];
                var value = mode.urlparameters[key];
                var qryStrItem = key+"="+value
                qryStrItems.push(qryStrItem);
            }
        }
        var final = ""
        if(qryStrItems.length>0) final = "?" + qryStrItems.join("&");
        return final;
    },


    // V2 FUNCTION
    // RETURNS AN ARRAY OF ITEMS
    readItemsFromStore(mode=null) {
        var self = this;
        if(mode) this.setMode(mode)
        mode = this.getMode();
        //------------------------

        if(!this.requireModePropertiesOrError(['urlbase','urlpath','port','apitype'])){
            throw "ERROR : MISSING PROPERTIES";
        }

        // STORE REFERENCES
        var schema = (mode.schemas && mode.schemas.length>0) ? mode.schemas[0] : null;

        var urlpath = mode.urlpath + this.getParametersString(mode);

        console.log("urlpath",urlpath)

        //if(this.debug)  console.log("readItems");
        var prom;
        if(mode.apitype === "phpcrud"){
            // temporarily forward request to OLD V1 FUNCTIONS
            return self.v1_getItems(mode);
        }else if(mode.apitype === "labrador"){
            return apiserviceLabrador.apiReadItems(mode.urlbase,urlpath,mode.port,mode.protocol,mode.auth)
        }else{

        }

    },

    // V2 FUNCTION
    // RETURNS AN ARRAY OF ITEMS
    readItemFromStore(mode=null) {
        var self = this;
        if(mode) this.setMode(mode)
        mode = this.getMode();
        //------------------------

        if(!this.requireModePropertiesOrError(['urlbase','urlpath','port','apitype','identity'])){
            throw "ERROR : MISSING PROPERTIES";
        }

        var schema = (mode.schemas && mode.schemas.length>0) ? mode.schemas[0] : null;
        var identity = (mode.identity) ? mode.identity : 0;

        //if(this.debug)  console.log("readItems");
        var prom;
        if(mode.apitype === "phpcrud"){
            // temporarily forward request to OLD V1 FUNCTIONS
            return self.v1_getItem(mode);
        }else if(mode.apitype === "labrador"){
            return apiserviceLabrador.apiReadItem(mode.urlbase,mode.urlpath,mode.port,mode.protocol,mode.auth,identity)
        }else{

        }

    },

    // V2 FUNCTION
    // RETURNS A MODEL
    createItemInStore(mode=null) {
        if(mode) this.setMode(mode)
        mode = this.getMode();
        //------------------------

        if(!this.requireModePropertiesOrError(['urlbase','urlpath','port','apitype','models'])){
            throw "ERROR : MISSING PROPERTIES";
        }

        if(!mode.models || mode.models.length==0) return null;
        var outgoingModel = mfModelAndItems.parseOutgoingModel(mode.models[0]);

        //if(this.debug) console.log("createItem");
        var prom;
        if(mode.apitype === "phpcrud"){
            // temporarily forward request to OLD V1 FUNCTIONS
            return self.v1_createItem(mode);
        }else if(mode.apitype === "labrador"){
            return apiserviceLabrador.apiCreateItem(mode.urlbase,mode.urlpath,mode.port,mode.protocol,mode.auth,outgoingModel)
        }else{

        }


    },

    // V2 FUNCTION
    // RETURNS A MODEL
    updateItemInStore(mode=null) {
        if(mode) this.setMode(mode)
        mode = this.getMode();
        //------------------------

        if(!this.requireModePropertiesOrError(['urlbase','urlpath','port','apitype','models'])){
            throw "ERROR : MISSING PROPERTIES";
        }

        if(!mode.models || mode.models.length==0) return null;
        var outgoingModel = mfModelAndItems.parseOutgoingModel(mode.models[0]);

        //if(this.debug) console.log("createItem");
        var prom;
        if(mode.apitype === "phpcrud"){
            // temporarily forward request to OLD V1 FUNCTIONS
            return self.v1_updateItem(mode);
        }else if(mode.apitype === "labrador"){
            return apiserviceLabrador.apiUpdateItem(mode.urlbase,mode.urlpath,mode.port,mode.protocol,mode.auth,outgoingModel)
        }else{

        }


    },

    // V2 FUNCTION
    // RETURNS EMPTY OR MESSAGE
    deleteItemInStore(mode=null) {
        if(mode) this.setMode(mode)
        mode = this.getMode();
        //------------------------

        if(!this.requireModePropertiesOrError(['urlbase','urlpath','port','apitype','models'])){
            throw "ERROR : MISSING PROPERTIES";
        }

        if(!mode.models || mode.models.length==0) return null;
        var outgoingModel = mfModelAndItems.parseOutgoingModel(mode.models[0]);

        //if(this.debug) console.log("createItem");
        var prom;
        if(mode.apitype === "phpcrud"){
            // temporarily forward request to OLD V1 FUNCTIONS
            return self.v1_deleteItem(mode);
        }else if(mode.apitype === "labrador"){
            return apiserviceLabrador.apiDeleteItem(mode.urlbase,mode.urlpath,mode.port,mode.protocol,mode.auth,outgoingModel)
        }else{

        }


    },

    // V2 FUNCTION
    // RETURNS AN ARRAY OF ITEMS
    searchItemInStore(mode=null) {
        if(mode) this.setMode(mode)
        mode = this.getMode();
        //------------------------

        if(!this.requireModePropertiesOrError(['urlbase','urlpath','port','apitype','remote_search'])){
            throw "ERROR : MISSING PROPERTIES";
        }

        var remote_search = mode.remote_search ? mode.remote_search : mode.search_phrase ;

        //if(this.debug) console.log("createItem");
        var prom;
        if(mode.apitype === "phpcrud"){
            // temporarily forward request to OLD V1 FUNCTIONS
            return self.v1_getItems(mode)
        }else if(mode.apitype === "labrador"){
            return apiserviceLabrador.apiSearchItem(mode.urlbase,mode.urlpath,mode.port,mode.protocol,mode.auth,remote_search)
        }else{

        }

    },


//================================================================================





//================================================================================

    /// OLD FUNCTIONS ... NEED MOVING UP TO NEW FUNCTIONS ABOVE (SIMPLER ... LOGIC SHOULD BE DELEGATED TO SPECIFIC CLASSES)



    v1_getItems(mode=null) {
        var self = this;
    	if(mode) this.setMode(mode)
    	mode = this.getMode();
    	//------------------------

    	if(!this.requireModePropertiesOrError(['urlbase','urlpath','port','apitype'])){
            throw "ERROR : MISSING PROPERTIES";
    	}

        // STORE REFERENCES
        var schema = (mode.schemas && mode.schemas.length>0) ? mode.schemas[0] : null;

        if(this.debug)  console.log("getItems");
        var prom;
        if(mode.apitype === "phpcrud"){

	        return new Promise(function(resolve, reject) {
                var remote_search = mode.remote_search ? mode.remote_search : mode.search_phrase ;
                var remote_context = mode.remote_context ? mode.remote_context : mode.filter_context ;


	        	var prom = apiservicePhpCrud.apiGetItems(mode.urlbase,mode.urlpath,mode.port,remote_context,remote_search)
                if(prom){
                    prom.then(function(response) {
                        // ADD ITEMS PROPERTY IF IT DOESNT EXIST
                        if(!mode.hasOwnProperty('items')){
                            mode['items'] = [];
                        }else{
                            mode.items.length = 0; // TO EMPTY THE ARRAY
                        }
                        // ----------------------------------
                        //we may receive an object here 
                        if(typeof response === 'object' && response !== null){
                            for (var prop in response) {
                                // WE ARE LOOKING FOR AN ARRAY
                                var propVal = response[prop];
                                if(Array.isArray(propVal)){

                                    // ------------------------------------------------------
                                    // IF WE HAVE A SCHEMA WE MAY PARSE THE INCOMING MODEL 
                                    if(schema){
                                        for(var i=0;i<propVal.length;i++){
                                            var newItem = mfModelAndItems.parseIncomingModel(schema,propVal[i]);
                                            mode.items.push(newItem);  
                                        }
                                    }else{
                                        // expand the items in prop and add them to mode items
                                        mode.items.push(...propVal);  
                                    }
                                    
                                }
                            }
                        }
                        // ----------------------------------
                        resolve();
                    }, function(err) {
                        reject();
                    });

                }

	        });


        }else{
            //prom = apiserviceCyolo.apiGet(baseurl,context,search);
        }


    },

    v1_getItem(mode=null) {
        var self = this;
    	if(mode) this.setMode(mode)
    	mode = this.getMode();
    	//------------------------

    	if(!this.requireModePropertiesOrError(['urlbase','urlpath','port','apitype','identity'])){
    		throw "ERROR : MISSING PROPERTIES";
    	}

        if(this.debug)  console.log("getItem");
        var prom;
        if(mode.apitype === "phpcrud"){

            return new Promise(function(resolve, reject) {
                apiservicePhpCrud.apiGetItem(mode.urlbase,mode.urlpath,mode.port,mode.identity)
                .then(function(response) {
                    var recItem = response;

                    mfModelAndItems.parseIncomingModel(recItem);

                    // ADD ITEMS PROPERTY IF IT DOESNT EXIST
                    if(!mode.hasOwnProperty('models')){
                        mode['models'] = [];
                    }else{
                        mode.models.length = 0; // TO EMPTY THE ARRAY
                    }
                    mode.models.push(recItem);
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


    v1_updateItem(mode=null) {
    	if(mode) this.setMode(mode)
    	mode = this.getMode();
    	//------------------------

    	if(!this.requireModePropertiesOrError(['urlbase','urlpath','port','apitype','models'])){
    		throw "ERROR : MISSING PROPERTIES";
    	}

        if(!mode.models || mode.models.length==0) return null;
        var modelToStore = mode.models[0]
        var outgoingModel = mf.parseOutgoingModel(modelToStore);

        if(this.debug) console.log("updateItem");
        var prom;
        if(mode.apitype === "phpcrud"){


            prom = new Promise(function(resolve, reject) {

                var promToUpdate = apiservicePhpCrud.apiUpdateItem(mode.urlbase,mode.urlpath,mode.port,outgoingModel);
                if(promToUpdate){
                    //--------
                    // START EXECUTING THE PROMISE
                    promToUpdate.then(function() {
                        modelToStore._dirty = false;
                        resolve();
                    }, function(err) {
                        console.log("ERROR MSG : ",err.message);
                        reject();
                    });
                    //--------
                }else{
                    // NO PROMISE WAS RETURNED - PERHAPS 
                    console.log("ERROR - NOTHING TO DO");
                    resolve();
                }

            });


        }else{
            //prom = apiserviceCyolo.apiGet(baseurl,context,search);
        }

        return prom;
    },
    v1_updateItems(mode=null) {
        if(mode) this.setMode(mode)
        mode = this.getMode();
        //------------------------

        if(!this.requireModePropertiesOrError(['urlbase','urlpath','port','apitype','models'])){
            throw "ERROR : MISSING PROPERTIES";
        }

        if(!mode.models_bulk || mode.models_bulk.length==0) return null;
        

        // IMMEDIATELY CREATE FIXED REFERENCES ...
        // MODE IS LIABLE TO CHANGE ...
        var modelsToStore = [...mode.models_bulk];
        //------------------------------------------
        // parse the models (note : these are clones)
        var modelsOutgoing = []
        for(var i=0;i<modelsToStore.length;i++){
            var outgoingModel = mfModelAndItems.parseOutgoingModel(modelsToStore[i]);
            modelsOutgoing.push(outgoingModel);
        }

        if(this.debug) console.log("updateItems:",modelsToStore.length);
        var prom;
        if(mode.apitype === "phpcrud"){

            prom = new Promise(function(resolve, reject) {

                var promToUpdate = apiservicePhpCrud.apiUpdateItems(mode.urlbase,mode.urlpath,mode.port,modelsOutgoing);
                if(promToUpdate){
                    //--------
                    // START EXECUTING THE PROMISE
                    promToUpdate.then(function() {
                        // loop the original models (refs to originals) 
                        // and mark them as stored
                        for(var mIndex=0; mIndex<modelsToStore.length; mIndex++){
                            var model = modelsToStore[mIndex];
                            model._dirty = false;
                            console.log("finished:",model)
                        }
                        resolve();
                    }, function(err) {
                        console.log("ERROR MSG : ",err.message);
                        reject();
                    });
                    //--------
                }else{
                    // NO PROMISE WAS RETURNED - PERHAPS 
                    console.log("ERROR - NOTHING TO DO");
                    resolve();
                }

            });

        }else{
            //prom = apiserviceCyolo.apiGet(baseurl,context,search);
        }

        return prom;
    },




    v1_createItem(mode=null) {
    	if(mode) this.setMode(mode)
    	mode = this.getMode();
    	//------------------------

    	if(!this.requireModePropertiesOrError(['urlbase','urlpath','port','apitype','models'])){
    		throw "ERROR : MISSING PROPERTIES";
    	}

        if(!mode.models || mode.models.length==0) return null;
        var outgoingModel = mfModelAndItems.parseOutgoingModel(mode.models[0]);

        if(this.debug) console.log("createItem");
        var prom;
        if(mode.apitype === "phpcrud"){
            prom = apiservicePhpCrud.apiCreateItem(mode.urlbase,mode.urlpath,mode.port,outgoingModel);
        }else{
            //prom = apiserviceCyolo.apiGet(baseurl,context,search);
        }

        return prom;
    },


    v1_deleteItem(mode=null) {
    	if(mode) this.setMode(mode)
    	mode = this.getMode();
    	//------------------------

    	if(!this.requireModePropertiesOrError(['urlbase','urlpath','port','apitype','identity'])){
    		throw "ERROR : MISSING PROPERTIES";
    	}

        if(this.debug) console.log("deleteItem");
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
	},




}