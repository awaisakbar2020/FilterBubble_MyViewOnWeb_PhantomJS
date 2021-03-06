/*
 * googleSearch.js
 * 
 * by: Awais Akbar
 * 
 * Goal: Gets a list of queries as input and searches them one by one
 * 
 * optional flags:
 *
 *    clear_cookies:clears cookies after each query, DEFAULT: No (won't clear cookies)
 *    page_limit:   number of search engine result pages that are retrieved 
 *    retry_limit:  number of retrys before skipping, DEFAULT: 3
 *    sleep_page :  sleep time (ms) between clicks within a domain, DEFAUL: 5000
 *    sleep_query:  sleep time (ms) between queries, DEFAUL: 5000
 *    sleep_retry:  sleep time (ms) between retries, DEFAUL: 5000
 *    user-agent:   sets the user-agent, DEFAUL: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_4) AppleWebKit/536.6 (KHTML, like Gecko) Chrome/20.0.1132.57 Safari/536.6"
 */


var fs = require("fs"),
	system = require('system'),
	moment = require("./libraries/moment.min.js"),
	webpage, page, dateTime, output_format, serpPages;
	createPage();

/**
 * requires a reference to the webpage module then use it to create an instance
 */
function createPage()
{
	webPage = require("webpage");
	page = webPage.create();
	page.viewportSize = { width: 1380, height: 800 };
	dateTime=createTimeStampFormat(timestampFormat);

}

/**
 * creates timestamp according to user defined time stamp format, uses moment.js
 * @param time_stamp_format
 * @return userTimeStampFormat
 */
function createTimeStampFormat(time_stamp_format)
{
	var userTimeStampFormat= moment().format(time_stamp_format);
	return userTimeStampFormat;
}

output_format="output/"+name+"/"+dateTime;  //e.g. output/taskSearch/2020-05-27_19-22-44-164

var DEBUG  = 1;
var serp_pages=[];

system.search_terms = [];
system.search_terms=input;
system.search_term_index = -1;
system.page_index = 0;

system.page_limit = pageLimit;
system.sleep_page = 5000; //5000;
system.sleep_error = 5000; //5000;
system.sleep_query = 60000; // 11000 * 60

if(enableCookies) {
	system.clear_cookies = 0;	
}
else {
	system.clear_cookies = 1;
}

page.settings.userAgent = "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.2 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.2";
page.customHeaders = {"Accept-Language":"en"};

actionlog = fs.open(output_format + "/actions.log", "w")

last_num  = null;
last_fun  = null;
last_next = null;

/**
 * Logs a message to console together with date and time
 * @param msg
 */
function log(msg) {
   console.log((new Date().getTime()) + ": " + msg);
}


/**
 * finds results on the search engine result page and saves them to json file. 
 * @param alist
 */
function log_urls(alist) {

var patt1 = /q=related:/;
var patt2=/news/;
var patt3 = /q=cache:/;
var patt4=/google/;
var patt5=/youtube/;
var patt6=/webcache/;

var urls=[];
var url_index=[];
var length=alist.length;
for(var i=0;i<length;i++)
{
	if(urls.indexOf(alist[i])==-1)
	{
		if (patt2.test(alist[i])){
		
			if(!patt3.test(alist[i]) && !patt4.test(alist[i]))
			{
		
					urls.push(alist[i]);
					url_index.push(system.page_index*10 + i);
		
			}
	}
	else if(!patt1.test(alist[i]) && !patt4.test(alist[i]) && !patt5.test(alist[i]) && !patt6.test(alist[i]))
	{
		if(alist[i]!="")
		{
			urls.push(alist[i]);
			url_index.push(system.page_index*10 + i);
		}
	}
		
	}
}

f = fs.open(output_format + "/URLs/SERP_q" + (system.search_term_index+1) + "_p" + (system.page_index+1)+ ".json", "a");
serpPages=output_format + "/URLs/SERP_q" + (system.search_term_index+1) + "_p" + (system.page_index+1)+ ".json";
serp_pages.push(serpPages);

const jsonURLs = JSON.stringify(urls);
const url_indices=JSON.stringify(url_index);

f.writeLine('{'+'\n\n'+'"serp_urls": '+jsonURLs+','+'\n\n');
f.writeLine('"serp_urls_indices": '+url_indices+'\n\n'+'}');
f.close();	
	
}

/**
 * drops the content of the webpage to .html file and renders the graphical representation to .png file
 * @param content
 */
function log_html(content) {
  page.render(output_format + "/Screenshots/SERP_q" + (system.search_term_index+1) + "_p" + (system.page_index+1) + ".png");
  f = fs.open(output_format + "/HTML Pages/SERP_q" + (system.search_term_index+1) + "_p" + (system.page_index+1)+ ".html", "a");
  f.writeLine(content);
  f.close();
}


/**
 * ran when the page is loaded succesfully
 * @param status
 */
function load_finished(status) {
	
	setTimeout(function(){ 
	
	var prev_load_finished = page.load_finished;
    page.load_finished = null;

    if (prev_load_finished !== null) actionlog.writeLine("load_finished " + status);
    else actionlog.writeLine("load_finished " + status + " NULL");
    actionlog.flush();

    if (prev_load_finished !== null)
	prev_load_finished(status); 
	
	}, 30000);
    
}


/**
 * logs a message and dies
 * @param message
 */
function die_with_error(message) {
    actionlog.writeLine("die_with_error " + message);
    actionlog.flush();
    log(message);
    //  log(page.content);
    phantom.exit();
}


/**
 * goes to next page
 * @param num
 * @param fun
 * @param next
 */
function next_page(num, fun, next) {
    actionlog.writeLine("next_page " + num + " " + fun);
    actionlog.flush();

    if (system.clear_cookies) phantom.clearCookies();

    var interval = setInterval(function() {
        page.load_finished = next;
        clearInterval(interval);

  actionlog.writeLine("next_page setInterval " + num + " " + fun);
  actionlog.flush();
                         
        last_num = num;
        last_fun = fun;
        last_next = next;
        //console.log('fun: ' + fun);
        eval("function step() { " + fun + " return 1; }");
        if (! page.evaluate(step))
            die_with_error("Unable to execute function '" + fun + "'");
    }, system.sleep_page);
}


/**
 * reruns the search if failed, does nothing otherwise
 * @param num
 * @param status
 */
function check_page(num, status) {
	
    actionlog.writeLine("check_page " + num + " (" + system.search_terms[system.search_term_index] + " page " + system.page_index + ")");
    actionlog.flush();

    if (DEBUG){
		if (system.search_terms[system.search_term_index]!=null){
			
			log("===============> STEP " + num + " (Search Query: " + system.search_terms[system.search_term_index] + " - page " + (system.page_index+1) + ") <===============");
		}
	}
  
    if (status !== 'success') {
  actionlog.writeLine("check_page Error in step " + num + ": " + status + " (" + system.search_terms[system.search_term_index] + " page " + system.page_index + ")");
  actionlog.writeLine("Sleeping and retrying...");
  actionlog.flush();

  log("Error in step " + num + ": " + status + " (" + system.search_terms[system.search_term_index] + " page " + system.page_index + ") <===============");
  log("Sleeping and retrying...");
  var interval = setInterval(function() {
      actionlog.writeLine("check_page setInterval");
      actionlog.flush();
      clearInterval(interval);
      next_page(last_num, last_fun, last_next);
  }, system.sleep_error);
  return 0;
    }
    
    if (! page.injectJs("libraries/jquery-1.7.2.js"))
  die_with_error("Error injecting Jquery");
    return 1;
}


/**
 * saves the page to html and png files, then either goes to the next page with results or searches for next item on the list
 * @param status
 */
function get_results(status) {
    if (!check_page(3, status)) return;

    actionlog.writeLine("get_result");
    actionlog.flush();
    
    log_html(page.content);
    log_urls(page.evaluate(function() { return Array.prototype.map.call(document.querySelectorAll('a'), function(a) { return a.href; }); }));
    
    system.page_index++;
    
    if (system.page_index < system.page_limit){
    
        actionlog.writeLine("get_result moving to next page (normal)");
        actionlog.flush();
        next_page(3, "document.location.href=document.getElementById('pnnext').href;", get_results);
    
    }
    else {
    actionlog.writeLine("get_result queuing next search");
    actionlog.flush();
	
	
    var interval = setInterval(function() {
        actionlog.writeLine("get_result setInterval");
        actionlog.flush();
        clearInterval(interval);
        search(status);
    }, 
    system.sleep_query);
    }
}


/**
 * Runs the google search
 * @param status
 */
function search(status) {
	
    if (!check_page(2, status)) return;

    actionlog.writeLine("search");
    actionlog.flush();
  
    system.page_index = 0;
    system.search_term_index++;
    
    
    if (system.search_term_index < system.search_terms.length) {

  
      console.log('Searching Query: '+system.search_terms[system.search_term_index]+" .................");
      if (page.evaluate(function() { return ($('input[name="q"]') !== null); })) {
    actionlog.writeLine("search search box " + system.search_terms[system.search_term_index]);
    actionlog.flush();
    page.evaluate(function(str) { $('input[name="q"]').val(str); }, system.search_terms[system.search_term_index]);
    next_page(2, "$('form').submit();", get_results);
      }
      else{
        system.search_term_index--;
        prepare_for_search(status);
        }

    }
    
    else {
  log("Done with all search terms -- exiting");
  
  const jsonPageContent = JSON.stringify(serp_pages);
  f = fs.open(output_format + "/URLs/all_SERP_names.json", "a");
  f.writeLine('{'+'\n\n'+'"serp_names": '+jsonPageContent+'\n\n'+'}');
  f.close();
  phantom.exit();
    }
}

/**
 * Intermediate function ran in case of error
 * @param status
 */
function prepare_for_search(status) {
		console.log("inside prepare_for_search");
        page.render('dummy.png');
        eval("function go_to_google() { document.location.href='https://www.google.com';}");
        page.evaluate(go_to_google);
        interval = setInterval(function() { clearInterval(interval); search(status); }, 5000);
}

/*-----------------------------
 * Main body of the code:
 -----------------------------*/
 
    page.load_finished = search;
    page.onLoadFinished = load_finished;
    page.open("https://www.google.com/"); 

/*------------------------------
 -------------------------------*/	
