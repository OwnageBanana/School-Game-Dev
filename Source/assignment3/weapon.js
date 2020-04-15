
//weapon class manages the player bullet mechanics
Weapon = function () {
    this.gun = new Gun();
    this.powerupKey = 0;
    this.fastKey = false;
    this.powerupTimer = 0;
    this.fastTimer = 0;

    this.guns = {
        0: single,
        1: 'fast',
        2: double,
        3: spread
    };

    this.bulletTime = 0;

    this.setPowerup = function (key) {

        if (key == 1) {
            this.fastKey = true;
            this.fastTimer = game.time.now + 30 * 1000;
        } else {
            //key is expected to be an integer
            this.powerupKey = key;
            //30 seconds.       its easier read this way
            this.powerupTimer = game.time.now + 30 * 1000;
        }
    }

    this.fireBullet = function (x, y) {

        //reset powerup
        if (this.powerupKey != 0 && this.powerupTimer < game.time.now) {
            this.powerupKey = 0;
        }

        if (this.fastKey && this.fastTimer < game.time.now) {
            this.fastKey = false;
        }

        //if the player can fire another bullet after shooting cooldown
        if (game.time.now > this.bulletTime) {
            shoot.play();
            this.guns[this.powerupKey](x, y, this.gun.playerBullets);
            //specific firing delay for fast firing mod
            if (this.fastKey && game.time.now > this.bulletTime) {

                this.bulletTime = game.time.now + 100;
            } else {
                this.bulletTime = game.time.now + 150;
            }
        }
    }
    //returns the bullets for hit detection
    this.getBullets = function () {
        return this.gun.getBullets();
    }
}

//gun defines the different types of bullet spread and manages the player bullets
Gun = function () {

    this.playerBullets = game.add.group();
    this.playerBullets.enableBody = true;
    this.playerBullets.physicsBodyType = Phaser.Physics.ARCADE;

    //prespawning bullets to draw on screen
    for (var i = 0; i < 150; i++) {
        var b = this.playerBullets.create(0, 0, 'bullet');
        b.name = 'bullet' + i;
        b.exists = false;
        b.visible = false;
        b.anchor.setTo(0.5, 0.5);
        b.checkWorldBounds = true;
        b.outOfBoundsKill = true;
    }

    this.getBullets = function () {
        return this.playerBullets;
    }
}

//single shot gun
single = function (x, y, playerBullets) {
    bullet = playerBullets.getFirstExists(false);
    if (bullet) {
        bullet.reset(x, y);
        bullet.body.velocity.y = -400;
    }
}

//double shot gun: fires in paralell
double = function (x, y, playerBullets) {

    for (i = -1; i <= 1; i = i + 2) {
        bullet = playerBullets.getFirstExists(false);

        if (bullet) {
            bullet.reset(x + 16 * i, y);
            bullet.body.velocity.y = -400;
        }
    }
}

//spread shot gun fires three bullets in a wide angle
spread = function (x, y, playerBullets) {

    bullet = playerBullets.getFirstExists(false);
    if (bullet) {
        bullet.reset(x, y);
        bullet.game.physics.arcade.velocityFromAngle(135, -400, bullet.body.velocity);
    }

    bullet = playerBullets.getFirstExists(false);
    if (bullet) {
        bullet.reset(x, y);
        bullet.game.physics.arcade.velocityFromAngle(90, -400, bullet.body.velocity);
    }

    bullet = playerBullets.getFirstExists(false);
    if (bullet) {
        bullet.reset(x, y);
        bullet.game.physics.arcade.velocityFromAngle(45, -400, bullet.body.velocity);
    }
}


//spread shot gun fires 6 bullets in a wide angle, the strongest combo of double and spread
doubleSpread = function (x, y, playerBullets) {

    bullet = playerBullets.getFirstExists(false);
    if (bullet) {
        bullet.reset(x, y);
        bullet.game.physics.arcade.velocityFromAngle(135, -400, bullet.body.velocity);
    }
    bullet = playerBullets.getFirstExists(false);
    if (bullet) {
        bullet.reset(x, y);
        bullet.game.physics.arcade.velocityFromAngle(112, -400, bullet.body.velocity);
    }

    bullet = playerBullets.getFirstExists(false);
    if (bullet) {
        bullet.reset(x, y);
        bullet.game.physics.arcade.velocityFromAngle(90, -400, bullet.body.velocity);
    }

    bullet = playerBullets.getFirstExists(false);
    if (bullet) {
        bullet.reset(x + 5, y);
        bullet.game.physics.arcade.velocityFromAngle(90, -400, bullet.body.velocity);
    }

    bullet = playerBullets.getFirstExists(false);
    if (bullet) {
        bullet.reset(x, y);
        bullet.game.physics.arcade.velocityFromAngle(45, -400, bullet.body.velocity);
    }

    bullet = playerBullets.getFirstExists(false);
    if (bullet) {
        bullet.reset(x, y);
        bullet.game.physics.arcade.velocityFromAngle(45, -400, bullet.body.velocity);
    }
}


