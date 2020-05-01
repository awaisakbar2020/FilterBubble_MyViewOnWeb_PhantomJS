-------------------------------------------------------------------------------
DEPEND Project : Quantifying Personalization Bias in Web Search Using PhantomJS
-------------------------------------------------------------------------------
Instructions to Execute PhantomJS Script:

Copy this folder (FilterBubble_MyViewOnWeb_PhantomJS) into PhantomJS directory e.g C > Users > Awais > Phantom2.5 >

This folder has a subfolder named "Input" which contains the search terms in txt file. You can add your own files into the folder "Input".

You just have to specify your input file name while you run this Phantomjs Script using CMD.

To execute the script, open command prompt inside "FilterBubble_MyViewOnWeb_PhantomJS" folder. Now you have to pass two parameters.

First, Phantom script name and second, the name of files containing queries.

Note that you do not need to pass the complete path of input file as parameter. Only file name will suffice.

*** Command Line Usage:

Type the following command into CMD

	phantomjs GoogleSearchV2.js SearchKeywords.txt
Wait for 2-3 minutes to let the script be executed completely.

After execution, you will see an output folder inside FilterBubble_MyViewOnWeb_PhantomJS folder. This folder will have search results in the form of screenshots