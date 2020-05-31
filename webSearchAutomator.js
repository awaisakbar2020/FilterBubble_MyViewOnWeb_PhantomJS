var system = require('system'),
	fs = require('fs'),
	webPage,page,arg1,arg2,res1,res2,
	script_call,filtered_input1,filtered_input2;
	createPage();
	
function createPage()
{
	webPage = require('webpage');
	page = webPage.create();
	getUserInput();
	
}

function getUserInput()
{
	arg1=system.args[1],
	arg2=system.args[2];
	if (system.args.length === 2) {
		console.log('Argument Missing! Please pass both the input file and the configuration file');
		phantom.exit(0);
	}
	else
	{
		filterAndCheckUserInput();
	}
	
	
}

function filterAndCheckUserInput()
{
	filtered_input1 = arg1.split("=");
	filtered_input2= arg2.split("=");

	if(filtered_input1[0]=="--task")
	{
		inputfile=filtered_input1[1];
		if(filtered_input2[0]=="--config")
		{
			configfile=filtered_input2[1];
			readTaskFile();
		}
		else
		{
			console.log('Invalid Input! Please try again');
			phantom.exit(0);
		}	
	}
	else if (filtered_input1[0]=="--config")
	{
		configfile=filtered_input1[1];
		if(res2[0]=="--task")
		{
			inputfile=filtered_input2[1];
			readTaskFile();
		}
		else
		{
			console.log('Invalid Input! Please try again');
			phantom.exit(0);
		}
	
	}
	else
	{
		console.log('Invalid Input! Please try again');
		phantom.exit(0);
	}
}
	
function readTaskFile()
{
	var stream_task = fs.open('input/'+inputfile,'r');
	var data_task = stream_task.read(); 
	var config_task = JSON.parse(data_task); 
	
	window.name=config_task.name;
	window.description=config_task.description;
	window.script=config_task.script;
	window.input=config_task.input;
	window.output=config_task.output;
	window.SERPscreenshots=output.SERPscreenshots;
	window.SERPurls=output.SERPurls;
	window.pageLimit=config_task.pageLimit;
	
	if(config_task.script=="browseHistory.js")
	{

		window.depthLimit=config_task.depthLimit;
		
	}
	
	if(config_task.script=="clickHistory.js")
	{

		window.clicks=config_task.clicks;
		
	}
	
	stream_task.close();
	readConfigFile();
}

function readConfigFile()
{
	var stream_config = fs.open(configfile,'r');
	var data_config = stream_config.read(); 
	var config_c = JSON.parse(data_config); 
	window.timestampFormat=config_c.timestampFormat;
	window.version=config_c.version;
	stream_config.close();
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