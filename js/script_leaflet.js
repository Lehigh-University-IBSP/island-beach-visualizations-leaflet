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

function load_data(){
    var url = "https://www.lehigh.edu/~inibsp/data/ipad_ibsp.csv";
    data = null;
    assoc_of_results = {};
    var result = Papa.parse(url, {
        download: true,
        header: true,
        worker: true,
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
            
        },
    });
    

}

$( document ).ready(function() {
    load_data();
    // make_side_by_side();

});