/*
Note: This script uses Twitters Search API, and is therefore limited to the last 7 days.


To-do: 
- Fix the looks - Left/Right arrows. Offset on the first tweet, and so on.
- Searchbar. Fix dropdown/toggle for searches for either a users timeline or regular search.
- Add twitter logo
*/
var tweetModule = (function() {
	 list = [];
	 currentTweet = 0;
	 currentPage = 1;
	 searchString = "";
	 moreTweets = true;
	 width = 0;
	 height = 0;
	 timeline = false;
	
	
	var simpleTweet = function(outerContainer, newWidth, newHeight, newSearch, newSearchString, newTimeline) {
		searchString = newSearchString;
		
		timeline = newTimeline;
		
		
		if (isNaN(newWidth) == false) {
		  width = newWidth;
		} else {
		  console.log(width + " is not a valid argument for width. Set to an integer");
		  console.log("width set to 350");
		  width = 350;
		}

		if (isNaN(newHeight) == false) {
		 height = newHeight;
		} else {
		  console.log(height + " is not a valid argument for height. Set to an integer");
		  console.log("height set to 100");
		  this.height = 100;
		}
		
		if (newSearch.toString().toLowerCase() == "true" || newSearch.toString().toLowerCase()  == "false") {
		  search = newSearch;
		} else {
		  console.log(search + " is not a valid argument for search. Set to either true or false.");
		  console.log("search set to false");
		  search = false;
		}

		initContainer(outerContainer, width, height, search);	
		searchString = searchString.replace('@', '%40'); 
		searchString = searchString.replace('#', '%23');
		searchTwitter(searchString);
		initNavigation();
	}
	
	var initContainer = function(outer, width, height, search){
		
		
			if(search == true){
				$(outer).append('<input id="search" type="text">'+
					'<button id="searchbutton">Search</button>');
				$('#searchbutton').click(function(){
					list = [];
					currentTweet = 0;
					currentPage = 1;
					searchString = document.getElementById("search").value;
					searchString = searchString.replace('@', '%40'); 
					searchString = searchString.replace('#', '%23'); 
					searchTwitter(searchString);
				});
			}
			
			$(outer).append(	
				'<div id="simpletweet">'+
				'<div id="left"><img src="left.png"/></div>'+
				'<div id="tweettext"></div>'+
				'<div id="right"><img src="right.png"/></div>'+
				'</div>');
				
			$("#simpletweet").css("width", width);
			$("#simpletweet").css("height", height);
			$("#left, #right, #tweettext").css("height", height);
			$("#tweettext").css("width", width-50);
			
			
	}
	
	var tweetHeight = function(width, height){
	
		$(".tweet").css("width", width-120);
		$(".tweet").css("height", height-10);
		$("#tweettext img").css("top", (height-48)/2);
	}

	

		
	
	var initNavigation = function(){
	
		$('#right').click(function(){
		
			if(searchString != ""){
				$('#tweettext').empty();
				if(currentTweet < list.length-1){tweetSlider(currentTweet+1);}
				else{currentTweet++;
				currentPage++;
				searchTwitter(searchString);}
			}
		});
				
		$('#left').click(function(){
			if(searchString != ""){
				$('#tweettext').empty();
				if(currentTweet <= 0){tweetSlider(list.length-1) }
				else{tweetSlider(currentTweet-1);}
			}
		});
		
	}
	
	var tweetSlider = function(start){
		currentTweet = start;	
		if(currentTweet > 0){$('#left').css("display", "inherit");	}
		else{ $('#left').css("display", "none");}
		if(list[currentTweet] != undefined){$('#right').css("display", "inherit");}	
		else{$('#right').css("display", "none"); }
		$('#tweettext').append(list[currentTweet]);	
		tweetHeight(this.width, this.height);	
	}
	
	var searchTwitter = function(input){
		var url = "http://search.twitter.com/search.json?q=";
		var timelineUrl = "from:"
		var queryUrl = input+"&callback=?&rpp=5&page="+currentPage;
		
		if(timeline == true){url += timelineUrl + queryUrl;}
		else{url+=queryUrl;}
		
		console.log(url);
		$('#tweettext').empty();
		
		$.ajax({
			url: url,
			dataType: 'json',
			success: function( data ) {
			
				if(data.results.length < 1){
					$('#tweettext').append('<div class="tweet"><div class="tweetcontent"><h5>You have reached the end of Twitter. 100% true statement</h5></div></div>');
					moreTweets = false;
					tweetSlider(currentTweet);
				}
				
				else{
					$.each( data.results, function( index, item ) {
						var tweet = '<img src="'+item.profile_image_url+'"/>';
						tweet += '<div class="tweet"><div class="tweetcontent"><a href="http://www.twitter.com/@'+ item.from_user +'" target="_blank">'+'<strong class="realname">'+item.from_user_name+'</strong><span class="username">'+' @'+item.from_user+'</span></a><br/>';
						//$('#simpletweet').append('<img src="'+item.profile_image_url+'"/>');
						//$('#simpletweet').append('<h5>'+item.from_user+'</h5>');
						
						var text = item.text;
						text = text.replace(/(https?:\/\/\S+)/gi,"<a href='$&'>$&</a>");
						text = text.replace(/(@)(\w+)/g, ' <a href="http://www.twitter.com/$&" target="_blank">$&</a> ');
						text = text.replace(/(#)(\w+)/g, ' <a href="https://twitter.com/search?q='+encodeURIComponent("%23")+'$2" target="_blank">#$2</a> ');	
						text = text + '</div><div class="tweetdate">';
						var date = item.created_at;
						
						var datetest = new Date(date);
						datetest = datetest.toString();
						datetest = datetest.replace(/(GMT\+)(\d+)/g, '');
						//date = date.substr(0, 11)
						text += datetest +'</div>';
						
						tweet += text;			
						list.push(tweet);
					});
					
					tweetSlider(currentTweet);
					
				}
			},
			 error: function( data ) {
			   console.log( 'ERROR: ', data );
			}
		});
	
	}
	
	return {
		simpleTweet: simpleTweet,

	};
}());	
	
$(document).ready(function()
{	
	/*
	Constructor: tweetModule.simpleTweet();
	simpleTweet(
	location, <- Use the jQuery selector
	width, <- integer or double
	height, <- integer or double
	search, <- Do you want a search box above the tweets? true or false.
	searchString, <- The thing you want to search for on Twitter. Note: This only checks tweet content, so you can't get all tweets from a user.
	timeline <- Are you searching for a user's timeline? true or false.
	)
	*/
	tweetModule.simpleTweet("body", 360, 90, true, "Hennkel", true );

});
	
	
