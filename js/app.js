$(document).ready(function() {
$("button").hide();

// Global variables
var resource = ["channel", "video"];
var nextPage = "";
var searchTerm = "";
/*
playlists are slightly different...
    requires to retrieve playlistId from search
    then request https://www.googleapis.com/youtube/v3/playlistItems
    to then retrieve at least 1 videoId to satisfy url requirement:
    https://www.youtube.com/watch?v=<videoId>&list=<playlistId>
*/ 

// when user submits query
$(function(){
    $('#search-term').submit(function(event){
        event.preventDefault();
        $("#search-results").empty();
        searchTerm = $('#query').val();
        for (var i = 0; i < 2; i++) {
            getRequest(searchTerm, i, nextPage);
        }
    });
});

// functions
function getRequest(searchTerm, typeIndex, next){
    var params = {
        part: 'snippet',
        key: 'AIzaSyDcmzVTMCn9L2AIgwdFVhYmRbFjYV80pbY', // my API key
        // find a way to make this hidden and referenced from an environment variable
        // securing api keys with environment variable
        q: searchTerm,
        type: resource[typeIndex],
        maxResults: 4,
        pageToken: next
    };
    url = 'https://www.googleapis.com/youtube/v3/search';
    $.getJSON(url, params, function(data) {
        nextPage = data.nextPageToken;
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
    var header = '<h3 class=' + resource[typeIndex] + '>' + resource[typeIndex].toUpperCase() + ' RESULTS</h3>';
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
            if (descr.length > 75) {
                descr = descr.substring(0, 75) + "...";
            }
            /*img = "<a target=\'_blank\' class=\'" + resource[typeIndex] + "\' href=\'" + link + "\'><figure><img id=\'thumbnail" + i + "\' src=\'" + results[i].snippet.thumbnails.medium.url + "\' title=\'" + descr + "\' width=\'120\' height=\'90\'><figcaption>" + descr + "</figcaption></figure></a>";
*/
            img = "<figure><a target=\'_blank\' class=\'" + resource[typeIndex] + "\' href=\'" + link + "\'><img id=\'thumbnail" + i + "\' src=\'" + results[i].snippet.thumbnails.medium.url + "\' title=\'" + descr + "\' width=\'120\' height=\'90\'><figcaption>" + descr + "</figcaption></a></figure>";
            console.log(img);
            html += img;
        }
    }
    $('#search-results').append("<div id=\'" + resource[typeIndex] + "-section\'>" + header + html + "</div>");

    // reveal show more results button
    $("button").show();
}

// show more results on click
$("button").click(function() {
    for (var i = 0; i < 2; i++) {
        $("#search-results").empty();
        getRequest(searchTerm, i, nextPage);
    }
});
//EOF
});