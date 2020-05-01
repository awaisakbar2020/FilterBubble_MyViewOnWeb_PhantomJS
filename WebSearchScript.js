#!/usr/bin/env phantomjs

//--------------------------------------------------------

var fs = require('fs');
var page = require('webpage').create(),
    system = require('system'),
    action = null,
    q = null;
	
var i=0,j=1,vl=0,keyword,counter=0;
var s=1,sx=1;



var input_queries=system.args[1];


if (system.args.length === 1) {
  console.log('Please pass the filename containing search keywords');
  phantom.exit(0);
}
else
{
	console.log('Input passed');
}

//--------------------------------------------
var today = new Date();
var date = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
var time = today.getHours() + "h " + today.getMinutes() + "m " + today.getSeconds()+"s";
var dateTime = date+' '+time;
//--------------------------------------------

var output_data="Output/"+dateTime+"/"+"SearchResultForQuery";

var stream = fs.open('Input/'+input_queries, 'r');

system.search_terms = [];
system.search_term_index = -1;

	while(!stream.atEnd()) {
    var line = stream.readLine();
	system.search_terms.push(line);	
	}
var index=system.search_terms.length;
stream.close();
openPage();

//---------------------------------------



//-----------------------------------

start = function () {
	console.log('Function start begin');
  
  //text += cars[i] + "<br>";
  //console.log("value of index"+i);
  //console.log(system.search_terms[i]);
  console.log( "URL before button submit " + page.url );
  keyword=system.search_terms[i];
  console.log('Function: start');
  page.evaluate( function(keyword) {
    $('input[name="q"]').val( keyword );
    $('form[action="/search"]').submit();
  }, keyword);

//page.render("Screenshots-Google/input/QueryNo" + j + ".png");
console.log( "URL after button submit " + page.url );  
  j++;
  i++;
  index--;
  console.log('value of i after increment:'+i);
  
  //page.render('QueryNo'+j+'.png');
  console.log('value of index before if(index!=0):'+index);
  if(index!=0)
  {
	  action=null;
  }
  else{
	action = viewList;  
  }
  
  console.log('Function "start" Ended');
  
}

viewList = function () {
  console.log('Function (viewList)');
  page.render('viewList.png');
  phantom.exit();
}

//--------------------------------------------------------

work = function () {
	console.log( "Function (work) " );
  if(action == null) action = start;
  console.log( "URL: " + page.url );
  action.call();
}

injectJQuery = function (callback) {
  console.log('injecting JQuery');
  page.includeJs("http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js", callback);
}

page.onLoadFinished = function(status) {
	  if(status == 'success') {
         
	console.log('onLoadFinished');
	console.log('********************************************');
	console.log('***** CURRENT URL IS: '+page.url);
	console.log('value s Before increment:'+s);
	if(s%2==0)
	{	
		page.render(output_data+sx+'.png');
		//page.render('SearchResultForQuery'+sx+'.png');
		sx++;
	}
	
	s=s+1;
	console.log('value s after increment:'+s);
	console.log('value of counter just before comparison is:'+counter);
	console.log('********************************************');
	if(action==null && counter==i)
	{
	  console.log('Going to Open Google Search Page now');
	  openPage(); 
	  console.log('Returned back inside if(action==null && counter==i) after opening page');
	}
	 else{
		 console.log('Did not execute if(action==null && counter==i) condition');
		 //page.render('screenelse'+i+'.png');
         console.log('Status: ' + status);
        setTimeout(function(){ 
         injectJQuery( work );
	  }, 30000);	 
	 }
	 
	  }
	  
	 else {
       console.log('Connection failed.');
       phantom.exit();
    }	
	console.log('Waiting at the very bottom of onLoadFinished');
}

page.onConsoleMessage = function(msg){ 
	  console.log('onConsoleMessage');
      console.log('PAGE: ' + msg);
};

page.onResourceReceived = function (response) {
  if(response.stage == "end")
    console.log('Response (#' + response.id + ', status ' + response.status + '"): ' + response.url);
}

page.onUrlChanged = function (url) {
  console.log("On URL Changed: " + url);
}

//--------------------------------------------------------

function openPage() {
	counter++;
	console.log('inside openpage function, value of counter is:'+counter);
page.open('http://www.google.com');
}
