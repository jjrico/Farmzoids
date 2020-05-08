README: Notes on the HProject 2 Farmzoids
Time-stamp: <2020-02-19 13:13:32 Jeremy Rico>
------------------------------------------------------------

Files:
README.txt: this file
Jathp.js: The modified Javathcript.js file; for original use websearch.
cs-sketch.js: contains class definitions and some functions. Also the main p5
	animation functions taht draw and animate. 
	Also holds definitions of plot locations.
index.html: Main webpage in HTML + JS + JP.
	Contains ALL lsip code which includes main move-bot function,
	draw-bot, harvest, water, etc.
	Also contains rules and decisions in the decision function.
p5.js: The P5 system; unmodified, from its github site.
assets/
draw-stuff.js -- draws the farm

Basic layout:
Bots start in the center and begin plotting. Nature runs every 40 steps (1 day)
according to the rules in the project document. SEE CONSOLE FOR LOG OF ACTIONS
AND NATURE STATE. Bots will prioritize harvesting plots over any other action.