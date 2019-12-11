// import phaser
import Phaser from "phaser";

// import assets
import background from "./assets/background.png";
import starfield from "./assets/starfield.png";
import ship from "./assets/ship.png";
import enemy1 from "./assets/enemy.png";
import enemy2 from "./assets/enemy2.png";
import enemy3 from "./assets/enemy3.png";
import explosion from "./assets/explosion.png";
import powerup from "./assets/power-up.png";
import lasers from "./assets/laser-bolts.png";

import fontImage from "./assets/font/font.png";
import fontXML from "./assets/font/font.xml";

import audioLaser from "./assets/sounds/beam.mp3";
import audioExplosion from "./assets/sounds/explosion.mp3";
import audioPickup from "./assets/sounds/pickup.mp3";

// game settings
const gameSettings = {
  playerSpeed: 100
};

// config
const config = {
  type: Phaser.AUTO,
  pixelArt: true,
  parent: "phaser-example",
  width: 256,
  height: 270,
  scene: {
    preload: preload,
    create: create,
    update: update
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  }
};

// Laser class
class Laser extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, "laser");
        scene.add.existing(this);
        scene.projectiles.add(this);

        this.play("laser_anim");
        scene.physics.world.enableBody(this);
        this.body.velocity.y = -250;
    }
    update() {
      if (this.y < 32) {
        this.destroy();
      }
    }
}

// pass config into new Phaser instance
const game = new Phaser.Game(config);

// preload assets
function preload() {
  // load images and sprites
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
  this.load.spritesheet("powerup", powerup, {
    frameWidth: 16,
    frameHeight: 16
  });
  this.load.spritesheet("laser", lasers, {
    frameWidth: 16,
    frameHeight: 16
  });
  this.load.spritesheet("explosion", explosion, {
    frameWidth: 16,
    frameHeight: 16
  });

  // load font
  this.load.bitmapFont("pixelFont",fontImage,fontXML);

  // load sounds
  this.load.audio('laserSound', audioLaser);
  this.load.audio('explosionSound', audioExplosion);
  this.load.audio('pickupSound', audioPickup);
}

function create() {
  // add background tile
  this.background = this.add.tileSprite(0, 0, config.width, config.height, "background");
  this.background.setOrigin(0,0);

  // add animations
  this.anims.create({
    key: "enemy1_anim",
    frames: this.anims.generateFrameNumbers("enemy1"),
    frameRate: 8,
    repeat: -1
  });
  this.anims.create({
    key: "enemy2_anim",
    frames: this.anims.generateFrameNumbers("enemy2"),
    frameRate: 8,
    repeat: -1
  });
  this.anims.create({
    key: "enemy3_anim",
    frames: this.anims.generateFrameNumbers("enemy3"),
    frameRate: 8,
    repeat: -1
  });
  this.anims.create({
    key: "redpowerup",
    frames: this.anims.generateFrameNumbers("powerup", {
      start: 0,
      end: 1
    }),
    frameRate: 1,
    repeat: -1,
  });
  this.anims.create({
    key: "greypowerup",
    frames: this.anims.generateFrameNumbers("powerup", {
      start: 2,
      end: 3
    }),
    frameRate: 1.1,
    repeat: -1,
  });
  this.anims.create({
    key: "explode",
    frames: this.anims.generateFrameNumbers("explosion"),
    frameRate: 20,
    repeat: 0,
    hideOnComplete: true
  });
  this.anims.create({
    key: "thrust",
    frames: this.anims.generateFrameNumbers("ship"),
    framerate: 1,
    repeat: -1
  });
  this.anims.create({
    key: "laser_anim",
    frames: this.anims.generateFrameNumbers("laser", {
      start: 2,
      end: 3
    }),
    framerate: 4,
    repeat: -1
  });

  // add player
  this.ship = this.physics.add.sprite(config.width / 2, config.height - 32, "ship");
  this.ship.setCollideWorldBounds(true);
  this.ship.play("thrust");
  // add player input
  this.cursorKeys = this.input.keyboard.createCursorKeys();

  // add enemies
  this.enemy1 = this.add.sprite(config.width/2 - 50, config.height / 2, "enemy1");
  this.enemy2 = this.add.sprite(config.width/2 - 100, config.height / 2, "enemy2");
  this.enemy3 = this.add.sprite(config.width/2 + 50, config.height / 2, "enemy3");
  this.enemies = this.physics.add.group();
  this.enemies.add(this.enemy1);
  this.enemies.add(this.enemy2);
  this.enemies.add(this.enemy3);
  // add enemy animations
  this.enemy1.play("enemy1_anim");
  this.enemy2.play("enemy2_anim");
  this.enemy3.play("enemy3_anim");
  // make enemies interactive
  this.enemy1.setInteractive();
  this.enemy2.setInteractive();
  this.enemy3.setInteractive();


  // add powerups
  this.powerups = this.physics.add.group();
  let maxPowerups = 4;
  for (let i = 0; i <= maxPowerups; i++) {
    let powerup = this.physics.add.sprite(16,16, "powerup");
    this.powerups.add(powerup);
    powerup.setRandomPosition(0, 0, game.config.width, game.config.height);
    // add powerup animations
    if (Math.random() > 0.5) {
      powerup.play("redpowerup");
    } else {
      powerup.play("greypowerup");
    }
    // set velocity
    powerup.setVelocity(50,50);
    powerup.setCollideWorldBounds(true);
    powerup.setBounce(1);
  }

  // add score label
  const graphics = this.add.graphics();
  graphics.fillStyle(0x000000, 1);
  graphics.beginPath();
  graphics.moveTo(0,0);
  graphics.lineTo(config.width, 0);
  graphics.lineTo(config.width, 20);
  graphics.lineTo(0,20);
  graphics.lineTo(0,0);
  graphics.closePath();
  graphics.fillPath();
  this.score = 0;
  this.scoreLabel = this.add.bitmapText(10,5,"pixelFont", "SCORE 000000", 16);

  // add sound
  this.laserSound = this.sound.add('laserSound');
  this.explosionSound = this.sound.add('explosionSound');
  this.pickupSound = this.sound.add('pickupSound');


  // shoot
  this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  this.projectiles = this.add.group();

  // bounce powerups and destroy laser when a powerup is shot
  this.physics.add.collider(this.projectiles, this.powerups, function(projectile, powerup) {
    projectile.destroy();
  });

  // pickup powerups on contact with ship
  this.physics.add.overlap(this.ship, this.powerups, pickupPowerup, null, this);

  // deal damage and destroy enemies on contact
  this.physics.add.overlap(this.ship, this.enemies, damageShip, null, this);

  // kill enemy when shot
  this.physics.add.overlap(this.projectiles, this.enemies, hitEnemy, null, this);
}

function update() {
  // move background
  this.background.tilePositionY -= 0.5;

  // move enemeies
  move(this.enemy1, 1.75);
  move(this.enemy2, 1.5);
  move(this.enemy3, 1);

  // move player
  if(this.cursorKeys.left.isDown) {
    this.ship.setVelocityX(-gameSettings.playerSpeed);
  } else if (this.cursorKeys.right.isDown) {
    this.ship.setVelocityX(gameSettings.playerSpeed);
  }
  if(this.cursorKeys.up.isDown) {
    this.ship.setVelocityY(-gameSettings.playerSpeed);
  } else if (this.cursorKeys.down.isDown) {
    this.ship.setVelocityY(gameSettings.playerSpeed);
  }

  // shoot
  if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
    if (this.ship.active) {
      let laser = new Laser(this, this.ship.x, this.ship.y - 8);
      this.laserSound.play();
    }
  }
  for(let i = 0; i < this.projectiles.getChildren().length; i++) {
    let laser = this.projectiles.getChildren()[i];
    laser.update();
  }
}

// move object by updating Y velocity
function move(object, speed) {
  object.y += speed;
  if (object.y > config.height) {
    resetPos(object);
  }
}

// reset object position to
function resetPos(object) {
  object.y = 0;
  let randomX = Phaser.Math.Between(0, config.width);
  object.x = randomX;
}

// add explosion sprite
function explode(enemy) {
  enemy.setTexture("explosion");
  enemy.play("explode");
}

// pickup powerups
function pickupPowerup(ship, powerup) {
  this.pickupSound.play();
  powerup.disableBody(true, true);
}

function updateScore() {
  let scoreFormatted = this.zero(this.score, 6);
  this.scoreLabel.text = "SCORE " + scoreFormatted;
}

// deal damage
function damageShip(ship, enemy) {
  if (ship.alpha == 1) {
    explode(ship);
    this.explosionSound.play();
    ship.x = config.width/2 - 8;
    ship.y = config.height - 32;
    ship.disableBody(true, true);
    this.score = 0;
    this.scoreLabel.text = "SCORE 000000";
  }
  resetPos(enemy);
  setTimeout(function() {
    ship.enableBody(true, ship.x, ship.y, true, true);
    ship.play("thrust");
    ship.alpha = 0.5;
    setTimeout(function() {
      ship.alpha = 1;
    }, 1000);
  }, 200);
  let scoreFormatted = zero(this.score, 6);
  
}

// hit enemy
function hitEnemy(projectile, enemy) {
  projectile.body.velocity.y = 0;
  explode(projectile);
  setTimeout(function() { projectile.destroy() }, 500);
  this.explosionSound.play();
  resetPos(enemy);
  this.score += 15;
  let scoreFormatted = zero(this.score, 6);
  this.scoreLabel.text = "SCORE " + scoreFormatted;
}

// add zeroes to score label
function zero(number, size) {
  let stringNumber = String(number);
  while (stringNumber.length < (size || 2)) {
    stringNumber = "0" + stringNumber;
  }
  return stringNumber;
}


