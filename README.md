# enco-poodle-crud-interface
A CRUD API Consuming Interface

POODLE CRUD INTERFACE
=========

Part of the ENCO project 

Poodle is a standard interface library to consume the results from CRUD APIs

## Installation

  `npm install enco-poodle-crud-interface`

## Usage

### Example 1

    var poodle = require('enco-poodle-crud-interface');

    var mode = { 
                    urlbase : "yourdomain.com",
                    urlpath : "/apipath/api.php/",
                    apitype : "phpcrud",
                    search_phrase : "test",
                    context : null
                };

	await poodle.getItems(mode);
	
	mode will now contain an 'items' property  
  

### Example 2

    var poodle = require('enco-poodle-crud-interface');

    var mode = { 
                    urlbase : "yourdomain.com",
                    urlpath : "/apipath/api.php/",
                    apitype : "phpcrud",
                    search_phrase : "test",
                    context : null
                };

    poodle.getItems(mode).then(function(response) {
        console.log("MODE:",mode);
    }, function(err) {
    });



## Tests

  `npm test`

## Contributing

In lieu of a formal style guide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code.