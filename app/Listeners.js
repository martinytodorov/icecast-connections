//Load the main config file
var config = require('./../config');

//Load the mongo client in order to communicate with the db
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

var Listeners = {

    //Used by the cronjob to add the stats for each hour
    addStats : function(obj){
        // Use connect method to connect to the Server
        MongoClient.connect(config.mongodb_url + config.mongodb_dbname, function(err, db) {
            insertDocument(db, obj, printResult);
        });
    },

    //Returns the information for all the
    getCollectionStats : function(item, db, hours, callback)
    {
        if(typeof hours == 'undefined' || hours == null)
        {
            hours = 24;
        }
        //Select collection and find the last records for the range invoked
        db.collection(item.name).find().limit(hours).sort({'_id':-1}).toArray(function(err, documents) {
            callback(documents);
        });
    },

    getAllCollectionsStats : function(range, callback)
    {
        var self = this;
        var stats = [];

        //Open the mongo connection
        MongoClient.connect(config.mongodb_url + config.mongodb_dbname, function(err, db) {
            //Select the database
            var db = db.db(config.mongodb_dbname);
            // Return the information of a all collections, using the callback format
            db.listCollections().toArray(function(err, items) {
                //Foreach collection
                items.map(function(item, index){
                    //Get the documents for the current collection and push them to the member array
                    self.getCollectionStats(item, db, range, function(documents){
                        //Use this temp object to add the stream name to the object
                        var tmpObj = {
                            'stream':item.name,
                            'data' : documents
                        };
                        //Push the element in the data array
                        stats.push(tmpObj);
                        //Check for the last element
                        if(index === (items.length-1))
                        {
                            //If this is the last element than we run here and we invoke the callback
                            callback(stats);
                            db.close();
                        }
                    });
                });
            });
        });
    },

    getStreamStats : function(stream, range, callback)
    {
        var self = this;
        var stats = [];

        //Open the mongo connection
        MongoClient.connect(config.mongodb_url + config.mongodb_dbname, function(err, db) {
            //Select the database
            var db = db.db(config.mongodb_dbname);
            // Get the stats for the specific stream that the user has clicked
            self.getCollectionStats(stream, db, range, function(documents){
                //Use this temp object to add the stream name to the object
                var tmpObj = {
                    'stream':stream.name,
                    'data' : documents
                };
                //Push the element in the data array
                stats.push(tmpObj);
                //Passback the stats and close db connection
                callback(stats);
                db.close();
            });
        });
    },

    getStreams : function(callback)
    {
        //Open the mongo connection
        MongoClient.connect(config.mongodb_url + config.mongodb_dbname, function(err, db) {
            //Select the database
            var db = db.db(config.mongodb_dbname);

            // Return the information of a all collections, using the callback format
            db.listCollections().toArray(function(err, items) {
                callback(items);
                db.close();
            });
        });
    },

    dump : function(result)
    {
        console.log(result);
        process.exit();
    }

}

var printResult = function(result)
{
    //console.log(result);
	//return ;
	process.exit('Done');
}

var insertDocument = function(db, obj, callback) {
    // Get the documents collection
    var collection = db.collection(obj.stream);
    // Insert some documents
    collection.insert({'connections':obj.connections, 'listeners':obj.listeners}, function(err, result) {
        callback(result);
    });
}

module.exports = Listeners;
