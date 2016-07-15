var Listeners = require("./Listeners");

var routes = {
    //The index action
    'index': function (req, res) {
        //Load all the stream collections
        Listeners.getStreams(function(items) {
            items.unshift({'name':'All'});

            var range = null;
            if(typeof req.query.range != 'undefined')
            {
                //Multiple the range of days times the hours in a daytime
                range = parseInt(req.query.range) * 24;
            }

            Listeners.getAllCollectionsStats(range, function(stats){
                res.render('index',
                    {
                        title : 'Home',
                        'streams' : items,
                        'stats' : stats //JSON.stringify(stats)
                    }
                )
            });
        });
    },
    //The stream action
    'stream': function(req, res){

        //Load the specific stream
        var dstream = {'name' : req.params[0]};

        var range = null;
        if(typeof req.query.range != 'undefined')
        {
            //Multiple the range of days times the hours in a daytime
            range = parseInt(req.query.range) * 24;
        }

        Listeners.getStreams(function(items) {
            items.unshift({'name':'All'});

            Listeners.getStreamStats(dstream, range, function(stats){

                res.render('stream',
                    {
                        title : 'Stats for ' + dstream.name,
                        'dstream' : dstream,
                        'streams' : items,
                        'stats' : stats
                    }
                )
            });
        });
    }
}

module.exports = routes;
