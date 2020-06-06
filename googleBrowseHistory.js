var fs = require("fs"),
	system = require('system'),
	moment = require("./libraries/moment.min.js"),
	webpage, page, dateTime, output_format;
	createPage();
	
function createPage()
{
	webPage = require("webpage");
	page = webPage.create();
	page.viewportSize = { width: 1280, height: 800 };
	createTimeStampFormat(timestampFormat);

}
	
function createTimeStampFormat(time_stamp_format)
{
	dateTime= moment().format(time_stamp_format);
}

page.settings.userAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_4) AppleWebKit/536.6 (KHTML, like Gecko) Chrome/20.0.1132.57 Safari/536.6";
page.customHeaders    = {"Accept-Language":"en"};

output_format="output/"+name+"/"+dateTime;

system.url_terms      = [];
system.url_term_index = 0;

system.page_limit     = pageLimit-1;
system.depth_limit    = depthLimit;
system.page_index     = 0;
system.depth_index    = 0;

system.clear_cookies = 0;
system.sleep_page    = 5000;
system.sleep_query   = 5000;
system.sleep_retry   = 5000;

system.retry_limit = 3;
system.retry_count = 0;

system.url_terms=input;

var DEBUG1 = 1;
var DEBUG2 = 1;
var DEBUG3 = 0;


  //Logs a message to console together with date and time
 
function log(msg) {
  console.log((new Date().getTime()) + ": " + msg);
}

 // drops the content of the webpage to .html file and renders the graphical representation to .png file
 
function log_html(content) {
  if (DEBUG1) log('Doing log_html ...');
  if (DEBUG1) log(system.url_terms[system.url_term_index].replace("/", "+") + "." + system.page_index + "." + system.depth_index);
  page.render(output_format + "/Screenshots/" + system.url_terms[system.url_term_index].replace("/", "+") + "." + system.page_index + "." + system.depth_index + ".png");
  f = fs.open(output_format + "/HTML Files/" + system.url_terms[system.url_term_index].replace("/", "+") + "." + system.page_index + "." + system.depth_index + ".html", "w");
  f.writeLine(content);
  f.close();
}

/*
 * checks if the page loaded successfully. If so, returns 1, otherwise retries or dies
 * returns {Number}
 */
function check_page(status) {
  if (DEBUG1) log('Doing check_page ...' + status);
  if (! page.injectJs("libraries/jquery-1.7.2.js")) die_with_error("Error injecting Jquery");
//  page.onResourceReceived = function(resource) {
//      console.log('Loaded: ' + resource.url + ' with status ' + resource.status);
//  }
  if (status !== 'success'){
    if (system.retry_count == system.retry_limit){
      system.url_term_index++;
      system.retry_count = 0;
      f = fs.open(system.status_file, "w");
        f.writeLine(system.url_term_index.toString());
        f.close();
      log("Too many failures! Skipping the page!");
    }
    else{
      log("Sleeping and retrying...");
      system.retry_count++;
    }
    var interval = setInterval(function() {
        clearInterval(interval);
        system.depth_index = 0;
        system.page_index  = 0;
        var current_url = system.url_terms[system.url_term_index];
        next_browse(("http://"+current_url), get_results);
    }, system.sleep_retry);
    return 0;
  }
  return 1;
}

 //handles the load finished event
 
function load_finished(status) {
	
  setTimeout(function(){
	  
  if (DEBUG1) log('Doing load_finished ...' + status);
  var prev_load_finished = page.load_finished;
  page.load_finished = null;
  if (prev_load_finished !== null)
  prev_load_finished(status);

  }, 30000);
  
}


//logs a message and dies

function die_with_error(message) {
  log(message);
  phantom.exit();
}


//Used to click on a link within a page after timeout. Callback will be called after successful load of the next page

function next_page(func, callback) {
  if (DEBUG1) log('Doing next_page ...' + status);
  if (DEBUG2) console.log('\t***sleep_page NEXT_PAGE***');
  
  var interval = setInterval(function() {
    if (DEBUG2) console.log('\t***Wake up***');
    if (DEBUG2) console.log('\tload_finished:\t' + (callback.toString()).split(" ")[1]);
    if (DEBUG2) console.log('\tfunc:\t\t' + func);
    page.load_finished = callback;
    clearInterval(interval);
    eval("function step() { " + func + " return 1; }");
    if (! page.evaluate(step))
      die_with_error("Unable to execute function '" + func + "'");
  }, system.sleep_page);
}

/*
 gets all links which lead to another pages within the same domain
 returns {Array}
 */
function get_all_links(CurrentDomain){
  if (DEBUG1) log('get_all_links ... CurrentDomain: ' + CurrentDomain);
    var links = page.evaluate(function(Domain) { return jQuery.map(jQuery('a[href*=\"'+Domain+'\"]'), function(a) { return a.href; }); }, CurrentDomain);
  var ValLinks = [];
  for (var i = 0; i < links.length; i++)
    if (ValidateURL(links[i])) ValLinks.push(links[i]); 
  if (DEBUG1) console.log('\t\t#Links:' + links.length);
  if (DEBUG3) for (var i = 0; i < links.length; i++) console.log(links[i]);
  return ValLinks;
}


 /* checks if the given link is a redirecting link, or a javascript link
    returns 1 if it is a redirect link, 0 if javascript */
 
function ValidateURL(textval) {
  var urlregex = new RegExp("^(http|https|ftp)\://([a-zA-Z0-9\.\-]+(\:[a-zA-Z0-9\.&amp;%\$\-]+)*@)*((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|([a-zA-Z0-9\-]+\.)*[a-zA-Z0-9\-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(\:[0-9]+)*(/($|[a-zA-Z0-9\.\,\?\'\\\+&amp;%\$#\=~_\-]+))*$");
    return urlregex.test(textval);
}

// Used to browse to the next page on the list

function next_browse(url, callback) {
  if (DEBUG1) log('Doing next_browse ...' + status);
  if (DEBUG2) console.log('\t***sleep_query NEXT BROWSE***');
  var interval = setInterval(function() {
    if (DEBUG2) console.log('\t***Wake up***');
    if (DEBUG2) console.log('\tload_finished :\t' + (callback.toString()).split(" ")[1]);
    if (DEBUG2) console.log('\tpage.open(url):\t' + url);
    if (system.clear_cookies){
      phantom.clearCookies();
      if (DEBUG3) console.log('\tCookies Size: ' + phantom.cookies.length);
    }
    page.load_finished = callback;
    clearInterval(interval);
    page.open(url);
  }, system.sleep_query);
}

// logs the current page, then either clicks another link within domain or goes to the next page in the list

function get_results(status) {
  if (DEBUG1) log('Doing get_results ...' + status);
  if (!check_page(status)) return;
  
  log_html(page.content);
  
  var AllLinks = get_all_links(system.url_terms[system.url_term_index]);
  console.log('\tAllLinks.length: ' + AllLinks.length);
  
  if ((system.depth_index < system.depth_limit) && (AllLinks.length != 0)){
    system.depth_index++;
    var randomLink = AllLinks[Math.floor(Math.random()*AllLinks.length)];
    if (randomLink == null)
      die_with_error('Could not extract links!');
    next_page("window.location.href = \"" + randomLink + "\";", get_results);
  }
  else{
    system.depth_index = 0;
    if (system.page_index < system.page_limit){
      system.page_index++;
    }
    else {
      system.page_index = 0;
      system.url_term_index++;
      
    }
    if (system.url_term_index < system.url_terms.length) {
      var current_url = system.url_terms[system.url_term_index];
      next_browse(("http://"+current_url), get_results);
    }
    else {
      log("Done with all search terms -- exiting");
      phantom.exit();
    }
  }
}

//prints global settings

function log_settings(){
  console.log('\n\tsystem.login: ' + system.login);
  console.log('\tsystem.clear_cookies: ' + system.clear_cookies + '\tCookies Size: ' + phantom.cookies.length);
  console.log('\tsystem.page_limit: ' + system.page_limit);
  console.log('\tsystem.depth_limit: ' + system.depth_limit + '\n');
}


/*----------------------------------------------------------------------------------------------
 * Main body of the code:
 ----------------------------------------------------------------------------------------------*/
log_settings();

    var current_url = system.url_terms[system.url_term_index];
    page.load_finished  = next_browse(("http://"+current_url), get_results);;
    page.onLoadFinished = load_finished;
    page.open("http://www.google.com/");

/*----------------------------------------------------------------------------------------------
 ----------------------------------------------------------------------------------------------*/