
var webPage = require('webpage');
var page = webPage.create();


var fs = require('fs');
system = require('system');

var arg1=system.args[1];
var arg2=system.args[2];

if (system.args.length === 2) {
  console.log('Argument Missing! Please pass both the input file and the configuration file');
  phantom.exit(0);
}
else
{
	console.log('Input passed');
}


var res1 = arg1.split("=");
var res2= arg2.split("=");

if(res1[0]=="--task")
{
	inputfile=res1[1];
	if(res2[0]=="--config")
	{
		configfile=res2[1];
	}
	else
	{
		console.log('Invalid Input! Please try again');
		phantom.exit(0);
	}	
}
else if (res1[0]=="--config")
{
	configfile=res1[1];
	if(res2[0]=="--task")
	{
		inputfile=res2[1];
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

var stream = fs.open('input/'+inputfile,'r');

var data = stream.read(); 
var config = JSON.parse(data); 

window.name=config.name;
window.description=config.description;
window.script=config.script;
window.input=config.input;
window.output=config.output;
window.SERPscreenshots=output.SERPscreenshots;
window.SERPurls=output.SERPurls;
//window.output=config.output;

stream.close();

console.log("name: " + name);
console.log('description:'+description);
console.log("script: " + script);
console.log('input:'+input);
console.log('SERPscreenshots:'+SERPscreenshots);
console.log('SERPurls:'+SERPurls);

var stream_config = fs.open(configfile,'r');

var data_config = stream_config.read(); 
var config_c = JSON.parse(data_config); 


window.timestampFormat=config_c.timestampFormat;
window.version=config_c.version;
stream_config.close();

console.log('***********************************');
console.log('Welcome to the version '+version+' of webSearchAutomator');
console.log('***********************************');

var search = require("./"+script);



