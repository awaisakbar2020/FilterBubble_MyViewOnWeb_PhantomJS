var system = require('system'),
	fs = require('fs'),
	webPage,page,arg1,searchTermsFile,
	script_call,filtered_input1;
	createPage();
	
function createPage()
{
	webPage = require('webpage');
	page = webPage.create();
	getUserInput();
	
}

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
	
	if(config_task.script=="googleBrowseHistory.js")
	{

		window.depthLimit=config_task.depthLimit;
		
	}
	
	if(config_task.script=="googleClickHistory.js")
	{

		window.clicks=config_task.clicks;
		
	}
	
	stream_task.close();
	readConfigFile();
}

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

function readQueries()
{
	
	var stream_queries = fs.open(searchTermsFile,'r');
	var data_queries = stream_queries.read(); 
	var config_queries = JSON.parse(data_queries); 
	window.input=config_queries.queries;
	stream_queries.close();
	callScript();
}

function callScript()
{
	console.log('******************************************************');
	console.log('Welcome to version '+version+' of the Web Search Automator');
	console.log('******************************************************');
	console.log("Your task details are as follows:");
	console.log("Task Name: "+window.name);
	console.log("Task Description: "+window.description);
	console.log("Search Terms: "+window.input);
	console.log("Google search has been started. Please wait.......");
	script_call = require("./"+script);	
}