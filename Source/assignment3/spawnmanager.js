


//spawn manager deals with the updates of the various spawns and their disposal
//provides an interface between the main update method and updating all of the enemies
function SpawnManager(width, height) {
    this.height = height;
    this.width = width;
    this.spawns = [];
    this.nextShot = game.time.now + game.rnd.integerInRange(5, 15) * 1000;

    this.spawnMapping =
        [
            { name: 'enemy1', pattern: pattern1 },
            { name: 'enemy2', pattern: pattern2 },
            { name: 'enemy3', pattern: pattern3 },
            { name: 'enemy4', pattern: pattern4 }
        ];

    //initalizing the enemy bullets
    this.enemyBullets = game.add.group();
    this.enemyBullets.enableBody = true;
    this.enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;

    for (var i = 0; i < 5; i++) {
        var b = this.enemyBullets.create(0, 0, 'enemy_bullet');
        b.name = 'bullet' + i;
        b.exists = false;
        b.visible = false;
        b.anchor.setTo(0.5, 0.5);
        b.checkWorldBounds = true;
        b.outOfBoundsKill = true;
    }

    //update function moves all the enemies which are alive acording to thier patterns
    this.update = function () {

        //get rid of all empty spawns
        this.disposeSpawns();

        //updating number of active enemies spawned and their position based on spawn pattern
        this.spawns.forEach(function (spawn) {
            //update active enemies
            spawn.update();
            //update enemies movement
            spawn.getActiveEnemies().forEach(spawn.pattern.bind(null, spawn.horizontalRange));
        });
        //having an enemy shoot 
        if (this.nextShot < game.time.now) {
            var tmp = this.getActiveEnemies();
            var len = tmp.length;
            if (len > 0) {
                var e = tmp[game.rnd.integerInRange(0, len - 1)];
                this.shoot(e.body.x, e.body.y);
                this.nextShot = game.time.now + game.rnd.integerInRange(5, 15) * 1000;
            }
        }
    };


    //next level function to change all the level variables and cleans out all of the spawns
    this.nextLevel = function () {
        this.spawns.forEach(function (spawn) {
            return spawn.getEnemies().removeAll();
        });
        this.disposeSpawns();
        this.nextShot = game.time.now + game.rnd.integerInRange(5, 15) * 1000;

    }

    //checks the colision of enemies vs another object
    this.checkCollision = function (collider, collisionFunction) {
        game.physics.arcade.overlap(collider, this.getActiveEnemies(), collisionFunction, null, this);
    };
    
    //checks the colision of enemy bullets vs another object
    this.checkBulletCollision = function (collider, collisionFunction) {
        game.physics.arcade.overlap(collider, this.enemyBullets, collisionFunction, null, this);
    };

    //adds a spawn to the spawn list based on the provided arguments
    this.addSpawn = function (x, count, enemyIndex) {

        //don't want things getting too close to the edge of the screen. limit to within 15 px
        if (x < 16) {
            x = 16;
        } else if (x > game.world.width - 16) {
            x = game.world.width - 16;
        }

        //set the width which an enemy can swerve
        var horizontalRange = 0;
        if (enemyIndex == 1)
            horizontalRange = game.rnd.integerInRange(100, 300);

        //set a spawn timer, varies how fast enemies spawn
        var spawnTimer = game.rnd.integerInRange(100, 150);

        //create and add the spawn
        this.spawns.push(new Spawn(x, -32, count, this.spawnMapping[enemyIndex].name, this.spawnMapping[enemyIndex].pattern, spawnTimer, horizontalRange));
    }

    //dispose of all dead spawns
    this.disposeSpawns = function () {

        this.spawns = this.spawns.filter(function (spawn) {
            return spawn.getEnemies().countLiving() > 0;
        });
    }

    //has a bullet spawn at an enemy location
    this.shoot = function (x, y) {
        bullet = this.enemyBullets.getFirstExists(false);
        if (bullet) {
            bullet.reset(x, y);
            bullet.body.velocity.y = 400;
        }
    }

    //getters and setters
    this.getActiveEnemies = function () {
        return this.getSpawns().flatMap(function (spawn) { return spawn.getActiveEnemies() });
    };

    this.getActiveBullets = function () {
        return this.enemyBullets.children.filter(function (b) { return b.alive });
    };

    this.getSpawns = function () {
        return this.spawns;
    }

    this.getBullets = function () {
        return this.enemyBullets;
    }

}



//a spawn object contains all of the spawn information pertaining to the enemy spawns
//provides a layer between a set of enemies and their sprite and pattern they follow
function Spawn(x, y, count, enemyName, pattern, spawnCooldown, horizontalRange) {
    this.x = x;
    this.y = y;
    this.count = count;
    this.enemyName = enemyName;
    this.pattern = pattern;
    this.lastSpawnIndex = 0;
    this.horizontalRange = horizontalRange || 0;
    //base time between spawning enemies or modified time
    this.spawnCooldown = spawnCooldown ? spawnCooldown : 150;
    this.spawnTime = game.time.now;
    this.activeEnemies = [];

    this.enemies = game.add.group();
    this.enemies.enableBody = true;

    this.enemies.physicsBodyType = Phaser.Physics.ARCADE;
    this.enemies.active;
    for (var i = 0; i < count; i++) {
        var c = this.enemies.create(x, y, enemyName);
        c.name = 'enemy' + i;
    }



    //spawn update method. sets the index for number of active enemies from spawn
    this.update = function () {
        //if last spawn time recorded is now in the past, add enemy to spawns
        if (this.spawnTime < game.time.now) {
            this.spawnTime = game.time.now + this.spawnCooldown;
            if (this.lastSpawnIndex < this.enemies.children.length) {
                this.activeEnemies.push(this.enemies.getAt(this.lastSpawnIndex));
                this.lastSpawnIndex++;
            }
        }
    }

    this.getEnemies = function () { return this.enemies; }

    this.getActiveEnemies = function () { return this.activeEnemies; }

}

//straight pattern
pattern1 = function (x, enemy) {
    enemy.body.velocity.y = 200;

    if (enemy.body.y > game.world.height) {
        enemy.kill();
    }
}

//weaving  pattern: x sets max amplitude, it will never be off screen?
pattern2 = function (x, enemy) {
    enemy.body.velocity.y = 100;

    if (enemy.dir == undefined) {
        if (enemy.body.x > game.world.width / 2)
            enemy.dir = -1;
        else
            enemy.dir = 1;
    }

    //"bounce" off boundries
    if (enemy.body.x > game.world.width - enemy.body.width || enemy.body.x < 0) {
        enemy.dir *= -1;
    }


    enemy.body.velocity.x = x * (Math.sin(enemy.body.y / 50)) * enemy.dir;
    if (enemy.body.y > game.world.height) {
        enemy.kill();
    }
}

//zig zag pattern
pattern3 = function (x, enemy) {
    enemy.body.velocity.y = 100;


    if (enemy.swapTime == undefined) {
        enemy.swapTime = game.time.now + 1000;
        enemy.body.velocity.x = 100;
    }

    if (enemy.dir == undefined) {
        if (enemy.body.x > game.world.width / 2)
            enemy.dir = -1;
        else
            enemy.dir = 1;
    }

    changeDir = false;
    //"bounce" off boundries
    if (enemy.swapTime < game.time.now || enemy.body.x > game.world.width - enemy.body.width || enemy.body.x < 0) {
        enemy.dir *= -1;
        changeDir = true;
        enemy.swapTime = game.time.now + 1000;
    }

    if (changeDir) {
        enemy.body.velocity.x *= enemy.dir;
    }
    if (enemy.body.y > game.world.height) {
        enemy.kill();
    }
}

//pattern4 is more or less random but enemies will tend to stick to the center of the map
pattern4 = function (x, enemy) {
    enemy.body.velocity.y = 100;

    if (enemy.swapTime == undefined || enemy.swapTime < game.time.now) {
        enemy.swapTime = game.time.now + 1000;

        enemy.body.velocity.x = game.rnd.integerInRange((game.world.width - enemy.body.x), -enemy.body.x) / 2;
    }
    if (enemy.body.y > game.world.height) {
        enemy.kill();
    }
}