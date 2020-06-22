-------------------------------------------------------------------------------
DEPEND Project : Quantifying Personalization Bias in Web Search Using PhantomJS
-------------------------------------------------------------------------------
Instructions to Execute PhantomJS Script:

Copy this folder (FilterBubble_MyViewOnWeb_PhantomJS) into PhantomJS directory e.g C > Users > Awais > Phantom2.5 >

This folder has a subfolder named "input" which contains the different subfolder dedicated to different tasks.
 
For example, taskSearch to perform search experiment, taskBrowse to perform browse history experiment and, taskAnalyse to perform the analysis on results

You just have to specify your task file name while you run this Phantomjs Script using CMD.

To execute the script, open command prompt inside "FilterBubble_MyViewOnWeb_PhantomJS" folder. Now you have to pass two arguments.

First, Phantom script name, second, the name (including path) of desired task file, for example, use taskGoogleSearch to run a search experiment on Google Search Engine 


*** Command Line Usage:

Type the following command into CMD

	For Search Experiment:

	phantomjs webSearchAutomator.js --task=taskSearch/taskGoogleSearch.json   
	
	phantomjs webSearchAutomator.js --task=taskSearch/taskDuckDuckGoSearch.json

	For Browsing Experiment:
	
	phantomjs webSearchAutomator.js --task=taskBrowse/taskGoogleBrowse.json
	
	phantomjs webSearchAutomator.js --task=taskBrowse/taskDuckDuckGoBrowse.json
	
Wait for a few minutes (depending on the waiting time you specified in the scripts) to let the script be executed completely.

Alternatively, you can use batch file to perform each experiment. 

For example, to run search experiment on both Google and DuckDuckGo, type: 

	searchExperiment.bat 
	
To run browsing history experiment on both Google and DuckDuckGo, type: 

	browseExperiment.bat

After execution, you will see an output folder inside FilterBubble_MyViewOnWeb_PhantomJS folder. This folder will have search results in the form of screenshots. 

The results of analysis task will go into "analysis" folder