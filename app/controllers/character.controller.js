const db = require("../models");
const Character = db.character;

exports.add = (req, res) => {
    let attack  = req.body.attack
    let defense = req.body.defense
    let speed   = req.body.speed
    let trueatk = parseInt(attack)
    let truedef = parseInt(defense)
    let truespd = parseInt(speed)

    let avg     = (trueatk + truedef + truespd)/3
    avg  = Math.trunc(avg * Math.pow(10, 2))/Math.pow(10, 2)
      
    let recommended = 'Fighter'
    if ((attack === defense) && (attack != speed)) {
        recommended = 'Paladin'
    }
    if ((attack === speed) && (attack != defense)) {
        recommended = 'Ranger'
    }
    if ((defense === speed) && (attack != defense)) {
        recommended = 'Monk'
    }
    if ((truedef > trueatk) && (truedef > truespd)) {
        recommended = 'Tank'
    }
    if ((trueatk > truespd) && (trueatk > truedef)) {
        recommended = 'Barbarian'
    }
    if ((truespd > trueatk) && (truespd > truedef)) {
        recommended = 'Rogue'
    }
      
    
    const character = new Character({
        name: req.body.name,
        attack: req.body.attack,
        defense: req.body.defense,
        speed: req.body.speed,
        average: avg,
        recommended: recommended,
        username: req.body.username
    });

    Character.findOneAndDelete({ name: req.body.name }).then (function(doc) {
        character.save({character}).then((character) => {
            res.send({ message: "Character added successfully!" });
            return;
        }).catch((err) => {
            res.status(500).send({ message: err });
            return;
        });
    }).catch((err) => {
        response.status(500).send({ message: err });
        return;
    });
    
};

exports.delete = (req, res) => {
    Character.findOneAndDelete({ name: req.body.name }).then (function(character) {
        res.status(200).send({ message: "Character deleted" });
        return;
    }).catch((err) => {
        response.status(500).send({ message: err });
        return;
    });
};

exports.getCharacters = (req, res) => {
    Character.find({ username: req.body.username }).then (function (character) { 

        res.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
        const jsonContent = JSON.stringify(character);
        res.end(jsonContent)
        return;
    }).catch((err) => {
        res.status(500).send({ message: err });
        return;
    });
};