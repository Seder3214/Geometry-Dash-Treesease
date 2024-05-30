addLayer("SM", {
    name: "Stereo Madness", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "SM", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
		effboost: new Decimal(10),
		formulag: new Decimal(1),
        effectb: new Decimal(1200),
		upgpoint: new Decimal(22),
		best: new Decimal(0),
		total: new Decimal(0),
		auto: true,
		pseudoUpgs: [],
    }},
    color: "lightblue",
	automate() {},
	autoUpgrade() { return (hasMilestone("BAB", 12) && player.SM.auto)},
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "Stereo Madness",
    baseResource: "Stars",	// Name of resource prestige is based on
    baseAmount() {return player.points},	// Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.95, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
		if (inChallenge("CLG",13)) return new Decimal(0)
		if (hasUpgrade("SM", 21)) mult = mult.mul(1.5)
			if (hasMilestone("SM", 12)) mult = mult.mul(400)
				if (hasMilestone("SM", 14)) mult = mult.mul(2)
			if (hasUpgrade("BT", 21)) mult = mult.mul(upgradeEffect("BT", 21))
				if (hasUpgrade("SM", 31) && (hasUpgrade("PG", 21))) mult = mult.mul(upgradeEffect("SM", 31))
			if (inChallenge("CLG",12)) mult = mult.pow(0.15)		
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
		tabFormat: {
        "Main": {
        content:[
            function() {if (player.tab == "SM") return "main-display"},
            "prestige-button",
			"blank",
			"player.SM.points",
            function() {if (player.tab == "SM") return "resource-display"},
            "blank",
            "upgrades"
            ]
        },
		        "Milestones": {
        content:[
            function() {if (player.tab == "SM") return "main-display"},
            "prestige-button",
            function() {if (player.tab == "SM") return "resource-display"},
            "blank",
            "milestones"
            ],
			unlocked() {return (hasUpgrade("BT", 33))},
        },
		},
	upgrades: {
		11: {
			title: "Complete 5%",
			description: "Gain 1 Stars/s.",
			cost: new Decimal(1),
			unlocked() {return true},
		},
		12: {
						title() {return "Complete 15%"},
			description() { if (hasUpgrade("BAB",11)) return "Stars Gain multiplied by Stereo Madness amount, no hardcap, but the formula is weaker"
				else if (hasUpgrade("PG", 21)) return "Stars Gain multiplied by Stereo Madness amount, but the hardcap goes 100x later"
else return "Stars Gain multiplied by Stereo Madness amount"},
			cost: new Decimal(3),
			marked() {return (hasUpgrade("PG", 21)) },
			unlocked() {return true},
			effect() { 
				if (inChallenge("CLG", 11)||inChallenge("CLG", 12)) return new Decimal(1)
				if (hasUpgrade("BAB", 11)) return player[this.layer].points.add(1).log(2).plus(1).pow(1.95).mul(hasChallenge("CLG", 11)?challengeEffect("CLG",11):1)
				if (hasMilestone("SM", 16)) return player[this.layer].points.div(player.SM.points.div(20)).plus(1).pow(1.4)
			if (hasUpgrade("PG", 21)) return player.SM.effboost.times(100)
				if (inChallenge("BT", 11)) return player.SM.effboost.times(2)
				if (hasUpgrade("BT", 13)) return player.SM.effboost.times(4)
		if (hasUpgrade("SM", 13)) return player.SM.effboost.times(2)
			if (upgradeEffect("SM", 12).gte(9) && (hasUpgrade("SM", 12)) && (!hasUpgrade("BAB", 11))) return player.SM.effboost
				else return player[this.layer].points.plus(1).pow(1.4)
			},
			effectDisplay() {return format(upgradeEffect("SM", 12)) + "x"}
		},
				13: {
			title: "Complete 25%",
			description: "Hardcap of <b>15% Completed</b> goes 2x later.",
			cost: new Decimal(12),
			unlocked() {return true},
		},
		14: {
			title: "Complete Stereo Madness 2019",
			description: "Stereo Madness boosts Polargeist gain.",
			pseudoCost: new Decimal(5e40),
			cost: new Decimal(1.5e65),
			unlocked() {
	return player[this.layer].pseudoUpgs.includes(Number(this.id)) && hasChallenge("CLG",13)
		},
		effect() { 
			let x = new Decimal(1)
			x = player.SM.points.add(1).log2().add(1).pow(3.75)
			return x
			},
					pseudoUnl() {
				return hasChallenge("CLG",13)
			},
			pseudoReq() {return "To unlock this upgrade, get "+format(this.pseudoCost)+" points."},
			pseudoCan() {
				return player.points.gte(this.pseudoCost)
			},
			effectDisplay() {return format(upgradeEffect("SM", 14)) + "x"}
	},
						21: {
			title: "Complete 50%",
			description: "Stereo Madness gain is now x1.5 cheaper",
			cost: new Decimal(60),
			unlocked() {return true},
		},
								22: {
			title() {return "Complete 75%"},
			marked() {return (hasUpgrade("PG", 21))},
			description() { if (hasUpgrade("PG", 21)) return "Stars gain is multiplied by log10(x^4), where x is 600(ULTRA)"
			if (hasUpgrade("BT", 31)) return "Stars gain is multiplied by log(x^2), where x is 400(MAXED)" 
			if (hasUpgrade("SM", 23)) return "Stars gain is multiplied by log(x^2), where x is 100(boosted)" 
			else return "Stars gain is multiplied by log(x^2), where x is 25"
			},
			cost: new Decimal(1800),
			unlocked() {return true},
			effect() { if (hasUpgrade("PG", 21)) return player.SM.formulag.times(25.59)
			if (hasUpgrade("BT", 31)) return player.SM.formulag.times(11.98)
			if (hasUpgrade("SM", 23)) return player.SM.formulag.times(9.21)
			else return player.SM.formulag.times(5.77)
			},
			effectDisplay() {return format(upgradeEffect("SM", 22)) + "x"}
		},
								23: {
			title: "Complete level",
			description: "Multiplies x from formula of <b>75% Complete</b> by 4.00x",
			cost: new Decimal(2600),
			unlocked() {return true},
		},
		24: {
			title: "Complete Stereo Madness v3",
			description: "Increase the base of <b>Claim 1 coin SM</b> upgrade effect.",
			pseudoCost: new Decimal(1e43),
			cost: new Decimal(1e69),
			unlocked() {
	return player[this.layer].pseudoUpgs.includes(Number(this.id)) && hasChallenge("CLG",13)
		},
		effect() { 
			let x = new Decimal(1)
			x = player.SM.points.add(1).log2().add(1).log10()
			return x
			},
					pseudoUnl() {
				return hasChallenge("CLG",13)
			},
			pseudoReq() {return "To unlock this upgrade, get "+format(this.pseudoCost)+" points."},
			pseudoCan() {
				return player.points.gte(this.pseudoCost)
			},
			effectDisplay() {return format(upgradeEffect("SM", 24)) + "x"}
	},
										31: {
			title() {return "Claim 1 coin"},
			marked() {return (hasUpgrade("PG", 21)) },
			description() { if (hasUpgrade("PG", 21)) return "Multiplies Stars and SM Gain by number of buyed upgrades(only SM, BT and PG)"
			else return "Multiplies Stars Gain by number of completed Achievements" 
			},
			cost: new Decimal(1000000),
			unlocked() {return (hasUpgrade("BT", 33))},
			effect() { if (hasUpgrade("SM", 24)) return Decimal.pow(new Decimal(1.45).mul(upgradeEffect("SM", 24)),new Decimal(player.ac.achievements.length))
				if (hasMilestone("SM", 13)) return player.SM.upgpoint.times(2)
			if (hasUpgrade("PG", 21)) return player.SM.upgpoint
      else return player.ac.achievements.length
			},
			effectDisplay() {return format(upgradeEffect("SM", 31)) + "x"}
		},
												32: {
			title: "Claim 2 coins",
			description: "Just 20.00x Stars Gain... No more!",
			cost: new Decimal(1e16),
			unlocked() {return (hasUpgrade("BT", 33))},
		},
														33: {
			title: "Claim 3 coins",
			description: "5.00x Stars Gain",
			cost() { if (player.DO.buyables[23].gte(2)) return new Decimal(1e24).div(12)
				else return new Decimal(1e24) },
			unlocked() {return (hasUpgrade("BT", 33))},
		},
		34: {
			title: "Complete Stereo Extreemness",
			description: "Increase the base of <b>Complete Stereo Madness Full</b> upgrade effect.",
			pseudoCost: new Decimal(1e52),
			cost: new Decimal(1e89),
			unlocked() {
	return player[this.layer].pseudoUpgs.includes(Number(this.id)) && hasChallenge("CLG",13)
		},
		effect() { 
			let x = new Decimal(1)
			x = player.SM.points.add(1).log10().add(1).log10().pow(1.25)
			return x
			},
					pseudoUnl() {
				return hasChallenge("CLG",13)
			},
			pseudoReq() {return "To unlock this upgrade, get "+format(this.pseudoCost)+" points."},
			pseudoCan() {
				return player.points.gte(this.pseudoCost)
			},
			effectDisplay() {return format(upgradeEffect("SM", 34)) + "x"}
	},
		41: {
			title: "Complete Stereo Madness v2.0",
			description: "Stereo Madness boosts Base Energy generation and unlock its effect.",
			pseudoCost: new Decimal(1e21),
			cost: new Decimal(1.5e36),
			unlocked() {
 return player[this.layer].pseudoUpgs.includes(Number(this.id)) && hasMilestone("BAB",15)
		},
		effect() { 
			let x = new Decimal(1)
			x = player.SM.points.add(1).log2().add(1).log(2).pow(1.15)
			return x
			},
		            pseudoUnl() {
                return (hasMilestone("BAB", 15))
            },
            pseudoReq() {return "To unlock this upgrade, get "+format(this.pseudoCost)+" points."},
            pseudoCan() {
                return player.points.gte(1e21)
            },
			effectDisplay() {return format(upgradeEffect("SM", 41)) + "x"}
	},
	42: {
		title: "Complete Buffed Stereo Madness",
		description: "Stereo Madness boosts Back On Track gain.",
		pseudoCost: new Decimal(1e25),
		cost: new Decimal(1.5e45),
		unlocked() {
return player[this.layer].pseudoUpgs.includes(Number(this.id)) && hasMilestone("BAB",15)
	},
	effect() { 
		let x = new Decimal(1)
		x = player.SM.points.add(1).log2().add(1).pow(2.35)
		return x
		},
				pseudoUnl() {
			return (hasMilestone("BAB", 15))
		},
		pseudoReq() {return "To unlock this upgrade, get "+format(this.pseudoCost)+" points."},
		pseudoCan() {
			return player.points.gte(1e25)
		},
		effectDisplay() {return format(upgradeEffect("SM", 42)) + "x"}
},
43: {
	title: "Complete Stereo Madness Full",
	description: "Stereo Madness boosts <b>Complete 15% DO Buyable</b>.",
	pseudoCost: new Decimal(1e30),
	cost: new Decimal(1.5e50),
	unlocked() {
return player[this.layer].pseudoUpgs.includes(Number(this.id)) && hasMilestone("BAB",15)
},
effect() { 
	let x = new Decimal(1)
	x = player.SM.points.add(1).pow(new Decimal(0.05).mul(hasUpgrade("SM",24)?upgradeEffect("SM", 24):1)).add(1).pow(1.15)
	return x
	},
			pseudoUnl() {
		return (hasMilestone("BAB", 15))
	},
	pseudoReq() {return "To unlock this upgrade, get "+format(this.pseudoCost)+" points."},
	pseudoCan() {
		return player.points.gte(1e30)
	},
	effectDisplay() {return format(upgradeEffect("SM", 43)) + "x"}
},
44: {
	title: "Complete Stereo Madness Layer",
	description: "Stereo Madness boosts Base Energy effect.",
	pseudoCost: new Decimal(1e66),
	cost: new Decimal(1e108),
	unlocked() {
return player[this.layer].pseudoUpgs.includes(Number(this.id)) && hasChallenge("CLG",13)
},
effect() { 
	let x = new Decimal(1)
	x = player.SM.points.add(1).pow(0.015).add(1).pow(1.65)
	return x
	},
			pseudoUnl() {
		return hasChallenge("CLG",13)
	},
	pseudoReq() {return "To unlock this upgrade, get "+format(this.pseudoCost)+" points."},
	pseudoCan() {
		return player.points.gte(this.pseudoCost)
	},
	effectDisplay() {return format(upgradeEffect("SM", 44)) + "x"}
},
	},
	milestones: {
		11: {
			        requirementDescription() { if (hasMilestone("BAB", 12)) return "1 Stereo Madness"
					else return "0.5e9 Stereo Madness" },
        effectDescription: "Gain 100% of Stereo Madness per/s",
        done() { if (hasMilestone("BAB", 12)) return player.points.gte(1)
		else return player.SM.points.gte(5e8) },
		},
			12: {
			        requirementDescription: "1.48e12 Stereo Madness",
        effectDescription: "SM gain is buffed by 400.00x",
        done() { return player.SM.points.gte(1.48e12) },
		},
				13: {
			        requirementDescription: "7.89e14 Stereo Madness",
        effectDescription: "Doubles <b>Claim 1 coin</b> effect",
        done() { return player.SM.points.gte(7.89e14) },
		},
						14: {
			        requirementDescription: "5.66e15 Stereo Madness",
        effectDescription: "Doubles Second SM Milestone effect",
        done() { return player.SM.points.gte(5.65e15) },
		},
								15: {
			        requirementDescription: "3.24e11 Stars",
        effectDescription: "Just another 4.00x stars gain...",
        done() { return player.points.gte(3.24e11) },
		},
	},
			passiveGeneration() {			
					if (hasMilestone("SM", 11)) return (hasMilestone("SM", 11)?1:0)
						else if (hasUpgrade("BT", 12)) return (hasUpgrade("BT", 12)?0.1:0)
  },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "s", description: "s: Reset for SM", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
	doReset(resettingLayer) {
			if(layers[resettingLayer].row > this.row) {
				layerDataReset(this.layer,hasUpgrade("BT",11)?["milestones"]:[])
			}
			if (resettingLayer=="PG")if(hasMilestone("BAB",14)) layerDataReset("BT",["challenges"]);else layerDataReset("BT",[]);
			if (resettingLayer=="BAB")if(hasMilestone("BAB",14)) layerDataReset("BT",["challenges"]);else layerDataReset("BT",[]);
			if (resettingLayer=="CLG")if(hasMilestone("BAB",14)) layerDataReset("BT",["challenges"]);else layerDataReset("BT",[]);
			if (resettingLayer=="PG")if(hasMilestone("BAB",14))layerDataReset("DO",["upgrades"]);else layerDataReset("DO",[]);
			if (resettingLayer=="BAB")if(hasMilestone("BAB",14))layerDataReset("DO",["upgrades"]);else layerDataReset("DO",[]);
			if(hasMilestone("BAB",14)) player.BT.upgrades.push("11","12","13","21","22","23","31","32","33")
				if(hasMilestone("BAB",14)) player.DO.upgrades.push("11","12")
	},
	layerShown(){return true}
})

addLayer("BT", {
    name: "Back On Track", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "BT", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
		best: new Decimal(0),
		megaeff: new Decimal(1),
		total: new Decimal(0),
		auto: false,
    }},
    color: "darkcyan",
    requires: new Decimal(150), // Can be a function that takes requirement increases into account
    resource: "Back On Track",
	branches: ["SM"],
    baseResource: "Stereo Madness",	// Name of resource prestige is based on
    baseAmount() {return player.SM.points},	// Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
		if (hasUpgrade("PG", 12)) mult = mult.mul(2)
		if (hasUpgrade("SM",42)) mult = mult.mul(upgradeEffect("SM",41))
        return mult
    },
		infoboxes: {
    lore: {
        title: "Бэк он трек",
        body() { return "После покупки первого апгрейда этого слоя, вам необходимо купить все вплоть до 5-ого, после чего для вас откроется первое испытание... Описание испытания: 2-ое улучшение Стерео Маднесса будет уменьшено вдвое и 4-ое улучшение Бэк Он Трека будет выключено... Постарайтесь выполнить испытание дважды для комфортного прохождения." },
    },
},
	tabFormat: {
        "Main": {
        content:[
            function() {if (player.tab == "BT") return "main-display"},
            "prestige-button",
			"infoboxes",
            function() {if (player.tab == "BT") return "resource-display"},
            "blank",
            "upgrades"
            ]
        },
        "Challenges": {
            content:[
                function() {if (player.tab == "BT") return "main-display"},
            function() {if (player.tab == "BT") return "resource-display"},
            "prestige-button",
            "blank",
                "challenges"
            ],
			unlocked() {return (hasUpgrade("BT", 22))},
        },
		        "Infoboxes": {
            content:[
                function() {if (player.tab == "BT") return "main-display"},
            function() {if (player.tab == "BT") return "resource-display"},
            "prestige-button",
            "blank",
                "infoboxes"
            ],
			unlocked() {return (hasUpgrade("BT", 22))},
        },
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "b", description: "b: Reset for BT", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
	upgrades: {
		11: {
			title: "Next Level",
			description: "Gains 4.00x boost to Stars gain",
			cost: new Decimal(1),
		},
		12: {
			title: "10% Completed",
			description: "Get a 10% passive Stereo Madness Generation(boostable)",
			cost: new Decimal(2),
		},
				13: {
			title: "20% Completed",
			description: "Hardcap of <b>15% Completed SM</b> is going later again <br> Currently: 2.00x later",
			cost: new Decimal(7),
		},
						21: {
			title() { return "30% Completed"},
marked() {return (hasUpgrade("PG", 21)) },
			description() { if (hasUpgrade("BAB", 12)) return "Multiplies SM gain by <br>(10*(x^1.65))/Y, where x - best BT and Y - amount of BT right now"
				if (hasUpgrade("PG", 21)) return "Multiplies SM gain by (X*4)/Y, where x - best BT and Y - amount of BT right now"
				else return "Better formula: (X*2)/Y, where x - best BT & Y - BT right now"
				},
			cost: new Decimal(15),
			effect() { if (hasUpgrade("PG", 21)) return new Decimal(10).mul(player.BT.best.pow(1.65).add(1)).div(player.BT.points.add(1))
				 if (hasUpgrade("PG", 21)) return player.BT.best.times(4).div(player.BT.points.add(1))
			if (inChallenge("BT", 11)) return (upgradeEffect("BT", 21)).div(upgradeEffect("BT", 21))
				if (player.BT.points.lt(5)) return player.BT.best.times(2).div(player.BT.points.add(1)).times(0.4)
					else return player.BT.best.times(2).div(player.BT.points)
			},
			effectDisplay() {return format(upgradeEffect("BT", 21)) + "x"}
		},
		22: {
			title: "40% Completed",
			description: "Unlock a challenge",
			cost: new Decimal(20),
		},
				23: {
			title: "60% Completed",
			description: "Does nothing...",
			cost: new Decimal(40),
			unlocked() { return (hasChallenge("BT", 11))},
		},
						31: {
			title: "75% Completed",
			description: "Scales up <b>Speedrun</b> goal but multiplies x from <b>Complete 75% SM</b> by 4.00x",
			cost: new Decimal(60),
			unlocked() { return (hasChallenge("BT", 11))},
		},
						32: {
			title: "85% Completed",
			description: "Doubles Stars gain",
			cost: new Decimal(100),
			unlocked() { return (hasChallenge("BT", 11))},
		},
								33: {
			title: "Complete Level",
			description: "Unlock a new row of SM upgrades",
			cost: new Decimal(850),
			unlocked() { return (hasChallenge("BT", 11))},
		},
	},
	challenges: {
		11: {
				name: "Speedrun",
				completionLimit: 3,
				challengeDescription() { 
				let lim = this.completionLimit;
				return "<b>15% Completed SM</b> hardcap is powered by 2 and <b>30% Completed BT</b> is off <br> Completions: " + format(challengeCompletions("BT", 11)) + " / " + format(lim)
				},
				  scalePower() {
                let power = new Decimal(1);
                return power;
            },
				unlocked() { return (hasUpgrade("BT", 22)) },
				goal() { let comps = Decimal.mul(challengeCompletions("BT", 11))
if (challengeCompletions("BT", 11) == 2) return new Decimal(120000)
if (challengeCompletions("BT", 11) == 1) return new Decimal(80000)	
if (challengeCompletions("BT", 11) == 0) return new Decimal(60000)	
},
				currencyDisplayName: "points",
				currencyInternalName: "points",
				rewardDescription() { let boost = Decimal.mul(challengeCompletions("BT", 11))
if (challengeCompletions("BT", 11) == 3) return "1 Completion: ✓<br> 2 Completions: ✓ <br> 3 Completions: ✓"
if (challengeCompletions("BT", 11) == 2) return "1 Completion: ✓<br> 2 Completions: ✓ <br> 3 Completions: <b>Unlock new Layer</b>"
				if (challengeCompletions("BT", 11) == 1) return "1 Completion: ✓<br> 2 Completions: <b>Gain 3.00x multiplier to the Stars Gain</b> <br> 3 Completions: <b>Unlock new Layer</b>"
if (challengeCompletions("BT", 11) == 0) return "1 Completion: <b>Unlock new BT upgrades</b><br> 2 Completions: <b>Gain 3.00x multiplier to the Stars Gain</b> <br> 3 Completions: <b>Unlock new Layer</b>"	},
},
	},
	doReset(resettingLayer) {
		if(layers[resettingLayer].row > this.row) {
			layerDataReset(this.layer,hasMilestone("BAB",14)?["challenges"]:[])
		}
	},
	layerShown(){return (player.SM.points.gte(99) || player[this.layer].unlocked)},
})

addLayer("PG", {
    name: "Polargeist", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "PG", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: -1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
		best: new Decimal(0),
		megaeff: new Decimal(1),
		auto: false,
    }},
    color: "green",
    requires: new Decimal(120), // Can be a function that takes requirement increases into account
    resource: "Polargeist",
	branches: ["BT", "DO"],
    baseResource: "Back On Track",	// Name of resource prestige is based on
    baseAmount() {return player.BT.points},	// Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.43, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
		if (hasUpgrade("SM", 14)) mult = mult.mul(upgradeEffect("SM", 14))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for PG", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
	upgrades: {
	11: {
		title: "25% Completed",
		description: "Multiplies Stars Gain by ((log2(x)+5)*y^0.15), where x - Total BT and Y - Best PG (Hardcapped at 10.00x)",
		cost: new Decimal(1),
		unlocked() {return true},
		effect() {
			return hasChallenge("CLG",13)?player.BT.total.add(1).log2().add(5).mul(player.PG.best.pow(0.15)):player.BT.total.add(5).pow(player.PG.best.div(5)).min(10)
		},
		effectDisplay() {
			return format(upgradeEffect("PG", 11)) + "x"
		},
	},
		12: {
		title: "50% Completed",
		description: "Multiplies BT gain by 2.00x",
		cost: new Decimal(2),
		unlocked() {return true},
	},
			13: {
		title: "75% Completed",
		description: "Multiplies Stars Gain by 11.00x",
		cost: new Decimal(3),
		unlocked() {return true},
	},
				21: {
		title: "Level Completed",
		description: "Boosts all formula based upgrades of every layers(without PG)",
		cost: new Decimal(12),
		unlocked() {return true},
	},
	},
	challenges: {
},
	layerShown(){return (hasChallenge("BT", 11) || player[this.layer].unlocked)}
})

addLayer("DO", {
    name: "Dry Out", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "DO", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
		best: new Decimal(0),
		megaeff: new Decimal(1),
		total: new Decimal(1),
		pseudoUpgs: [],
		auto: false,
    }},
    color: "darkgreen",
    requires: new Decimal(1e12), // Can be a function that takes requirement increases into account
    resource: "Dry Out",
	branches: ["SM"],
    baseResource: "Stars",	// Name of resource prestige is based on
    baseAmount() {return player.points},	// Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.43, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
		if (hasMilestone("BAB", 11)) mult = mult.mul(2)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "d", description: "D: Reset for DO", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
	upgrades: {
		11: {
			title: "Complete 1%",
			description: "Unlock a new buyable and double stars gain",
			cost: new Decimal(1),
			unlocked() {return !(inChallenge("CLG", 12))},
		},
			12: {
			title: "Complete 30%",
			description: "Divides costs of every buyable by 1.5",
			cost: new Decimal(4),
			unlocked() {return !(inChallenge("CLG", 12))},
		},
	},
		tabFormat: {
        "Main": {
        content:[
            function() {if (player.tab == "DO") return "main-display"},
            "prestige-button",
            function() {if (player.tab == "DO") return "resource-display"},
            "blank",
            "upgrades"
            ]
        },
        "Buyables": {
            content:[
                function() {if (player.tab == "DO") return "main-display"},
            function() {if (player.tab == "DO") return "resource-display"},
            "prestige-button",
            "blank",
                "buyables"
            ],
        },
		        "Milestones": {
            content:[
                function() {if (player.tab == "DO") return "main-display"},
            function() {if (player.tab == "DO") return "resource-display"},
            "prestige-button",
            "blank",
                "milestones"
            ],
        },
    },
buyables: {
	11: {
				 title: "Complete 15%",
				 purchaseLimit() {if (player.DO.buyables[21].gte(2)) return new Decimal(20).add(hasChallenge("CLG", 12)?challengeEffect("CLG",12):0)
					 else return new Decimal(15).add(hasChallenge("CLG", 12)?challengeEffect("CLG",12):0) },
        cost(x) { if (hasChallenge("CLG"),12) return Decimal.pow(1.05,x.add(1).pow(new Decimal(challengeEffect("CLG",12)/1500).min(0.275).add(1)))
			else if (hasUpgrade("DO", 12)) return new Decimal(x.add(2)).div(buyableEffect("DO", 12)).div(1.5)
		else return new Decimal(x.add(2)).div(buyableEffect("DO", 12)) },
        display() { let data = tmp[this.layer].buyables[this.id]
			return "Level: " + formatWhole(player[this.layer].buyables[this.id]) + " / "+formatWhole(this.purchaseLimit(),0)+"<p></p>" +
		"Multiplies Stars gain <p></p>" +
		"Cost: " + format(data.cost) + " Dry Out<p></p>" +
        "Currently effect: " +format(data.effect) + "x."
		},
        canAfford() { return player[this.layer].points.gte(this.cost()) },
        buy() {
			cost = tmp[this.layer].buyables[this.id].cost
            player[this.layer].points = player[this.layer].points.sub(this.cost())
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        },

		effect(x) { let eff= new Decimal(1)
			if (hasMilestone("DO", 11)) eff = x.times(2).pow(buyableEffect("DO", 13)).times(1.46)
 else eff = x.times(2).pow(buyableEffect("DO", 13))
			if (hasUpgrade("SM",43)) eff = eff.mul(upgradeEffect("SM",43))
		return eff
},
			unlocked() {return (hasUpgrade("DO", 11))},
	},
		12: {
				 title: "Complete 25%",
				 purchaseLimit() { if (player.DO.buyables[21].gte(2)) return new Decimal(10)
				 else return new Decimal(7) },
        cost(x) { if (hasUpgrade("DO", 12)) return new Decimal(2).mul(x).div(1.5)
			else return new Decimal(2).mul(x) },
        display() { let data = tmp[this.layer].buyables[this.id]
			return "Level: " + formatWhole(player[this.layer].buyables[this.id]) + "<p></p>" +
		"Exponentially reduce the <b>Complete 15%</b> cost <p></p>" +
		"Cost: " + format(data.cost) + " Dry Out<p></p>" +
        "Currently effect: ^" +format(data.effect)
		},
        canAfford() { return player[this.layer].points.gte(this.cost()) },
        buy() {
			cost = tmp[this.layer].buyables[this.id].cost
            player[this.layer].points = player[this.layer].points.sub(this.cost())
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        },
					unlocked() {return (hasUpgrade("DO", 11))},
		effect(x) {return eff = x.div(2).pow(1.25).pow(buyableEffect("DO", 13)).add(1);
},
	},
			13: {
				 title: "Complete 55%",
				 purchaseLimit() { if (player.DO.buyables[21].gte(2)) return new Decimal(5)
					 else return new Decimal(3) },
        cost(x) { if (hasUpgrade("DO", 12)) return new Decimal(10).mul(x).div(1.5)
			else return new Decimal(10).mul(x) },
        display() { let data = tmp[this.layer].buyables[this.id]
			return "Level: " + formatWhole(player[this.layer].buyables[this.id]) + "<p></p>" +
		"Exponents <b>all buyables</b> effect <p></p>" +
		"Cost: " + format(data.cost) + " Dry Out<p></p>" +
        "Currently effect: ^" +format(data.effect)
		},
        canAfford() { return player[this.layer].points.gte(this.cost()) },
        buy() {
			cost = tmp[this.layer].buyables[this.id].cost
            player[this.layer].points = player[this.layer].points.sub(this.cost())
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        },
					unlocked() {return (hasUpgrade("DO", 11))},
		effect(x) { if (hasMilestone("DO", 11)) return eff = x.pow(0.4).times(1.29)
	else return eff = x.pow(0.4);
},
	},
				21: {
				 title: "Complete 75%",
				 purchaseLimit: new Decimal(2),
        cost(x) { if (hasUpgrade("DO", 12)) return new Decimal(10).mul(x)
			else return new Decimal(20).mul(x) },
        display() { let data = tmp[this.layer].buyables[this.id]
			return "Level: " + formatWhole(player[this.layer].buyables[this.id]) + "<p></p>" +
		"Scales up limits of <b>prev. buyables</b><p></p>" +
		"Cost: " + format(data.cost) + " Dry Out<p></p>"
		},
        canAfford() { return player[this.layer].points.gte(this.cost()) },
        buy() {
			cost = tmp[this.layer].buyables[this.id].cost
            player[this.layer].points = player[this.layer].points.sub(this.cost())
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        },
				unlocked() {return (hasMilestone("DO", 12))},
	},
					22: {
				 title: "Complete Level In Practice Mode",
				 purchaseLimit: new Decimal(2),
        cost(x) {return new Decimal(200).mul(x) },
        display() { let data = tmp[this.layer].buyables[this.id]
			return "Level: " + formatWhole(player[this.layer].buyables[this.id]) + "<p></p>" +
		"Multiplies Stars Gain by <b>25.00x</b><p></p>" +
		"Cost: " + format(data.cost) + " Dry Out<p></p>"
		},
        canAfford() { return player[this.layer].points.gte(this.cost()) },
        buy() {
			cost = tmp[this.layer].buyables[this.id].cost
            player[this.layer].points = player[this.layer].points.sub(this.cost())
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        },
		unlocked() {return (hasMilestone("DO", 13))},
	},
						23: {
				 title: "Complete Level In Normal Mode",
				 purchaseLimit: new Decimal(2),
        cost(x) {return new Decimal(400).mul(x) },
        display() { let data = tmp[this.layer].buyables[this.id]
			return "Level: " + formatWhole(player[this.layer].buyables[this.id]) + "<p></p>" +
		"Divides <b>Claim 3 coins</b> cost by<p>12.00x</p>" +
		"Cost: " + format(data.cost) + " Dry Out<p></p>"
		},
        canAfford() { return player[this.layer].points.gte(this.cost()) },
        buy() {
			cost = tmp[this.layer].buyables[this.id].cost
            player[this.layer].points = player[this.layer].points.sub(this.cost())
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        },
		unlocked() {return (hasMilestone("DO", 13))},
},
},
passiveGeneration() {			
	if (hasUpgrade("BAB", 13)) return (hasUpgrade("BAB", 13)?1:0)
	else return 0
},
milestones: {
		11: {
			        requirementDescription: "50 Total Dry Out",
        effectDescription: "Boosts <b>Complete 15%</b><br> Currently: 1.46x, and 1.29x",
        done() { return player.DO.total.gte(50) },
		},
				12: {
			        requirementDescription: "120 Total Dry Out",
        effectDescription: "Unlocks a new buyable",
        done() { return player.DO.total.gte(120) },
		},
						13: {
			        requirementDescription: "200 Total Dry Out",
        effectDescription: "Unlocks last buyables",
        done() { return player.DO.total.gte(200) },
		},
},
	layerShown(){ let boost = Decimal.mul(challengeCompletions("BT", 11))
		return (hasChallenge("BT", 11) || player[this.layer].unlocked)
		},
		update(diff) {
			if (hasUpgrade("BAB",13)||(!inChallenge("CLG", 12))){ 
				if (player.DO.points.gte(tmp.DO.buyables[23].cost))player.DO.buyables[23] = player.DO.buyables[23].add(player.DO.points.add(1).log(400).div(player.DO.buyables[23].add(1)).mul(1.5)).min(tmp.DO.buyables[23].purchaseLimit).max(0)
				if (player.DO.points.gte(tmp.DO.buyables[22].cost))player.DO.buyables[22] = player.DO.buyables[22].add(player.DO.points.add(1).log(200).div(player.DO.buyables[22].add(1))).min(tmp.DO.buyables[22].purchaseLimit).max(0)
				if (player.DO.points.gte(tmp.DO.buyables[21].cost))player.DO.buyables[21] = player.DO.buyables[21].add(player.DO.points.add(1).log(10).div(player.DO.buyables[21].add(1))).min(tmp.DO.buyables[21].purchaseLimit).max(0)
				if (player.DO.points.gte(tmp.DO.buyables[13].cost))player.DO.buyables[13] = player.DO.buyables[13].add(player.DO.points.add(1).log(10).div(player.DO.buyables[13].add(1)).mul(1.5)).min(tmp.DO.buyables[13].purchaseLimit).max(0)
				if (player.DO.points.gte(tmp.DO.buyables[12].cost))player.DO.buyables[12] = player.DO.buyables[12].add(player.DO.points.add(1).log(2).div(player.DO.buyables[12].add(1)).mul(1.5)).min(tmp.DO.buyables[12].purchaseLimit).max(0)
					if (player.DO.points.gte(tmp.DO.buyables[12].cost)&&!(hasChallenge("CLG",12)))player.DO.buyables[11] = player.DO.points.add(1).log(player.DO.buyables[11].add(2)).mul(buyableEffect("DO", 12)).mul((hasUpgrade("DO", 12))?1.5:1).min(tmp.DO.buyables[11].purchaseLimit).max(0)
				if (player.DO.points.gte(tmp.DO.buyables[12].cost)&&(hasChallenge("CLG",12))) player.DO.buyables[11]=player.DO.points.add(1).log(1.05).pow(1/new Decimal(challengeEffect("CLG",12)/1500).min(0.275).add(1)).add(1).floor()
			}
		},
			doReset(resettingLayer) {
				if(layers[resettingLayer].row > this.row) {
					layerDataReset(this.layer,hasMilestone("BAB",14)?["upgrades"]:[])
				}
			},
})

addLayer("BAB", {
    name: "Base After Base", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "BAB", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: -1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
		best: new Decimal(0),
		megaeff: new Decimal(1),
		total: new Decimal(0),
		energy: new Decimal(0),
		one: new Decimal(10),
		auto: false,
		pseudoUpgs: [],
    }},
    color: "orange",
    requires: new Decimal(5.34e18), // Can be a function that takes requirement increases into account
    resource: "Base After Base",
	branches: ["BT", "DO"],
	effectDescription() {
		return "<br>You have " + format(player.BAB.energy) + " Base Energy"+(hasUpgrade("SM",41)?", that boosts stars gain by "+format(tmp.BAB.energyEff)+". ":". ")+ "(+"+format(tmp.BAB.energyGain)+"/s, based on Total Base after Base).<br>"
	},
    baseResource: "Stars",	// Name of resource prestige is based on
    baseAmount() {return player.points},	// Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.43, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
	energyGain() {
		let gain = new Decimal(0)
		if (player.BAB.best.gte(1)) gain = gain.add(player.BAB.total.add(1).mul(12.75).pow(0.75))
		if (hasUpgrade("SM",41)) gain = gain.mul(upgradeEffect("SM",41))
		return gain
	},
	energyEff() {
		let eff = new Decimal(0)
		eff=player.BAB.energy.add(1).log2().mul(5).pow(1.17)
		if (hasUpgrade("SM",44)) eff = eff.mul(upgradeEffect("SM",44))
		return eff
	},
	row: 2, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "shift+b", description: "Shift+B: Reset for BAB", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
	upgrades: {
		11: {
			title: "Complete 10%",
			description: "Remove the hardcap of <b>Complete 15% SM</b> upgrade, but weaken its formula.",
			cost: new Decimal(3),
			pseudoCost: new Decimal(100),
			unlocked() {
 return player[this.layer].pseudoUpgs.includes(Number(this.id))
		},
		            pseudoUnl() {
                return (hasMilestone("BAB", 13))
            },
            pseudoReq() {return "To unlock this upgrade, get "+format(this.pseudoCost)+" Base Energy."},
            pseudoCan() {
                return player.BAB.energy.gte(100)
            },
	},
			12: {
			title: "Complete 20%",
			description: "Change the formula of <b>Complete 30% BT</b> upgrade.",
			pseudoCost: new Decimal(3650),
			cost: new Decimal(4),
			unlocked() {
 return player[this.layer].pseudoUpgs.includes(Number(this.id))
		},
		            pseudoUnl() {
                return (hasMilestone("BAB", 13))
            },
            pseudoReq() {return "To unlock this upgrade, get "+format(this.pseudoCost)+" Base Energy and 1e24 Stereo Madness."},
            pseudoCan() {
                return player.BAB.energy.gte(3700) && player.SM.points.gte(1e24)
            },
	},
				13: {
			title: "Complete 40%",
			description: "Passively generate 100% of Dry Out and auto-buy Dry Out buyables.",
			pseudoCost: new Decimal(13.75e3),
			cost: new Decimal(8),
			unlocked() {
 return player[this.layer].pseudoUpgs.includes(Number(this.id))
		},
		            pseudoUnl() {
                return (hasMilestone("BAB", 13))
            },
            pseudoReq() {return "To unlock this upgrade, get "+format(this.pseudoCost)+" Base Energy."},
            pseudoCan() {
                return player.BAB.energy.gte(13.75e3)
            },
	},
					14: {
			title: "Complete 60%",
			description() {return (inChallenge("CLG",13)?"<b>Stars</b>":"<b>Stereo Madness</b>")+" affects Stars gain."},
			pseudoCost: new Decimal(1.1785e6),
			cost: new Decimal(500),
			effect() {let eff = new Decimal(1)
				eff=(inChallenge("CLG",13)?player.points.add(1).log2().add(1).pow(3.5).mul(2):player.SM.points.add(1).log2().add(1).log2().add(1).pow(3.5).mul(2))
				return eff
				},
				effectDisplay() {return format(upgradeEffect("BAB", 14)) + "x"},
			unlocked() {
 return player[this.layer].pseudoUpgs.includes(Number(this.id))
		},
		            pseudoUnl() {
                return (hasMilestone("BAB", 13))
            },
            pseudoReq() {return "To unlock this upgrade, get "+format(this.pseudoCost)+" Base Energy."},
            pseudoCan() {
                return player.BAB.energy.gte(1.1785e6)
            },
	},
	},
		tabFormat: {
        "Main": {
        content:[
            function() {if (player.tab == "BAB") return "main-display"},
            "prestige-button",
            function() {if (player.tab == "BAB") return "resource-display"},
            "blank",
            "upgrades"
            ]
        },
        "Milestones": {
            content:[
                function() {if (player.tab == "BAB") return "main-display"},
            function() {if (player.tab == "BAB") return "resource-display"},
            "prestige-button",
            "blank",
                "milestones"
            ],
        },
    },
	milestones: {
		11: {
			        requirementDescription: "1 Total Base After Base",
        effectDescription: "Keep BT/DO upgrades on reset and 2.00x DO gain",
        done() { return player.BAB.total.gte(1) },
	},
			12: {
			        requirementDescription: "2 Total Base After Base",
        effectDescription: "Automate SM upgrades",
        done() { return player.BAB.total.gte(2) },
	},
				13: {
			        requirementDescription: "3 Total Base After Base",
        effectDescription: "Unlock a row of upgrades",
        done() { return player.BAB.total.gte(3) },
	},
	14: {
		requirementDescription: "7.89e32 Stereo Madness",
effectDescription: "Keep Dry Out Buyables, Back On Track Upgrades on row 3 reset",
done() { return player.SM.points.gte(7.89e32) },
},
15: {
	requirementDescription: "30 Total Base After Base",
effectDescription: "Unlock a new row of upgrades in 1st row layer.",
done() { return player.BAB.total.gte(30) },
},
	},	layerShown(){ let boost = Decimal.mul(challengeCompletions("BT", 11))
		return (hasChallenge("BT", 11) || player[this.layer].unlocked)
		},
		update(diff) {
		return player.BAB.energy = player.BAB.energy.add(tmp.BAB.energyGain.times(diff))
		},
	doReset(l) {
		if (l=="BAB") {return;}
		},
})
addLayer("CLG", {
    name: "Cant Let Go", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "CLG", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: -2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
		best: new Decimal(0),
		megaeff: new Decimal(1),
		total: new Decimal(1),
		auto: false,
    }},
    color: "yellow",
    requires: new Decimal(2.74e23), // Can be a function that takes requirement increases into account
    resource: "Can't Let Go",
	branches: ["BT","DO"],
    baseResource: "Stars",	// Name of resource prestige is based on
    baseAmount() {return player.points},	// Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.43, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "c", description: "c: Reset for CLG", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
	upgrades: {
		11: {
			title: "Complete 10%",
			description: "Unlock a challenge",
			cost: new Decimal(2),
		},
		12: {
			title: "Complete 25%",
			description: "Unlock a challenge",
			cost: new Decimal(100),
		},
		13: {
			title: "Complete 45%",
			description: "Unlock a challenge",
			cost: new Decimal(3.5785e6),
		},
	},
		tabFormat: {
        "Challenge Unlocks": {
        content:[
            function() {if (player.tab == "CLG") return "main-display"},
            "prestige-button",
            function() {if (player.tab == "CLG") return "resource-display"},
            "blank",
            "upgrades"
            ]
        },
		        "Milestones": {
            content:[
                function() {if (player.tab == "CLG") return "main-display"},
            function() {if (player.tab == "CLG") return "resource-display"},
            "prestige-button",
            "blank",
                "challenges"
            ],
        },
    },
	challenges: {
		11: {
			softcapStart() {
				let eff = new Decimal(1e9)
				return eff
			},
				name: "Buff The Difficulty",
				challengeDescription() { 
				let lim = this.completionLimit;
				return "<b>15% Completed SM</b> is disabled, <b>Complete 15% DO Buyable</b> is raised by ^0.65. <br> Completions: " + format(challengeCompletions(this.layer, 11)) + " / " + format(lim)
				},
				  rewardEffect() {
                let power = new Decimal(1)
				power=player.CLG.total.add(1).pow(0.675).mul(2)
                return 	softcap(power,this.softcapStart(),0.15)
            },
				unlocked() { return (hasUpgrade("CLG", 11)) },
				goal() { let comps = new Decimal(1e20).pow(challengeCompletions(this.layer, 11)+1)
					return comps
},
				currencyDisplayName: " Stereo Madness",
				currencyInternalName: "points",
				currencyLayer:"SM",
				rewardDescription() {
					return "Boosts <b>15% Completed SM</b> based on Can't Let Go.<br>Currently: "+format(this.rewardEffect())+"x"
	},
				effectDescription() {return format(this.effect)+"x"}
},
12: {
	name: "Buff The Difficulty II",
	softcapStart() {
		let eff = new Decimal(200)
		return eff
	},
	softcap2Start() {
		let eff = new Decimal(500)
		return eff
	},
	challengeDescription() { 
	let lim = this.completionLimit;
	return "<b>15% Completed SM</b> is disabled, <b>All DO Buyables</b> are disabled, Stereo Madness gain is raised by ^0.15. <br> Completions: " + format(challengeCompletions(this.layer, 12)) + " / " + format(lim)
	},
	  rewardEffect() {
	let eff = new Decimal(1)
	eff=player.CLG.total.add(1).pow(0.65).floor()
	eff=softcap(eff,this.softcapStart(),0.15)
	return softcap(eff,this.softcap2Start(),0.1)
},
	unlocked() { return (hasUpgrade("CLG", 12)) },
	goal() { let comps = new Decimal(5e12).pow(challengeCompletions(this.layer, 12)+1)
		return comps
},
	currencyDisplayName: " Stereo Madness",
	currencyInternalName: "points",
	currencyLayer:"SM",
	rewardDescription() {
		return "Increase the limit of <b>Complete 15% DO Buyable</b> based on Can't Let Go, but its cost is also boosted by this effect.<br>Currently: +"+format(this.rewardEffect())
},
	effectDescription() {return format(this.effect)+"x"}
},
13: {
	onEnter() {
		player.SM.points = new Decimal(1)
	},
	name: "No Stereo Madness",
	challengeDescription() { 
	let lim = this.completionLimit;
	return "Stereo Madness gain is disabled, but <b>Complete 60% BAB</b> upgrade is changed. <br> Completions: " + format(challengeCompletions(this.layer, 13)) + " / " + format(lim)
	},
	unlocked() { return (hasUpgrade("CLG", 13)) },
	goal() { let comps = new Decimal(1e20).pow(challengeCompletions(this.layer, 13)+1)
		return comps
},
	currencyDisplayName: " Stars",
	currencyInternalName: "points",
	rewardDescription() {
		return "Unlock a new column of Stereo Madness upgrades, and remove a hardcap from <b>25% Completed PG</b> upgrade.<br>"
},
	effectDescription() {return format(this.effect)+"x"}
},
	},
	milestones: {
	},	layerShown(){
		return (hasMilestone("BAB", 11) || player[this.layer].unlocked)
		},
		doReset() {},
})
addLayer("JMP", {
    name: "Jumper", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "JMP", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
		best: new Decimal(0),
		megaeff: new Decimal(1),
		total: new Decimal(1),
		auto: false,
    }},
    color: "darkyellow",
    requires: new Decimal(3.89e76), // Can be a function that takes requirement increases into account
    resource: "Base After Base",
	branches: ["DO","BT"],
    baseResource: "Stars",	// Name of resource prestige is based on
    baseAmount() {return player.points},	// Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.43, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "c", description: "c: Reset for CLG", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
	upgrades: {
	},
		tabFormat: {
        "Main": {
        content:[
            function() {if (player.tab == "JMP") return "main-display"},
            "prestige-button",
            function() {if (player.tab == "JMP") return "resource-display"},
            "blank",
            "upgrades"
            ]
        },
        "Buyables": {
            content:[
                function() {if (player.tab == "JMP") return "main-display"},
            function() {if (player.tab == "JMP") return "resource-display"},
            "prestige-button",
            "blank",
                "buyables"
            ],
        },
		        "Milestones": {
            content:[
                function() {if (player.tab == "JMP") return "main-display"},
            function() {if (player.tab == "JMP") return "resource-display"},
            "prestige-button",
            "blank",
                "milestones"
            ],
        },
    },
	milestones: {
	},	layerShown(){ let boost = Decimal.mul(challengeCompletions("BT", 11))
		return (hasMilestone("BAB", 11) || player[this.layer].unlocked)
		},
		doReset() {},
})
addLayer("ac", {
    startData() {
        return {
            unlocked: true,
        }
    },
    color: "white",
    row: "side",
    layerShown() {
        return true
    },
    tooltip() {
        return ("Achievements")
    },
    achievements: {
        11: {
            name: "Start a journey",
            done() {
                return player.points.gt(0)
				},
	 tooltip: "Gain your first Star",
		},
		12: {
			name: "This is great!",
			done() {
				return player.SM.points.gt(99)
			},
				 tooltip: "Gain 100 Stereo Madness Reward: Unlock new level",
		},
		13: {
			name: "We'll be right back!",
			done() {
				return (hasUpgrade("BT", 21))
			},
			tooltip: "Complete 30% of Back On Track"
		},
		14: {
			name: "That was TOO LONG...",
			done() {return (challengeCompletions("BT", 11) == 2)
			},
			tooltip: "Complete <b>Speedrun</b> 2 times"
		},
				15: {
			name: "Useless? I don't think so... ",
			done() {return (hasUpgrade("BT", 23))
			},
			tooltip: "Buy <b>60% Completed</b> Reward: Stars gain is 20% faster",
			image: "achicons/15.jpg"
		},
						16: {
			name: "More Difficult? No...",
			done() {return (player.PG.unlocked)
			},
			tooltip: "Unlock Poltergeist",
			image: "achicons/16.jpg"
		},
			17: {
			name: "Here's a shiny quarter!",
			done() {return (hasUpgrade("SM", 31))
			},
			tooltip: "Buy <b>Claim 1 coin SM</b>",
			image: "achicons/17.jpg",
		},
					18: {
			name: "Craziness begins!!!",
			done() {return (hasUpgrade("PG", 21))
			},
			tooltip: "Complete <b>PG</b>",
		},
									19: {
			name: "MILESTONES time!!!",
			done() {return (hasMilestone("SM", 11))
			},
			tooltip: "Gain your first milestone in this game...",
		},
							21: {
			name: "Waiting for a new layer? It'll be soon",
			done() {return (hasMilestone("SM", 14))
			},
			tooltip: "Complete <b>last SM</b> milestone ",
			image: "achicons/21.jpg"
		},
					22: {
			name: "Another quarter!",
			done() {return (hasUpgrade("SM", 32))
			},
			tooltip: "Buy <b>Claim 2 coin SM</b>",
			image: "achicons/17.jpg",
		},
									23: {
			name: "Here you are! New Layer!",
			done() {return (player.DO.unlocked)
			},
			tooltip: "Unlock Dry Out",
		},
	},
	    tabFormat: 
		["blank", ["display-text", function() {
        return "Achievements: " + player.ac.achievements.length + "/" + (Object.keys(tmp.ac.achievements).length - 2)
    }
    ], "blank", "blank", "achievements", ],
})
            
addLayer("ST", {
    startData() {
        return {
            unlocked: true,
        }
    },
    color: "white",
    row: "side",
    layerShown() {
        return true
    },
    tooltip() {
        return ("Statistics")
    },
	    tabFormat: 
		["blank", ["display-text", function() {
			if (player.DO.unlocked) return "<h1>Layer Statistics</h1><br>Stereo Madness:  " + format(player.SM.total) + "<br> Back On Track: " + format(player.BT.total) + "<br> Polargeist: " + format(player.PG.best) + "Dry Out:  " + format(player.DO.best)
					else if (player.PG.unlocked) return "<h1>Layer Statistics</h1><br>Stereo Madness:  " + format(player.SM.total) + "<br> Back On Track: " + format(player.BT.total) + "<br> Polargeist: " + format(player.PG.total) + "<br> ??? ???:  " + " ????"
					else if (player.BT.unlocked) return "<h1>Layer Statistics</h1><br>Stereo Madness:" + " " + " " + " " + " " + " " + format(player.SM.total) + "<br> Back On Track:      " + format(player.BT.total) + "<br> ??????????:  " + " ????" + "<br> ??? ???:  " + " ????"
		else if (player.SM.unlocked) return "<h1>Layer Statistics</h1><br>Stereo Madness:  " + format(player.SM.points) + "<br> ???? ?? ?????:" + "           ????" + "<br> ??????????:   " + "    ????" + "<br> ??? ???:  " + " ????"
		}
    ]],
})