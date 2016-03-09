$(document).ready(function() {

var resource = ["channel", "video"]; // playlists are slightly different

// when user submits query
$(function(){
    $('#search-term').submit(function(event){
        event.preventDefault();
        $("#search-results").empty();
        var searchTerm = $('#query').val();
        for (var i = 0; i < 2; i++) {
            getRequest(searchTerm, i);
        }
    });
});

// functions
function getRequest(searchTerm, typeIndex){
    var params = {
        part: 'snippet',
        key: 'AIzaSyDcmzVTMCn9L2AIgwdFVhYmRbFjYV80pbY', // my API key
        // find a way to make this hidden and referenced from an environment variable
        // securing api keys with environment variable
        q: searchTerm,
        type: resource[typeIndex],
        maxResults: 5
    };
    url = 'https://www.googleapis.com/youtube/v3/search';
    $.getJSON(url, params, function(data) {
        console.log(data);
        showResults(data.items, typeIndex);
    });
}

function showResults(results, typeIndex){
    var html = "";
    var img = "";
    var descr = "";
    var link = "";
    // Create header for section
    $('#search-results').append('<h3 class=' + resource[typeIndex] + '>' + resource[typeIndex].toUpperCase() + ' RESULTS</h3>');
    console.log("These are your results for: " + resource[typeIndex]);

    // Iterate and piece together html entry for each video item
    for (var i = 0; i < results.length; i++) {
        descr = results[i].snippet.title;

        if ((results[i].id.kind == "youtube#channel") && (results[i].id.channelId.length > 1))  {
            link = "https://www.youtube.com/channel/" + results[i].id.channelId;
        }
        else if ((results[i].id.kind == "youtube#video") && (results[i].id.videoId.length > 1)) {
            link = "https://www.youtube.com/watch?v=" + results[i].id.videoId;
        }
        else {
            results.splice(i, 1); // remove item if there is no ID
            link = "bad";
        }

        if (link != "bad") {
            img = "<a target=\'_blank\' class = " + resource[typeIndex] + " href=" + link + "><img id=\'thumbnail" + i + "\' src=" + results[i].snippet.thumbnails.default.url + " width=\'120\' height=\'90\'></a>";
            html += '<p>' + img + descr + '</p>';
        }
    }
    $('#search-results').append(html);
}

// play with also next-page-token
//EOF
});