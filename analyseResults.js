/*
 * analyseResults.js
 * 
 * by: Awais Akbar
 * 
 * Goal: To compare the search results of two experiment
 * 
 * Description: Takes two JSON files (one per experiment) and from there, extracts the path of all SEPR URL files, thereby, performing the results comparison 
 *
 * Usage:
 * phantomjs analyseResults.js --task=[] 
 * 
 * Example : Comaprison of Google and DuckDuckGo results:
 * phantomjs analyseResults.js --task=taskAnalyseResults.json
 * 
 */

var system = require('system'),
	fs = require('fs'),
	moment = require("./libraries/moment.min.js"),
	webPage,page,arg1,searchTermsFile,sameSearchEngine,
	script_call,filtered_input1,dateTime,output_format,
	first_experiment_serp_names_file,second_experiment_serp_names_file,
	percentage_common_results=[],
	name,description,file1,file2,timestampFormat,version;
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
	var stream_task = fs.open('input/taskAnalyse/'+inputfile,'r');
	var data_task = stream_task.read(); 
	var config_task = JSON.parse(data_task); 
	name=config_task.name;
	description=config_task.description;
	file1=config_task.inputFile1;
	file2=config_task.inputFile2;
	sameSearchEngine=config_task.sameSearchEngine;
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
	timestampFormat=config_c.timestampFormat;
	dateTime= moment().format(timestampFormat);
	version=config_c.version;
	stream_config.close();
	openSERPNameFiles();
}

/**
 * opens the two json file (one from each experiment) which contains paths to SERP URL files
 * e.g. one file containing path to Google SERP Urls while the other to DuckDuckGo SERP Urls
 */
function openSERPNameFiles()
{
	var stream_inputFile1 = fs.open(file1,'r');
	var data_inputFile1 = stream_inputFile1.read(); 
	var config_inputFile1 = JSON.parse(data_inputFile1); 
	first_experiment_serp_names_file=config_inputFile1.serp_names;
	
	var stream_inputFile2 = fs.open(file2,'r');
	var data_inputFile2 = stream_inputFile2.read(); 
	var config_inputFile2 = JSON.parse(data_inputFile2); 
	second_experiment_serp_names_file=config_inputFile2.serp_names;
	
	if(!first_experiment_serp_names_file.length==second_experiment_serp_names_file.length)
	{
		console.log("Cannot Compare the results. Make sure both search engines have equal number of SERPS");
		phantom.exit(0);
	}
	compareResults();
}

/**
 * Compares the results of each SERP with the corresponding SERP
 * e.g. Google SERP with DuckDuckGo SERP
 */
function compareResults()
{
    output_format="analysis/"+name+"/"+dateTime;
	f = fs.open(output_format + "/resultsComparison.txt", "a");
	f.writeLine('###########################     Comparison of Search Experiments (Query Wise)    ###########################\n');
	f.close();
	for(var g=0;g<first_experiment_serp_names_file.length;g++)
	{
		var second_experiment_result=[];
		var second_experiment_result_index=[];
		var first_experiment_result_index=[];

		var stream_first_experiment_serps = fs.open(first_experiment_serp_names_file[g],'r');
		var current_serp_name=first_experiment_serp_names_file[g];
		var res = current_serp_name.split("/");
		var serp_name=res[res.length-1];
		var data_first_experiment_serps = stream_first_experiment_serps.read(); 
		var config_first_experiment_serps = JSON.parse(data_first_experiment_serps);
		var first_experiment_serp_urls = config_first_experiment_serps.serp_urls;
		var first_experiment_serp_urls_indices = config_first_experiment_serps.serp_urls_indices;
		
		var stream_second_experiment_serps = fs.open(second_experiment_serp_names_file[g],'r');
		var data_second_experiment_serps = stream_second_experiment_serps.read(); 
		var config_second_experiment_serps = JSON.parse(data_second_experiment_serps);
		var second_experiment_serp_urls = config_second_experiment_serps.serp_urls;
		var second_experiment_serp_urls_indices = config_second_experiment_serps.serp_urls_indices;
		
		for(var d=0;d<second_experiment_serp_urls.length;d++)
		{
			if(first_experiment_serp_urls.indexOf(second_experiment_serp_urls[d])!=-1)
			{
				second_experiment_result.push(second_experiment_serp_urls[d]);
				second_experiment_result_index.push(second_experiment_serp_urls_indices[d])
				
				g_index=first_experiment_serp_urls.indexOf(second_experiment_serp_urls[d]);
				first_experiment_result_index.push(first_experiment_serp_urls_indices[g_index]);
				
			}
		}
		
		if(sameSearchEngine){	
		var total_serp_length=Math.min(first_experiment_serp_urls.length , second_experiment_serp_urls.length);	
		}
		
		else{
		var total_serp_length=first_experiment_serp_urls.length + second_experiment_serp_urls.length;
		}
		
		f = fs.open(output_format + "/resultsComparison.txt", "a");
		f.writeLine('------------------------------------------------------------------------------------------------------------------------------------------------------'+'\n'+
		'==============>     Search Engine Result Page Name: '+serp_name+'     <=============='+'\n'+'------------------------------------------------------------------------------------------------------------------------------------------------------'+
		'\n\n'+'No. of Search Results in 1st Experiment: ' + first_experiment_serp_urls.length + '\n' +
		'No. of Search Results in 2nd Experiment: ' + second_experiment_serp_urls.length);
		
		if (second_experiment_result.length==0)
		{
			f.writeLine('\n'+'No match found in the results of both experiments');
			percentage_common_results.push(0);
		}
		
		else
		{
			f.writeLine('No. of Common Results in Both Search Experiments: '+second_experiment_result.length+'\n');
			f.writeLine('Percentage of Common Results in Both Search Experiments: '+((second_experiment_result.length/total_serp_length)*100)+'\n');
			percentage_common_results.push((second_experiment_result.length/total_serp_length)*100);
			
		}
		
		f.close();
		
		
	}
	
storeAnalysisResults();

}

/**
 * refines the results of analysis and writes them in text file
 */
function storeAnalysisResults(){
	
	var perc_common_res_news=0, perc_common_res_health=0, perc_common_res_sports=0, perc_common_res_science=0;
	
	for (var p=0;p<percentage_common_results.length;p++)
	{
		if(p<6)
		{
			perc_common_res_news = perc_common_res_news + percentage_common_results[p];
		}
		else if(p>=6 && p<12)
		{
			perc_common_res_health = perc_common_res_health + percentage_common_results[p];
		}
		else if (p>=12 && p<15)
		{
			perc_common_res_sports = perc_common_res_sports + percentage_common_results[p];
		}
		else if (p>=15)
		{
			perc_common_res_science = perc_common_res_science + percentage_common_results[p];
		}	
	}
	
	var perc_news=(perc_common_res_news/600)*100;
	var perc_health=(perc_common_res_health/600)*100;
	var perc_sports=(perc_common_res_sports/300)*100;
	var perc_science=(perc_common_res_science/500)*100;
	
	f = fs.open(output_format + "/resultsComparison.txt", "a");
	f.writeLine('------------------------------------------------------------------------------------------------------------------------------------------------------');
	f.writeLine('\n###########################     Comparison of Search Experiments (Query-Category Wise)    ###########################\n');
	f.writeLine('------------------------------------------------------------------------------------------------------------------------------------------------------');
	f.writeLine('\nPercentage of common results in News Category: '+ perc_news +'\n');
	f.writeLine('Percentage of common results in Health Category: '+ perc_health +'\n');
	f.writeLine('Percentage of common results in Sports Category: '+ perc_sports +'\n');
	f.writeLine('Percentage of common results in Science Category: '+ perc_science +'\n');
	f.writeLine('------------------------------------------------------------------------------------------------------------------------------------------------------');
	f.writeLine('\nPercentage of results change in News Category: '+(100-perc_news)+'\n');
	f.writeLine('Percentage of results change in Health Category: '+(100-perc_health)+'\n');
	f.writeLine('Percentage of results change in Sports Category: '+(100-perc_sports)+'\n');
	f.writeLine('Percentage of results change in Science Category: '+(100-perc_science)+'\n');
	f.writeLine('------------------------------------------------------------------------------------------------------------------------------------------------------');
	f.close();
	console.log("---------------------------------------------------------------------------");
	console.log("Done with Comparison. Please Check 'Analysis' folder to view the comparison");
	console.log("----------------------------------------------------------------------------");
	phantom.exit(0);
}