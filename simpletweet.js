function monoTweet()
{

	var list = [];
	var currentTweet = 0;
	var currentPage = 1;
	var searchString = "";
	var moreTweets = true;
	var width = 0;
	var height = 0;
	var timeline = false;
	var id = "";

	this.simpleTweet = function(newId, outerContainer, newWidth, newHeight, newSearch, newSearchString, newTimeline) {
		searchString = newSearchString;
		id = newId;
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
		  height = 100;
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
				$(outer).append('<input id="search'+id+'" type="text">'+
					'<button id="searchbutton'+id+'">Search</button>');
				$('#searchbutton'+id).click(function(){
					list = [];
					currentTweet = 0;
					currentPage = 1;
					searchString = document.getElementById("search"+id).value;
					searchString = searchString.replace('@', '%40'); 
					searchString = searchString.replace('#', '%23'); 
					searchTwitter(searchString);
				});
			}
			
			
			$(outer).append(	
				'<div id="'+ id +'" class="simpletweet-wrapper"><img class="logo" src="twitter.png"/><div class="simpletweet">'+
				'<div class="left"><div class="leftinner"><img src="left.png"/></div></div>'+
				'<div class="tweettext"></div>'+
				'<div class="right"><div class="rightinner"><img src="right.png"/></div></div>'+
				'</div></div>');
		
			$("#"+id+" .simpletweet").css("width", width);
			$("#"+id+" .simpletweet").css("height", height);
			$("#"+id+" .left, .right, .tweettext").css("height", height);
			$("#"+id+" .tweettext").css("width", width-50);
			
			
			
	}
	
	var tweetSlider = function(start){
		currentTweet = start;	
		if(currentTweet > 0){$("#"+id+' .leftinner').css("display", "table-cell");	}
		else{ $("#"+id+' .leftinner').css("display", "none");}
		if(list[currentTweet] != undefined){$("#"+id+' .rightinner').css("display", "table-cell");}	
		else{$("#"+id+' .rightinner').css("display", "none"); }
		$("#"+id+' .tweettext').append(list[currentTweet]);	
		
		tweetHeight(width, height);	
	}
	
		
	var tweetHeight = function(width, height){
	
		$("#"+id+" .tweet").css("width", width-120);
		$("#"+id+" .tweet").css("height", height-10);
		$("#"+id+" .tweettext img").css("top", (height-48)/2);
	}
	
	var initNavigation = function(){
	
		$("#"+id+' .rightinner').click(function(){
		
			if(searchString != ""){
				$("#"+id+' .tweettext').empty();
				if(currentTweet < list.length-1){tweetSlider(currentTweet+1);}
				else{currentTweet++;
				currentPage++;
				
				searchTwitter(searchString);}
			}
			
	
		});
				
		$("#"+id+' .leftinner').click(function(){
			if(searchString != ""){
				$("#"+id+' .tweettext').empty();
				if(currentTweet <= 0){tweetSlider(list().length-1) }
				else{tweetSlider(currentTweet-1);}
			}
		});
		
	}
	
	var searchTwitter = function(input){
		var url = "http://search.twitter.com/search.json?q=";
		var timelineUrl = "from:"
		var queryUrl = input+"&callback=?&rpp=5&page="+currentPage;
		
		if(timeline == true){url += timelineUrl + queryUrl;}
		else{url+=queryUrl;}
	
		$("#"+id+' .tweettext').empty();
		
		$.ajax({
			url: url,
			dataType: 'json',
			success: function( data ) {
			
				if(data.results.length < 1){
					$("#"+id+' .tweettext').append('<div class="tweet"><div class="tweetcontent"><h5>You have reached the end of Twitter. 100% true statement</h5></div></div>');
					moreTweets = false;
					tweetSlider(currentTweet);
				}
				
				else{
					$.each( data.results, function( index, item ) {
						var tweet = '<img src="'+item.profile_image_url+'"/>';
						tweet += '<div class="tweet"><div class="tweetcontent"><a href="http://www.twitter.com/@'+ item.from_user +'" target="_blank">'+'<strong class="realname">'+item.from_user_name+'</strong><span class="username">'+' @'+item.from_user+'</span></a><br/>';
						//$('.simpletweet').append('<img src="'+item.profile_image_url+'"/>');
						//$('.simpletweet').append('<h5>'+item.from_user+'</h5>');
						
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
			   //console.log( 'ERROR: ', data );
			}
		});
	
	}
	
    this.print = function()   // Only visible inside Restaurant()
    {
		console.log(list);
		console.log(id);
	
    }
	
	

}

test = new monoTweet();
test2 = new monoTweet();
$(document).ready(function()
{	
test.simpleTweet("test", "body", 450, 90, true, "#derp", false );
test2.simpleTweet("test2", "body", 350, 90, true, "#power", false );
setTimeout(function(){
test.print();
test2.print();
}, 1000);

});


