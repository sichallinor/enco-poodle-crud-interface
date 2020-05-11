const https = require('https');
const http = require('http');

module.exports = {


    apiActionJson(baseurl,path,port,method,data,protocol='http',extraHeaders=null) {

      var self = this;
        return new Promise(function(resolve, reject) {

            console.log("HTTP " + method + " : URL : ",baseurl + path);

            var headers = {'Content-Type': 'application/json'};
            if(data){
                headers['Content-Length'] = data.length;
            }
            if(extraHeaders){
              Object.assign(headers, extraHeaders);
            }

            const options = {
              hostname: baseurl,
              port: port,
              path: path,
              method: method,
              headers: headers
            }

            var httpORhttps = http
            if(protocol==="https") httpORhttps = https

            const req = httpORhttps.request(options, (resp) => {
              console.log(`statusCode: ${resp.statusCode}`)
              let response_data = '';

              if(resp.statusCode!==200){
                console.log("status:",resp.statusCode);
              }
              
              // A chunk of data has been recieved.
              resp.on('data', (chunk) => {
                response_data += chunk;
              });

              // The whole response has been received. Print out the result.
              resp.on('end', () => {
                var response = (response_data.length>0) ? JSON.parse(response_data) : {};
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

    }




}