$(document).ready(function() {

var resource = ["channel", "playlist", "video"];

// when user submits query
$(function(){
    $('#search-term').submit(function(event){
        event.preventDefault();
        $("#search-results").empty();
        var searchTerm = $('#query').val();
        for (var i = 0; i < 3; i++) {
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
    $('#search-results').append('<h3>' + resource[typeIndex].toUpperCase() + ' RESULTS</h3>');
    console.log("These are your results for: " + resource[typeIndex]);
    for (var i = 0; i < results.length; i++) {
        descr = results[i].snippet.title;
        link = "https://www.youtube.com"; // if no channeId, go to playlistId, or videoId, final default to youTube homepage
        img = "<a target=\'_blank\' class = " + resource[typeIndex] + " href=" + link + "><img id=\'thumbnail" + i + "\' src=" + results[i].snippet.thumbnails.default.url + " width=\'120\' height=\'90\'></a>";
        html += '<p>' + img + descr + '</p>';
    }    
    $('#search-results').append(html);
}

// run a filter on the items that come back to only display results with videoID
// play with also next-page-token
//EOF
});