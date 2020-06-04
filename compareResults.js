var system = require('system'),
	fs = require('fs'),
	moment = require("./libraries/moment.min.js"),
	webPage,page,arg1,searchTermsFile,
	script_call,filtered_input1,dateTime,
	google_serp_names_file,duckduckgo_serp_names_file,
	name,description,file1,file2,timestampFormat,version;
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
	name=config_task.name;
	description=config_task.description;
	file1=config_task.inputFile1;
	file2=config_task.inputFile2;
	stream_task.close();
	readConfigFile();
}

function readConfigFile()
{
	var configfile="config.json";
	var stream_config = fs.open(configfile,'r');
	var data_config = stream_config.read(); 
	var config_c = JSON.parse(data_config); 
	timestampFormat=config_c.timestampFormat;
	dateTime= moment().format(timestampFormat);
	version=config_c.version;
	stream_config.close();
	openSERPNameFiles();
}

function openSERPNameFiles()
{
	var stream_inputFile1 = fs.open(file1,'r');
	var data_inputFile1 = stream_inputFile1.read(); 
	var config_inputFile1 = JSON.parse(data_inputFile1); 
	google_serp_names_file=config_inputFile1.serp_names;
	
	var stream_inputFile2 = fs.open(file2,'r');
	var data_inputFile2 = stream_inputFile2.read(); 
	var config_inputFile2 = JSON.parse(data_inputFile2); 
	duckduckgo_serp_names_file=config_inputFile2.serp_names;
	
	if(!google_serp_names_file.length==duckduckgo_serp_names_file.length)
	{
		console.log("Cannot Compare the results. Make sure both search engines have equal number of SERPS");
		phantom.exit(0);
	}
	compareResults();
}

function compareResults()
{
	var output_format="output/"+name+"/"+dateTime;
	f = fs.open(output_format + "/resultsComparison.txt", "a");
	f.writeLine('###########################     Comparison of Google & DuckDuckGo Search Results     ###########################\n');
	f.close();
	for(var g=0;g<google_serp_names_file.length;g++)
	{
		var duckduckgo_result=[];
		var duckduckgo_result_index=[];
		var google_result_index=[];

		var stream_google_serps = fs.open(google_serp_names_file[g],'r');
		var current_serp_name=google_serp_names_file[g];
		var res = current_serp_name.split("/");
		var serp_name=res[res.length-1];
		var data_google_serps = stream_google_serps.read(); 
		var config_google_serps = JSON.parse(data_google_serps);
		var google_serp_urls = config_google_serps.serp_urls;
		var google_serp_urls_indices = config_google_serps.serp_urls_indices;
		
		var stream_duckduckgo_serps = fs.open(duckduckgo_serp_names_file[g],'r');
		var data_duckduckgo_serps = stream_duckduckgo_serps.read(); 
		var config_duckduckgo_serps = JSON.parse(data_duckduckgo_serps);
		var duckduckgo_serp_urls = config_duckduckgo_serps.serp_urls;
		var duckduckgo_serp_urls_indices = config_duckduckgo_serps.serp_urls_indices;
		
		for(var d=0;d<duckduckgo_serp_urls.length;d++)
		{
			if(google_serp_urls.indexOf(duckduckgo_serp_urls[d])!=-1)
			{
				duckduckgo_result.push(duckduckgo_serp_urls[d]);
				duckduckgo_result_index.push(duckduckgo_serp_urls_indices[d])
				
				g_index=google_serp_urls.indexOf(duckduckgo_serp_urls[d]);
				google_result_index.push(google_serp_urls_indices[g_index]);
				
			}
		}
		
		f = fs.open(output_format + "/resultsComparison.txt", "a");
		f.writeLine('------------------------------------------------------------------------------------------------------------------------------------------------------'+'\n'+
		'==============>     Search Engine Result Page Name: '+serp_name+'     <=============='+'\n'+'------------------------------------------------------------------------------------------------------------------------------------------------------'+
		'\n\n'+'No. of Google Search Results: ' + google_serp_urls.length + '\n' +
		'No. of DuckDuckGo Search Results: ' + duckduckgo_serp_urls.length);
		
		if (duckduckgo_result.length==0)
		{
			f.writeLine('\n'+'No match found in the results of both Search Engines');
		}
		
		else
		{
			f.writeLine('No. of Common Results in Both Search Engines: '+duckduckgo_result.length+'\n');
			f.writeLine('Same Results in both Google and DuckDuckGo Search Engines: '+'\n');
			
		   for(var r=0;r<duckduckgo_result.length;r++)
			{
			f.writeLine('\n'+'#'+(r+1)+' - '+ duckduckgo_result[r] + '\n'+ 'Ranking on Google: ' + google_result_index[r] + '\n' + 
			'Ranking on DuckDuckGo: ' + duckduckgo_result_index[r] +'\n\n');	
			}
		}
		
		f.close();
		phantom.exit(0);
		
	}
	console.log("Done");
}