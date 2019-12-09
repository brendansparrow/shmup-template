import Phaser from "phaser";

import background from "./assets/background.png";
import starfield from "./assets/starfield.png";
import ship from "./assets/ship.png";
import enemy1 from "./assets/enemy.png";
import enemy2 from "./assets/enemy2.png";
import enemy3 from "./assets/enemy3.png";
import explosion from "./assets/explosion.png";
import powerup from "./assets/power-up.png";
import lasers from "./assets/laser-bolts.png";

// import Boot from "./scenes/Boot.js";
// import Play from "./scenes/Play.js";

const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 256,
  height: 270,
  scene: {
    preload: preload,
    create: create,
  }
};

const game = new Phaser.Game(config);

function preload() {
  this.load.image("background", background);
  this.load.image("ship", ship);
  this.load.image("enemy1", enemy1);
  this.load.image("enemy2", enemy2);
  this.load.image("enemy3", enemy3);
}

function create() {
  this.background = this.add.image(0,0,"background");
  this.background.setOrigin(0,0);

  this.ship = this.add.image(config.width / 2, config.height - 100, "ship");

  this.enemy1 = this.add.image(config.width/2 - 50, config.height / 2, "enemy1");
  this.enemy2 = this.add.image(config.width/2 - 100, config.height / 2, "enemy2");
  this.enemy3 = this.add.image(config.width/2 + 50, config.height / 2, "enemy3");
}

function update() {
  this.move(enemy1, 1);
  this.move(enemy2, 2);
  this.move(enemy3, 3);
}

function move(object, speed) {
  object.y += speed;
  if (object.y > config.height) {
    this.resetPos(object);
  }
}

function resetPos(object) {
  object.y = 0;
  var randomX = Phaser.Math.Between(0, config.width);
  object.x = randomX;
}


