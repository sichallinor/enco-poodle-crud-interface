const https = require('https');

module.exports = {



    apiGetItems(baseurl,path,port,context,search,pagenum=1,recordsperpage=20) {
        var urlpath;
        // currently only a context search OR a filter search
        if(context){
            urlpath = path + "?transform=1&filter=context,eq," + context + "&order=id&page=" + pagenum + ","+ recordsperpage ;
        }else if(search && search.length>1){
        	urlpath = path + "?transform=1&filter[]=tags,cs," + search + "&filter[]=title,cs," + search + "&satisfy=any&order=id&page=" + pagenum + ","+ recordsperpage ;
        }

        //return this.apiGetJson(url);
        return this.apiActionJson(baseurl,urlpath,port,'GET',null);

    },

    apiGetItem(baseurl,path,port,identity) {
        var urlpath = path + identity;
        return this.apiActionJson(baseurl,urlpath,port,'GET',null);
    },

    apiUpdateItem(baseurl,path,port,models) {
        if(!models || models.length==0) return null;

        var id = models[0]['id'];
        var urlpath = path + id;

        var data = JSON.stringify(models[0]);
        return this.apiActionJson(baseurl,urlpath,port,'PUT',data);
    },

    apiCreateItem(baseurl,path,port,models) {
        if(!models || models.length==0) return null;

        var data = JSON.stringify(models[0]);
        return this.apiActionJson(baseurl,path,port,'POST',data);
    },

    apiDeleteItem(baseurl,path,port,identity) {
        var urlpath = path + identity;
        return this.apiActionJson(baseurl,urlpath,port,'DELETE',null);
    },
    apiDeleteItemFromModel(baseurl,path,port,models) {
        if(!models || models.length==0) return null;

        var id = models[0]['id'];
        var urlpath = path + id;
        return this.apiActionJson(baseurl,urlpath,port,'DELETE',null);
    },

    //------------------------------------------

    apiActionJson(baseurl,path,port,method,data) {

        return new Promise(function(resolve, reject) {

            console.log("HTTP " + method + " : URL : ",baseurl + path);

            var headers = {'Content-Type': 'application/json'};
            if(data){
                headers['Content-Length'] = data.length;
            }

            const options = {
              hostname: baseurl,
              port: port,
              path: path,
              method: method,
              headers: headers
            }

            const req = https.request(options, (resp) => {
              console.log(`statusCode: ${resp.statusCode}`)
              let response_data = '';

              if(resp.statusCode!==200){
                reject();
              }

              // A chunk of data has been recieved.
              resp.on('data', (chunk) => {
                response_data += chunk;
              });

              // The whole response has been received. Print out the result.
              resp.on('end', () => {

                var response = JSON.parse(response_data);
                //console.log("response:",response);
                resolve(response);

              });

              req.on('error', (err) => {
                console.log("Error: " + err.message);
                reject();
              })





            })



            if(data) req.write(data)
            req.end()


        });

    },



}