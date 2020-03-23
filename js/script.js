
function random_rgba(sf) {
    sf = sf / 5.0;
    var o = Math.round, r = Math.random, s = 255;
    return 'rgba(' + o(r()*s+80) + ',' + o(r()*s+45) + ',' + o(r()*s+75) + ',' + sf + ')';
}

function build_dune_stacked(data) {
    var ctx = document.getElementById('dune_stacked_area').getContext('2d');
	var stackedLine = new Chart(ctx, {
    type: 'scatter',
    data: data,
    options: {
        title: "Dune Front",
        scales: {
            xAxes: [{
                type: 'linear',
                position: 'bottom', 
                ticks:{
                    stepSize: 50,
                }, 
                scaleLabel: {
                    labelString: "Easting",
                    display: true
                }
            }],
            yAxes: [{
                type: 'linear',
                ticks:{
                    stepSize: 50,
                }, 
                scaleLabel: {
                    labelString: "Northing",
                    display: true
                }
            }]
        },
        aspectRatio: 0.2,
    }
});
}

function build_shoreface_stacked(data) {
    var ctx = document.getElementById('shoreface_stacked_area').getContext('2d');
	var stackedLine = new Chart(ctx, {
    type: 'scatter',
    data: data,
    options: {
        scales: {
            xAxes: [{
                type: 'linear',
                position: 'bottom', 
                ticks:{

                    stepSize: 50
                }, 
                scaleLabel: {
                    labelString: "Easting",
                    display: true
                }
            }],
            yAxes: [{
                type: 'linear',
                ticks:{
                    stepSize: 50
                }, 
                scaleLabel: {
                    labelString: "Northing",
                    display: true
                }
            }]
        },
        aspectRatio: 0.2, //don't have H.E.
    },
});
}

function coerce_data(sentinel, title) {
    dataset_for_dunes = [];
    var c = 0;
    const keys = Object.keys(assoc_of_results);
    var temp_obj = {};
    var sf = 0;
    console.log(assoc_of_results)
    for (const key of keys) {
        var temp = assoc_of_results[key];
        if(key.includes(sentinel) && !key.includes("elevation")) {
            if(c % 2 == 0) {
                temp_obj = {};
                var year = key.slice(1,5);

                temp_obj["label"] = year+" "+title;
                temp_obj["backgroundColor"] = random_rgba(sf++);
                temp_obj["data"] = [];
                temp.forEach(easting => {
                    temp_obj["data"].push({"x":parseInt(easting), "y":null});
                });
                // temp_obj["data"]
            } else {
                var add_counter = 0;
                temp.forEach(northing => {
                    temp_obj["data"][add_counter].y = parseInt(northing);
                    add_counter++;
                });
                dataset_for_dunes.push(temp_obj);
            }
            c++;
        }
    }
    console.log(title);
    console.log(dataset_for_dunes);
    return dataset_for_dunes;
}

function draw_charts() {
    // keep both of these in global scope for easy debugging.
    dataset_for_dunes = [];
    dataset_for_shoreface = [];
    
    // console.log(dataset_for_dunes);
    // console.log("built dune data :>");
    build_dune_stacked({"datasets":coerce_data("dunefront", "Dunefront")});
    build_shoreface_stacked({"datasets":coerce_data("shoreface", "Shore Face")});
}

function load_data(t){
    $(t).text("Loading data...");
    $(t).addClass("pure-button-disabled");
    var url = "https://www.lehigh.edu/~inibsp/data/ipad_ibsp.csv";
    data = null;
    assoc_of_results = {};
    var result = Papa.parse(url, {
        download: true,
        header: true,
        worker: true,
        complete: function(results) {
            $(t).text("Data Loaded. Processing.");
            //make keys for our new array to flatten into
            var newkii = Object.keys(results.data[0]);

            newkii.forEach(element => {
                assoc_of_results[element] = [];
            });
            // console.log(assoc_of_results);
            results.data.forEach(element => {
                const keys = Object.keys(element)
                for (const key of keys) {
                    var temp = element[key];
                    if(temp === "NA") {
                        continue;
                    }
                    assoc_of_results[key].push(element[key]);
                }
            });
            $(t).removeClass("pure-button-disabled");
            $(t).text("Data Loaded. Click to reload.");
            $(".chart_me").show();
        },
    });
    

}

function upload_data(t) {
    $(t).text("Processing upload.")
    try {
        assoc_of_results = {};
        $('input[type=file]').parse({
            config: {
                worker: true,
                header: true,
                complete: function(results) {
                    //make keys for our new array to flatten into
                    var newkii = Object.keys(results.data[0]);
        
                    newkii.forEach(element => {
                        assoc_of_results[element] = [];
                    });
                    // console.log(assoc_of_results);
                    results.data.forEach(element => {
                        const keys = Object.keys(element)
                        for (const key of keys) {
                            var temp = element[key];
                            if(temp === "NA") {
                                continue;
                            }
                            assoc_of_results[key].push(element[key]);
                        }
                    });

                    console.log(assoc_of_results);
                }
            },
            before: function(file, inputElem)
            {
                console.log("beginning local file processing.")
            },
            error: function(err, file, inputElem, reason)
            {
                alert("Error: "+reason);
            },
            complete: function()
            {
                console.log("processing complete.");
                draw_charts(); //draw charts immediately
                $(t).text("complete.")
            }
        });
    } catch(err) {
        console.log(err);
        $(t).text("An error occurred. Select a new file and retry.");
        $(t).css("color", "red");
    }
}

$( document ).ready(function() {
    $(".chart_me").hide();
    // make_side_by_side();

});