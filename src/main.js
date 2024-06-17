// Isaac Kim
// Created 6/15/24
// Phaser: 3.70.0
//

// debug with extreme prejudice
"use strict"

// game config
let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    render: {
        pixelArt: true  // prevent pixel art from getting blurred when scaled
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: {
                x: 0,
                y: 0
            }
        }
    },
    width: 1440,
    height: 900,
    scene: [Load, MainMenu, LevelOne, TextOverlay]
}

var cursors;
var playerScore = 0;
var my = {sprite: {}, text: {}, vfx: {}};

const game = new Phaser.Game(config);