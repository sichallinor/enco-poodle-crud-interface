'use strict';

var apiservicePhpCrud = require('./services/ApiService_PhpCrud');

module.exports = {

    helloWorld() {
    	console.log("hello world - module is up and running");
    },



    getItems(mode) {
        var baseurl;
   		var path;
        var port;
        var apitype;
        var search_phrase;
        var context;
        if(!mode.hasOwnProperty('urlbase') || !mode.hasOwnProperty('urlpath') || !mode.hasOwnProperty('apitype')){
            return null;
        }else{
	        baseurl = mode.urlbase;
	        path = mode.urlpath;	        
	        port = mode.port;
	        apitype = mode.apitype;
	        search_phrase = mode.search_phrase;
        	context = mode.context;
        }

        //-------------------------

        console.log("getItems");
        var prom;
        if(apitype === "phpcrud"){
            prom = apiservicePhpCrud.apiGetItems(baseurl,path,port,context,search_phrase);
        }else{
            //prom = apiserviceCyolo.apiGet(baseurl,context,search);
        }

        return prom;

    },

    getItem(mode) {
        var baseurl;
    	var path;
        var port;
        var apitype;
        var identifier;
        if(!mode.hasOwnProperty('urlbase') || !mode.hasOwnProperty('urlpath') || !mode.hasOwnProperty('apitype')){
            return null;
        }else{
	        baseurl = mode.urlbase;
	        path = mode.urlpath;
	        port = mode.port;
	        apitype = mode.apitype;
	        identifier = mode.identifier;
        }


        console.log("getItem");
        var prom;
        if(apitype === "phpcrud"){
            prom = apiservicePhpCrud.apiGetItem(baseurl,path,port,identifier);
        }else{
            //prom = apiserviceCyolo.apiGet(baseurl,context,search);
        }

        return prom;


    },

    updateItem(mode,model) {
        var baseurl;
    	var path;
        var port;
        var apitype;
        var identifier;
        if(!mode.hasOwnProperty('urlbase') || !mode.hasOwnProperty('urlpath') || !mode.hasOwnProperty('apitype')){
            return null;
        }else{
	        baseurl = mode.urlbase;
	        path = mode.urlpath;
	        port = mode.port;
	        apitype = mode.apitype;
	        identifier = mode.identifier;
        }

        console.log("updateItem");
        var prom;
        if(apitype === "phpcrud"){
            prom = apiservicePhpCrud.apiUpdateItem(baseurl,path,port,model);
        }else{
            //prom = apiserviceCyolo.apiGet(baseurl,context,search);
        }

        return prom;

    },


    createItem(mode,model) {
        var baseurl;
    	var path;
        var port;
        var apitype;
        if(!mode.hasOwnProperty('urlbase') || !mode.hasOwnProperty('urlpath') || !mode.hasOwnProperty('apitype')){
            return null;
        }else{
	        baseurl = mode.urlbase;
	        path = mode.urlpath;
	        port = mode.port;
	        apitype = mode.apitype;
        }

        console.log("createItem");
        var prom;
        if(apitype === "phpcrud"){
            prom = apiservicePhpCrud.apiCreateItem(baseurl,path,port,model);
        }else{
            //prom = apiserviceCyolo.apiGet(baseurl,context,search);
        }

        return prom;

    },


    deleteItem(mode) {
        var baseurl;
    	var path;
        var port;
        var apitype;
        var identifier;
        if(!mode.hasOwnProperty('urlbase') || !mode.hasOwnProperty('urlpath') || !mode.hasOwnProperty('apitype')){
            return null;
        }else{
	        baseurl = mode.urlbase;
	        path = mode.urlpath;
	        port = mode.port;
	        apitype = mode.apitype;
	        identifier = mode.identifier;
        }


        console.log("getItem");
        var prom;
        if(apitype === "phpcrud"){
            prom = apiservicePhpCrud.apiDeleteItem(baseurl,path,port,identifier);
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