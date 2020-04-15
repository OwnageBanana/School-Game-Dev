

function Helicopter() {
    //variables defineing some basic rules for the boss
    this.hitPoints = 200;
    this.velocity = 300;
    this.points = 300000;

    /*bullet variables*/
    this.shootCooldown = 0;
    this.burstCooldown = 0;
    this.shots = 0;

    this.alive = true;

    /**spawn variables */
    //setting spawn to now +2000 because the boss is initalized at the end of level 3 and will do a spawn animation first
    this.spawning = true;
    this.spawnTimer = game.time.now + 2000;
    //time to pause at a waypoint once arrived at it
    this.waypointPause = game.time.now;
    this.waiting = false;
    //inital waypoint for spawning
    this.waypoint = { x: game.rnd.integerInRange(100, 500), y: game.rnd.integerInRange(100, 800) };

    /**boss init */
    //initalizing the bosssprite and animation
    this.boss = game.add.sprite(320, -100, 'helicopter');
    this.boss.anchor.setTo(0.5, 0.5);
    this.boss.animations.add('fly', [0, 1], 20, true);
    this.boss.play('fly');
    game.physics.enable(this.boss, Phaser.Physics.ARCADE);
    //have it face the right way
    this.boss.angle -= 90;


    /**boss bullets init */
    //initalizing the boss's bullets
    this.bullets = game.add.group();
    this.bullets.enableBody = true;
    this.bullets.physicsBodyType = Phaser.Physics.ARCADE;

    for (var i = 0; i < 20; i++) {
        var b = this.bullets.create(0, 0, 'enemy_bullet');
        b.name = 'bullet' + i;
        b.exists = false;
        b.visible = false;
        b.anchor.setTo(0.5, 0.5);
        b.checkWorldBounds = true;
        b.outOfBoundsKill = true;
    }


    //spawn function to animate the helicopter coming into the map.
    this.spawn = function () {

        this.boss.angle = 180;
        this.boss.body.velocity.y = 100;
        if (this.spawnTimer < game.time.now)
            this.spawning = false;
    }

    //update function manages the movement and calling the shoot function.
    this.update = function (px, py) {
        this.boss.body.velocity.x = 0
        this.boss.body.velocity.y = 0
        //while spawning do the spawn animation
        if (this.spawning) {
            this.spawn();
            return;
        }

        this.shoot(px, py);

        //boss rotation
        //always face the player
        this.boss.rotation = game.physics.arcade.angleToXY(this.boss, px, py);
        this.boss.angle += 90;

        //if not waiting at a waypoint start moving
        if (!this.waiting) {
            game.physics.arcade.accelerateToXY(this.boss, this.waypoint.x, this.waypoint.y, this.velocity, this.velocity, this.velocity);
            this.boss.body.velocity.x = this.boss.body.acceleration.x;
            this.boss.body.velocity.y = this.boss.body.acceleration.y;
        }
        //if waiting, but it is time to move, set a waypoint and start moving
        else if (this.waypointPause < game.time.now) {
            this.waypoint = { x: game.rnd.integerInRange(50, 550), y: game.rnd.integerInRange(50, 750) };
            this.waiting = false;
        }
        if (!this.waiting) {
            if (this.boss.x - 50 < this.waypoint.x && this.boss.x + 50 > this.waypoint.x) {
                if (this.boss.y - 50 < this.waypoint.y && this.boss.y + 50 > this.waypoint.y) {
                    this.waiting = true;
                    this.waypointPause = game.time.now + 1000;
                }
            }
        }
    }

    //shooting function has the helicopter shoot in bursts of 10 bullets
    this.shoot = function (px, py) {

        //if there are no cool downs to wait for
        if (this.shootCooldown < game.time.now && this.burstCooldown < game.time.now) {
            //get a bullet
            bullet = this.bullets.getFirstExists(false);
            //make sure the bullet exists
            if (bullet) {
                bullet.reset(this.boss.x, this.boss.y);
                //accelerate the bullet towards the player
                game.physics.arcade.accelerateToXY(bullet, px, py, 400, 400, 400);
                bullet.body.velocity.x = bullet.body.acceleration.x;
                bullet.body.velocity.y = bullet.body.acceleration.y;

                //manager cooldowns with variables for shot and burst
                this.shootCooldown = game.time.now + 150;
                this.shots += 1;
                if (this.shots >= 10) {
                    this.burstCooldown = game.time.now + 4000;
                    this.shots = 0;
                }
            }
        }
    }

    //checks collions of boss against other things using provided function
    this.checkCollision = function (collider, collisionFunction) {
        game.physics.arcade.overlap(collider, this.boss, collisionFunction, null, this);
    };

    //checks boss's bullets against other things using provided function
    this.checkBulletCollision = function (collider, collisionFunction) {
        game.physics.arcade.overlap(collider, this.bullets, collisionFunction, null, this);
    };

    //kill function cleans up the boss object
    this.kill = function () {
        this.boss.destroy();
        this.bullets.destroy()
    }

    //getters and setters
    this.getBullets = function () {
        return this.bullets;
    }
    this.removeHitpoint = function () {
        this.hitPoints -= 1;
    }
    this.getHitpoints = function () {
        return this.hitPoints;
    }

    this.getPoints = function () {
        return this.points;
    }

}


//second boss, gunship which is multiple parts and has various firing patterns
function Gunship() {
    //variables defining some basic rules for the boss
    this.hitPoints = 1200;
    this.points = 500000;

    /*bullet variables*/
    this.shootCooldown = 0;
    this.burstCooldown = 0;
    this.shots = 0;
    this.alive = true;
    this.shotPatterns = [
        { name: 'waypoints', gunFunc: waypoint, cannonFunc: waypoint },
        { name: 'weaving', gunFunc: weaving, cannonFunc: playerDirected },
        { name: 'direct', gunFunc: playerDirected, cannonFunc: playerDirected }
    ];
    this.shotPattern = 0;
    this.gunXPositions = [30, 120, 230, 290, 415];

    /**boss init */
    this.bossGroup = game.add.group();
    this.bossGroup.x = 60;
    this.bossGroup.y = -200;

    this.ship = this.bossGroup.create(0, 0, 'gunship');
    game.physics.enable(this.ship, Phaser.Physics.ARCADE);

    this.guns = game.add.group(this.ship);
    for (var i = 0; i < 5; i++) {
        var g = this.guns.create(this.gunXPositions[i], 60, 'gunship_gun');
        g.name = 'gun' + i;
        g.exists = true;
        g.visible = true;
        g.anchor.setTo(0.5, 0.5);
        g.waypoint = { x: game.rnd.integerInRange(0, 640), y: game.rnd.integerInRange(300, 800) };

    }
    //cannon fires large bullets to shoot at player
    this.cannon = game.add.group(this.ship);
    var c = this.guns.create(350, 62, 'gunship_gun');
    c.name = 'cannon';
    c.exists = true;
    c.visible = true;
    c.scale.x = 2;
    c.scale.y = 2;
    c.anchor.setTo(0.5, 0.5);
    c.waypoint = { x: game.rnd.integerInRange(0, 640), y: game.rnd.integerInRange(300, 800) };


    /**spawn variables */
    //setting spawn to now +2500 because the boss is initalized at the end of level 3 and will do a spawn animation first
    this.spawning = true;
    this.spawnTimer = game.time.now + 2500;
    //time to pause at a waypoint once arrived at it

    /**boss bullets init */
    //initalizing the boss's bullets
    this.bullets = game.add.group(this.ship);
    this.bullets.enableBody = true;
    this.bullets.physicsBodyType = Phaser.Physics.ARCADE;

    for (var i = 0; i < 200; i++) {
        var b = this.bullets.create(0, 0, 'enemy_bullet');
        b.name = 'bullet' + i;
        b.exists = false;
        b.visible = false;
        b.anchor.setTo(0.5, 0.5);
        b.checkWorldBounds = true;
        b.outOfBoundsKill = true;
    }

    //initalizing the boss's cannon bullets to use
    this.cannonBullets = game.add.group(this.ship);
    this.cannonBullets.enableBody = true;
    this.cannonBullets.physicsBodyType = Phaser.Physics.ARCADE;

    for (var i = 0; i < 40; i++) {
        var b = this.cannonBullets.create(0, 0, 'enemy_bullet');
        b.name = 'bullet' + i;
        b.exists = false;
        b.visible = false;
        b.anchor.setTo(0.5, 0.5);
        b.scale.x = 2;
        b.scale.y = 2;
        b.checkWorldBounds = true;
        b.outOfBoundsKill = true;
    }

    //spawn function to animate the helicopter coming into the map.
    this.spawn = function () {

        this.bossGroup.y += 2;
        if (this.spawnTimer < game.time.now)
            this.spawning = false;
    }

    //update function manages the movement and calling the shoot function.
    this.update = function (px, py) {

        //while spawning do the spawn animation
        if (this.spawning) {
            this.spawn();
            return;
        }
        //handles the majority of timing between shooting as well as time spent shooting
        this.shoot(px, py);

    }

    //shooting function has the cannons shoot in bursts of 5 bullets directly at the player
    this.shoot = function (px, py) {

        //if there are no cool downs to wait for
        if (this.shootCooldown < game.time.now && this.burstCooldown < game.time.now) {

            //foreach gun fire a bullet with the gunFunc and the cannonFunc
            this.guns.forEach(function (gun) {
                //get a bullet
                var bullet;
                if (gun.name == "cannon")
                    bullet = this.cannonBullets.getFirstExists(false);
                else
                    bullet = this.bullets.getFirstExists(false);

                //make sure the bullet exists
                if (bullet) {
                    bullet.reset(gun.x, gun.y);

                    if (gun.name == "cannon")
                        this.shotPatterns[this.shotPattern].cannonFunc(px, py, bullet, gun, 200);
                    else
                        this.shotPatterns[this.shotPattern].gunFunc(px, py, bullet, gun, 300);

                    //manager cooldowns with variables for shot and burst
                    this.shootCooldown = game.time.now + 150;
                    this.shots += 1;
                    if (this.shots >= 50) {
                        //wait a few seconds to start shooting again
                        this.burstCooldown = game.time.now + 4000;
                        this.shots = 0;
                        //set a new shot pattern
                        this.shotPattern = game.rnd.integerInRange(0, 2);
                        //always set a new waypoint for the guns to use in their shot functions
                        gun.waypoint = { x: game.rnd.integerInRange(0, 640), y: game.rnd.integerInRange(400, 800) };
                    }
                }
            }, this);
        }
    }

    //checks collions of boss against other things using provided function
    this.checkCollision = function (collider, collisionFunction) {
        game.physics.arcade.overlap(collider, this.ship, collisionFunction, null, this);
    };

    //checks boss's bullets against other things using provided function
    this.checkBulletCollision = function (collider, collisionFunction) {
        game.physics.arcade.overlap(collider, this.bullets, collisionFunction, null, this);
        game.physics.arcade.overlap(collider, this.cannonBullets, collisionFunction, null, this);
    };

    //kill function cleans up the boss object
    this.kill = function () {
        this.bossGroup.destroy();
        this.bullets.destroy()
        this.cannonBullets.destroy()
    }

    //getters and setters
    this.getBullets = function () {
        return this.bullets;
    }
    this.removeHitpoint = function () {
        this.hitPoints -= 1;
    }
    this.getHitpoints = function () {
        return this.hitPoints;
    }

    this.getPoints = function () {
        return this.points;
    }

}

//shoots directly at the player
playerDirected = function (px, py, bullet, gun, vel) {
    //accelerate the bullet towards the player
    game.physics.arcade.accelerateToXY(bullet, px, py, 400, vel, vel);
    bullet.body.velocity.x = bullet.body.acceleration.x;
    bullet.body.velocity.y = bullet.body.acceleration.y;

    //rotate the gun to point at bullet target
    gun.rotation = game.physics.arcade.angleToXY(gun, px, py);
    gun.angle -= 90;

    //manager cooldown for shots per function
    this.shootCooldown = game.time.now + 150;
}

//shoots directly at the player
weaving = function (px, py, bullet, gun, vel) {
    //accelerate the bullet towards the waypoint with variability of the x based on a sin wave with 200 units of aplitude
    var x = gun.waypoint.x + (200 * Math.sin(game.time.now / 500));
    game.physics.arcade.accelerateToXY(bullet, x, gun.waypoint.y, 400, vel, vel);
    bullet.body.velocity.x = bullet.body.acceleration.x;
    bullet.body.velocity.y = bullet.body.acceleration.y;

    //rotate the gun to point at bullet target
    gun.rotation = game.physics.arcade.angleToXY(gun, x, gun.waypoint.y);
    gun.angle -= 90;

    //manager cooldown for shots per function
    this.shootCooldown = game.time.now + 250;
}

//shoots directly at the player
waypoint = function (px, py, bullet, gun, vel) {
    //accelerate the bullet towards the player
    game.physics.arcade.accelerateToXY(bullet, gun.waypoint.x, gun.waypoint.y, 400, vel, vel);
    bullet.body.velocity.x = bullet.body.acceleration.x;
    bullet.body.velocity.y = bullet.body.acceleration.y;

    //rotate the gun to point at bullet target
    gun.rotation = game.physics.arcade.angleToXY(gun, gun.waypoint.x, gun.waypoint.y);
    gun.angle -= 90;

    //manager cooldown for shots per function
    this.shootCooldown = game.time.now + 150;
}

