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

const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 256,
  height: 270,
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

const game = new Phaser.Game(config);

function preload() {
  this.load.image("background", background);

  this.load.spritesheet("ship", ship, {
    frameWidth: 16,
    frameHeight: 24
  });

  this.load.spritesheet("enemy1", enemy1, {
    frameWidth: 16,
    frameHeight: 16
  });
  this.load.spritesheet("enemy2", enemy2, {
    frameWidth: 32,
    frameHeight: 16
  });
  this.load.spritesheet("enemy3", enemy3, {
    frameWidth: 32,
    frameHeight: 32
  });

  this.load.spritesheet("explosion", explosion, {
    frameWidth: 16,
    frameHeight: 16
  });
}

function create() {
  this.background = this.add.tileSprite(0, 0, config.width, config.height, "background");
  this.background.setOrigin(0,0);

  this.ship = this.add.sprite(config.width / 2, config.height - 100, "ship");

  this.enemy1 = this.add.sprite(config.width/2 - 50, config.height / 2, "enemy1");
  this.enemy2 = this.add.sprite(config.width/2 - 100, config.height / 2, "enemy2");
  this.enemy3 = this.add.sprite(config.width/2 + 50, config.height / 2, "enemy3");

  this.anims.create({
    key: "enemy1_anim",
    frames: this.anims.generateFrameNumbers("enemy1"),
    frameRate: 20,
    repeat: -1
  });

  this.anims.create({
    key: "enemy2_anim",
    frames: this.anims.generateFrameNumbers("enemy2"),
    frameRate: 20,
    repeat: -1
  });

  this.anims.create({
    key: "enemy3_anim",
    frames: this.anims.generateFrameNumbers("enemy3"),
    frameRate: 20,
    repeat: -1
  });

  this.anims.create({
    key: "explode",
    frames: this.anims.generateFrameNumbers("explosion"),
    frameRate: 20,
    repeat: 0,
    hideOnComplete: true
  });

  this.enemy1.play("enemy1_anim");
  this.enemy2.play("enemy2_anim");
  this.enemy3.play("enemy3_anim");
}

function update() {
  move(this.enemy1, 1.75);
  move(this.enemy2, 1.5);
  move(this.enemy3, 1);

  this.background.tilePositionY -= 0.5;
}

function move(object, speed) {
  object.y += speed;
  if (object.y > config.height) {
    resetPos(object);
  }
}

function resetPos(object) {
  object.y = 0;
  var randomX = Phaser.Math.Between(0, config.width);
  object.x = randomX;
}


