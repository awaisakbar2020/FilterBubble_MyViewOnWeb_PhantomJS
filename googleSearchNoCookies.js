var fs = require("fs"),
	system = require('system'),
	moment = require("./libraries/moment.min.js"),
	webpage, page, dateTime, search_terms, index, task, 
	output_format, keyword, page_counter, i, j, s, sx, action;
	createPage();
	
function createPage()
{
	webpage = require("webpage");
	page = webPage.create();
	createTimeStampFormat(timestampFormat);

}
	
function createTimeStampFormat(time_stamp_format)
{
	dateTime= moment().format(time_stamp_format);
	create_var();
}

function create_var()
{
	task=name;
	action = null;
	search_terms=input;
	index=search_terms.length;
	output_format="output/"+task+"/"+dateTime+"/"+"SERP_p1_q";
	sx=1,s=1,i=0,j=1,page_counter=0;
	openSearchPage();
}

search = function () 
{
		
	keyword=search_terms[i];
	page.evaluate( function(keyword) {
	$('input[name="q"]').val( keyword );
	$('form[action="/search"]').submit();
	}, keyword);
	j=j+1;
	i=i+1;
	index=index-1;
  
	if(index!=0)
	{
	action=null;
	}
	else
	{
	action = finishSearching;  
	}
    
}

finishSearching = function () 
{
	console.log('Congratulations! Search Completed.....');
	phantom.exit(0);
}

startOrEndSearch = function () {
	if(action == null) action = search;
	action.call();
}

injectJQuery = function (callback) {
	page.includeJs("http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js", callback);
}

//good to debug and abort request, we do not wish to invoke cause they slow things down (e.g. tons of plugins)
page.onResourceRequested = function (requestData, networkRequest) {
	log(["onResourceRequested", JSON.stringify(networkRequest), JSON.stringify(requestData)]);
}

//what did we get
page.onResourceReceived = function (response) {
	log(["onResourceReceived", JSON.stringify(response)]);
}

//what went wrong
page.onResourceError = function (error) {
    log(["onResourceError", JSON.stringify(error)]);
}

page.onLoadStarted = function() {
    console.log("loading target page...");
}

page.onLoadFinished = function(status) {
	if(status == 'success') 
	{
		if(s%2==0)
		{	
			if(SERPscreenshots){
				page.render(output_format+sx+'.png');
			}
		phantom.clearCookies();
		sx++;
		}

		s=s+1;

		if(action==null && page_counter==i)
		{
			openSearchPage(); 
		}
		
		else{
			setTimeout(function(){ 
					injectJQuery( startOrEndSearch );
			}, 30000);	 
		}
    }
	else 
	{
		phantom.exit(0);
	}	
}

function openSearchPage() {
	page_counter++;
	page.open('http://www.google.com');
}
