/* Once this document is loaded we can get the global data defined from the jade
and use it to initialize the google chart. */

$(document).ready(function(){
    prepareDataForGChart(data, initializeChart);
});

//This is the function that initializes the chart
function initializeChart(gdata){
      google.charts.load('current', {'packages':['corechart']});
      google.charts.setOnLoadCallback(drawChart);
      function drawChart() {
            var data = new google.visualization.DataTable();

            //The first column is the delimiter which is time in our case
            //The next elements are the different lines we're going to have
            //in our case these are the different streams
            //headers format
            //['Time', 'city_ogg', 'radio1_aac', 'radio1rock128'],

            //rows format
            //[new Date("May 15, 2016 15:13:00"),  1000,      400,  550],
            //[new Date("May 16, 2016 16:13:00"),  1170,      460,  659],

            var index = 0;
            gdata.forEach( function (item)
            {
                if(index == 0)
                {
                    item.forEach(function(jitem)
                    {
                        //console.log(jitem);
                        if(jitem == 'Time'){
                            data.addColumn('datetime', jitem);
                        }
                        else {
                            data.addColumn('number', jitem);
                        }
                    });
                }
                else {
                    data.addRow(item);
                }
                index++;
            });

            var options = {
              title: 'Listeners',
              hAxis: {title: 'Date and time', format:'k:mm, MMM d',  titleTextStyle: {color: '#333'}},
              vAxis: {title: 'Listeners'}
            };

            var chart = new google.visualization.AreaChart(document.getElementById('chart_div'));
            chart.draw(data, options);
    }
}

function mongoid2datetime(mongoid){
    return new Date(parseInt(mongoid.substring(0, 8), 16) * 1000);
}

function prepareDataForGChart(data, callback)
{
    var headers = ['Time'];
    var gdata = [];
    var first = true;

    //First go through the object to get the streams and the times
    for (var key in data) {
        // skip loop if the property is from prototype
        if (!data.hasOwnProperty(key)) continue;

        var obj = data[key];
        headers.push(obj['stream']);

        var i = 0;
        var j = 0;
        //Check for missing data compared to the first data record
        //This is done because we cannot pass different number of columns to the
        //gchart so we need to have 0s if there's a missing value
        /*
        if(obj['data'].length < data[0]['data'].length)
        {
            obj['data'].forEach( function (item)
            {
                var adate = mongoid2datetime(item._id);
                //if()
                console.log(gdata[j][0]);
                //gdata[i].push(item.listeners);
                j++;
            });
            console.log(gdata);
            i++;
        }
        else {
        */
            obj['data'].forEach( function (item)
            {
                if(first)
                {
                    var adate = mongoid2datetime(item._id);
                    gdata.push([adate, parseInt(item.listeners)]);
                }
                else
                {
                    gdata[i].push(item.listeners);
                }
                i++;
            });
        //}

        first = false;
    }

    //Init callback
    gdata.unshift(headers);
    //console.log('bla');
    callback(gdata);
}
