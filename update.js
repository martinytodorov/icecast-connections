//Load the main config file
var config = require('./config');

//Load the csv library
var csv = require('csv');

//Load the Listeners module so we can save the objects when ready
var Listeners = require('./app/Listeners');

// Monkey patch before you require http for the first time.
process.binding('http_parser').HTTPParser = require('http-parser-js').HTTPParser;
var request = require('request');

var csvFile;

request.get(config.icecast_csv_url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        var csvFile = body;
        // Continue with your processing here.
        csv.parse(csvFile,{delimiter: ','},
            function(err, output){
                var arr = output;

                //Foreach of the streams save the current listeners count
                arr.map(function(item, index)
                {
                    if(index > 2)
                    {
                        var obj = {
                            'stream' : item[0].substr(1, item[0].length-1).replace(".", "_"),
                            'connections' : parseInt(item[1]),
                            'listeners' : parseInt(item[3])
                        }

                        Listeners.addStats(obj);

                        var obj = {};
                        /*
                        console.log(item[0].substr(1, item[0].length-1).replace(".", "_")); //stream
                        console.log(item[1]); //connections (all kinds -> files, audio, meta)
                        console.log(item[2]); //stream name
                        console.log(item[3]); //current listeners
                        console.log(item[4]); //description
                        console.log(item[5]); //currently playing
                        console.log(item[6]); //stream url
                        */
                    }
                });
            }
        );
    }
    else {
        console.log(error);
    }
});
