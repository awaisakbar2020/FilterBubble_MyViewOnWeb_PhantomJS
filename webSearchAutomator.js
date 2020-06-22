/*
 * webSearchAutomator.js
 * 
 * by: Awais Akbar
 * 
 * Goal: Takes a task as input and call the required script accordingly. e.g., for taskGoogleSearch, it reads all information and call googleSearch.js script
 * 
 * Usage:
 * phantomjs webSearchAutomator.js --task=[] 
 * 
 * Example : Search Experiment:
 * phantomjs webSearchAutomator.js --task=taskSearch/taskGoogleSearch.json
 *
 * Example : Browse Experiment:
 * phantomjs webSearchAutomator.js --task=taskBrowse/taskDuckDuckGoBrowse.json
 * 
 */

var system = require('system'),
	fs = require('fs'),
	webPage,page,arg1,searchTermsFile,
	script_call,filtered_input1;
	createPage();

/**
 * requires a reference to the webpage module then uses it to create an instance
 */	
function createPage()
{
	webPage = require('webpage');
	page = webPage.create();
	getUserInput();
	
}

/**
 * gets the task file as input e.g taskGoogleSearch
 */
function getUserInput()
{
	arg1=system.args[1];
	if (system.args.length === 1) {
		console.log('Argument Missing! Please pass the task file');
		phantom.exit(0);
	}
	else
	{
		filtered_input1 = arg1.split("=");

		if(filtered_input1[0]=="--task")
			{
				inputfile=filtered_input1[1];
				readTaskFile();	
			}
	}	
}

/**
 * extracts all the information from task file
 */
function readTaskFile()
{
	var stream_task = fs.open('input/'+inputfile,'r');
	var data_task = stream_task.read(); 
	var config_task = JSON.parse(data_task); 
	searchTermsFile=config_task.input;
	window.name=config_task.name;
	window.description=config_task.description;
	window.script=config_task.script;
	window.output=config_task.output;
	window.SERPscreenshots=output.SERPscreenshots;
	window.SERPurls=output.SERPurls;
	window.pageLimit=config_task.pageLimit;
	window.enableCookies=config_task.cookiesEnabled;
	
	if(script.indexOf("Browse")!=-1)
	{

		window.depthLimit=config_task.depthLimit;
		
	}
	
	stream_task.close();
	readConfigFile();
}

/**
 * extracts all the information from configuration file e.g. timestampFormat
 */
function readConfigFile()
{
	var configfile="config.json";
	var stream_config = fs.open(configfile,'r');
	var data_config = stream_config.read(); 
	var config_c = JSON.parse(data_config); 
	window.timestampFormat=config_c.timestampFormat;
	window.version=config_c.version;
	stream_config.close();
	readQueries();
}

/**
 * gets the name of search term file and extracts all queries from it
 */
function readQueries()
{
	var stream_queries = fs.open(searchTermsFile,'r');
	var data_queries = stream_queries.read(); 
	var config_queries = JSON.parse(data_queries); 
	
	if(searchTermsFile.indexOf("searchTerms")!=-1)
	{
		window.input=config_queries.queries;
		
	}
	else
	{
		window.input=config_queries.input;
	}
	
	stream_queries.close();
	callScript();
}

/**
 * calls the required script as mentioned in task file for completion of respective task
 */
function callScript()
{
	console.log('----------------------------------------------------------------------------------------------------');
	console.log('==============>     Welcome to version '+version+' of the Web Search Automator     <==============');
	console.log('----------------------------------------------------------------------------------------------------');
	console.log("\n"+"Your task details are as follows:");
	console.log("\n"+"Task Name: "+name);
	console.log("\n"+"Task Description: "+description);
	
	if(script.indexOf("Search")!=-1)
	{
		console.log("\n"+"Search Terms: "+"\n");
		for(var s=0;s<input.length;s++)
		{
			console.log('#'+(s+1)+'- '+input[s]);
		}
		console.log("\n"+"Search Experiment has been started. Please wait......."+"\n");
	}
	else
	{
		console.log("\n"+"Browsing Domains: "+"\n");
		for(var s=0;s<input.length;s++)
		{
			console.log('#'+(s+1)+'- '+input[s]);
		}
		console.log("\n"+"Browsing History Experiment has been started. Please wait......."+"\n");
	}
	
	script_call = require("./"+script);	
}