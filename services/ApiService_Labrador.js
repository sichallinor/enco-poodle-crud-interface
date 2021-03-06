const https = require('https');
const http = require('http');

var apiserviceHttp = require('./ApiService_Http');

module.exports = {

    // NOTE : KEEP IT SIMPLE
    // NOTE : PURPOSE OF THIS LAYER IS 
    //        1) TO RECEIVE APPROPRIATE VARIABLES (RELEVANT TO LABRADOR)
    //        2) CONVERT INTO A SIMPLE HTTP REQUEST (RELEVANT TO LABRADOR)
    //        3) RETURN APPROPRIATE DATA (RELEVANT TO LABRADOR)

    

    apiAuthenticateWithEmailAndPassword(baseurl,path,port,protocol,auth) {
        console.log('apiAuthenticateWithEmailAndPassword')
        return new Promise(function(resolve, reject) {
            var data = JSON.stringify(auth);
            var prom = apiserviceHttp.apiActionJson(baseurl,path,port,'POST',data,protocol);
            if(prom) prom.then(function(response) {
                //console.log(response)
                if(response && response.data && response.data.token) {
                  // RETURNS A PROFILE (THAT INCLUDES A TOKEN PLUS USER DATA)
                  resolve(response);
                }else if(response && response.message){
                  // REJECT AND RETURN A MESSAGE
                  reject(response.message)
                }else{
                  // REJECT
                  reject("UNSPECIFIED ERROR")
                }
            }, function(err) {
                console.log(err)
                reject();
            }); 
        });

    },


    apiLoginCheck(baseurl,path,port,protocol,auth) {
        console.log('apiLoginCheck')
        var self = this;
        return new Promise(function(resolve, reject) {
            var authHeaders = self.getAuthHeaders(auth.token)
            var prom = apiserviceHttp.apiActionJson(baseurl,path,port,'GET',null,protocol,authHeaders);
            if(prom) prom.then(function(response) {
                //console.log(response)
                if(response && response.data && response.data.token) {
                  // RETURNS A PROFILE (THAT INCLUDES A TOKEN PLUS USER DATA)
                  resolve(response);
                }else if(response && response.message){
                  // REJECT AND RETURN A MESSAGE
                  reject(response.message)
                }else{
                  // REJECT
                  reject("UNSPECIFIED ERROR")
                }
            }, function(err) {
                console.log(err)
                reject();
            }); 
        });

    },


    apiRegisterWithEmailAndPassword(baseurl,path,port,protocol,registration_data){
        console.log('apiRegisterWithEmailAndPassword')
        var self = this;
        return new Promise(function(resolve, reject) {
            var data = JSON.stringify(registration_data);
            var prom = apiserviceHttp.apiActionJson(baseurl,path,port,'POST',data,protocol);
            if(prom) prom.then(function(response) {
                //console.log(response)
                if(response && response.data && response.data.token) {
                  // 
                  resolve(response);
                }else if(response && response.message){
                  // REJECT AND RETURN A MESSAGE
                  reject(response.message)
                }else{
                  // REJECT
                  reject("UNSPECIFIED ERROR")
                }
            }, function(err) {
                console.log(err)
                reject();
            }); 
        });
    },


    getAuthHeaders(token){
        var authBearer = "Bearer " + token;
        var extraHeaders = {'Accept': 'application/json', 'Authorization': authBearer};
        //console.log("extraHeaders : ",extraHeaders)
        return extraHeaders
    },

    apiReadItems(baseurl,path,port,protocol,auth,parameters) {
        var self = this;
        return new Promise(function(resolve, reject) {
            var authHeaders = self.getAuthHeaders(auth.token)
            var fullPath = path + parameters;

            var prom = apiserviceHttp.apiActionJson(baseurl,fullPath,port,'GET',null,protocol,authHeaders);
            if(prom) prom.then(function(response) {
                //console.log(response)
                if(response && response.success) {
                  // RESOLVE AND RETURN THE ITEMS
                  console.log("HAVE SUCCESS")
                  resolve(response);
                }else if(response && response.message){
                  // REJECT AND RETURN A MESSAGE
                  reject(response.message)
                }else{
                  // REJECT
                  reject("UNSPECIFIED ERROR")
                }
            }, function(err) {
                console.log(err)
                reject();
            }); 
        });

    },


    apiReadItem(baseurl,path,port,protocol,auth,parameters,identifier) {
        var self = this;
        return new Promise(function(resolve, reject) {
            var authHeaders = self.getAuthHeaders(auth.token)

            var fullPath = path + "/" + identifier + parameters;

            var prom = apiserviceHttp.apiActionJson(baseurl,fullPath,port,'GET',null,protocol,authHeaders);
            if(prom) prom.then(function(response) {
                //console.log(response)
                if(response) {
                  // RESOLVE AND RETURN THE ITEMS
                  resolve(response);
                }else if(response && response.message){
                  // REJECT AND RETURN A MESSAGE
                  reject(response.message)
                }else{
                  // REJECT
                  reject("UNSPECIFIED ERROR")
                }
            }, function(err) {
                console.log(err)
                reject();
            }); 
        });

    },


    apiCreateItem(baseurl,path,port,protocol,auth,model) {
        var self = this;
        return new Promise(function(resolve, reject) {
            var authHeaders = self.getAuthHeaders(auth.token)
            var data = JSON.stringify(model);
            var prom = apiserviceHttp.apiActionJson(baseurl,path,port,'POST',data,protocol,authHeaders);
            if(prom) prom.then(function(response) {
                //console.log(response)
                if(response && response.data) {
                  // RESOLVE AND RETURN THE ITEM
                  resolve(response.data);
                }else if(response && response.message){
                  // REJECT AND RETURN A MESSAGE
                  reject(response.message)
                }else{
                  // REJECT
                  reject("UNSPECIFIED ERROR")
                }
            }, function(err) {
                console.log(err)
                reject();
            }); 
        });

    },


    apiUpdateItem(baseurl,path,port,protocol,auth,model) {
        var self = this;
        return new Promise(function(resolve, reject) {

            var authHeaders = self.getAuthHeaders(auth.token)
            var data = JSON.stringify(model);
            if(!model.hasOwnProperty('id')){
              reject("NO IDENTIFIER");
            } 
            var id = model.id
            var fullPath = path + "/" + id;

            var prom = apiserviceHttp.apiActionJson(baseurl,fullPath,port,'PUT',data,protocol,authHeaders);
            if(prom) prom.then(function(response) {
                //console.log(response)
                if(response && response.data) {
                  // RESOLVE AND RETURN THE TOKEN
                  resolve(response.data);
                }else if(response && response.message){
                  // REJECT AND RETURN A ITEM
                  reject(response.message)
                }else{
                  // REJECT
                  reject("UNSPECIFIED ERROR")
                }
            }, function(err) {
                console.log(err)
                reject();
            }); 
        });

    },

    apiUpdateItems(baseurl,path,port,protocol,auth,items) {
        var self = this;
        return new Promise(function(resolve, reject) {

            var authHeaders = self.getAuthHeaders(auth.token)

            var data = JSON.stringify({'bulk_items':items});

            var fullPath = path + "/bulk";

            var prom = apiserviceHttp.apiActionJson(baseurl,fullPath,port,'PUT',data,protocol,authHeaders);
            if(prom) prom.then(function(response) {
                //console.log(response)
                if(response && response.data) {
                  // RESOLVE AND RETURN THE TOKEN
                  resolve(response.data);
                }else if(response && response.message){
                  // REJECT AND RETURN A ITEM
                  reject(response.message)
                }else{
                  // REJECT
                  reject("UNSPECIFIED ERROR")
                }
            }, function(err) {
                console.log(err)
                reject();
            }); 
        });

    },

    apiDeleteItem(baseurl,path,port,protocol,auth,model) {
        var self = this;
        return new Promise(function(resolve, reject) {

            var authHeaders = self.getAuthHeaders(auth.token)
            var data = JSON.stringify(model);
            if(!model.hasOwnProperty('id')){
              reject("NO IDENTIFIER");
            } 
            var id = model.id
            var fullPath = path + "/" + id;

            var prom = apiserviceHttp.apiActionJson(baseurl,fullPath,port,'DELETE',data,protocol,authHeaders);
            if(prom) prom.then(function(response) {
                console.log(response)
                if(response && response.data) {
                  // RESOLVE AND RETURN THE RESPONSE
                  resolve(response.data);
                }else if(response && response.message){
                  // REJECT AND RETURN A MESSAGE
                  reject(response.message)
                }else{
                  // REJECT
                  reject("UNSPECIFIED ERROR")
                }
            }, function(err) {
                console.log(err)
                reject();
            }); 
        });

    },



    apiSearchItem(baseurl,path,port,protocol,auth,parameters,search,search_remote_criteria,search_remote_fields,search_remote_order) {
      console.log("apiSearchItem")
        var self = this;
        return new Promise(function(resolve, reject) {
            var authHeaders = self.getAuthHeaders(auth.token)

            var dataObj = {}
            if(search) dataObj['search'] = search
            if(search_remote_fields) dataObj['search_fields'] = search_remote_fields
            if(search_remote_criteria) dataObj['criteria'] = search_remote_criteria  
            if(search_remote_order) dataObj['order'] = search_remote_order 
            var data = JSON.stringify( dataObj);

            //var fullPath = path + "/search" + parameters;
            var fullPath = path + parameters;

            var prom = apiserviceHttp.apiActionJson(baseurl,fullPath,port,'POST',data,protocol,authHeaders);
            if(prom) prom.then(function(response) {
                //console.log(response)
                if(response && response.success) {
                  // RESOLVE AND RETURN THE ITEM
                  resolve(response);
                }else if(response && response.message){
                  // REJECT AND RETURN A MESSAGE
                  reject(response.message)
                }else{
                  // REJECT
                  reject("UNSPECIFIED ERROR")
                }
            }, function(err) {
                console.log(err)
                reject();
            }); 
        });

    },



}