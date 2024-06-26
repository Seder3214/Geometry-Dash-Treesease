let modInfo = {
	name: "The Geometry Dash Tree",
	id: "stars",
	author: "Seder3214",
	pointsName: "Stars",
	modFiles: ["layers.js", "tree.js"],
	endgame: new Decimal("e1e15"),

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (10), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.6.6",
	name: "Geometry Dash Treesease - Can't Let Go",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.6.6</h3><br>
		<p>- Added a new layer!
		                        <p><b><br>+Seder3214+</br></b></p>`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(0)
	if (hasUpgrade("SM", 11)) gain = gain.plus(1)
			if (hasUpgrade("SM", 33)) gain = gain.times(5)
		if (hasAchievement("ac", 15)) gain = gain.times(1.2)
			if (hasUpgrade("BT", 32)) gain = gain.times(2)
if (hasUpgrade("SM", 32)) gain = gain.times(20)	
if (hasMilestone("SM", 15)) gain = gain.times(4)
	if (hasUpgrade("DO", 11)) gain = gain.times(2)
if (player.DO.buyables[11].gte(1)) gain = gain.times(buyableEffect("DO", 11));		
	if (hasUpgrade("PG", 11)) gain = gain.times(upgradeEffect("PG", 11))
		if (hasUpgrade("SM", 12)) gain = gain.times(upgradeEffect("SM", 12))
			if (hasUpgrade("PG", 13)) gain = gain.times(11)
				if (hasUpgrade("SM", 31)) gain = gain.times(upgradeEffect("SM", 31))
					if (hasUpgrade("SM", 22)) gain = gain.times(upgradeEffect("SM", 22))
			if (hasUpgrade("BT", 11)) gain = gain.times(4)
						if (player.DO.buyables[22].gte(1)) gain = gain.times(25);
					if (hasAchievement("ac", 14)) gain = gain.times(3)
						if (hasUpgrade("SM",41)) gain = gain.mul(tmp.BAB.energyEff)
						if (hasUpgrade("BAB",14)) gain = gain.mul(upgradeEffect("BAB",14))
	return gain
}
// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(modInfo.endgame)
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}