
//this keeps track of the level, the progress and is uses to generate pickups as well as which spawns to create and when
function LevelManager(level) {
    this.level = level;
    this.levelLength;
    this.levels = {
        //spawns enemy varieties of 0 to range, time in seconds, spawn freq in seconds, num spawns as max number of spawns to happen at once
        1: { enemyRange: 1, time: 120, spawnFreq: 8, spawnRange: 30, numSpawns: 2, boss: false },
        2: { enemyRange: 2, time: 140, spawnFreq: 6, spawnRange: 30, numSpawns: 3, boss: false },
        3: { enemyRange: 3, time: 160, spawnFreq: 6, spawnRange: 35, numSpawns: 3, boss: true },
        4: { enemyRange: 3, time: 180, spawnFreq: 6, spawnRange: 35, numSpawns: 3, boss: false },
        5: { enemyRange: 3, time: 200, spawnFreq: 4, spawnRange: 40, numSpawns: 3, boss: true }
    };
    this.bossSpawn = { enemyRange: 3, spawnFreq: 8, spawnRange: 20, numSpawns: 2 };

    //level variables initalized
    this.levelLength = this.levels[level].time * 1000;
    this.nextSpawn = game.time.now + 1000 * game.rnd.integerInRange(this.levels[level].spawnFreq / 2, this.levels[level].spawnFreq);

    //pickup variables corispond to sprite names
    this.powerupsMap = {
        1: 'fast',
        2: 'double',
        3: 'spread',
        4: 'speed',
        5: 'life',
        6: 'shield',
        7: 'bomb'
    }
    this.pickups = game.add.group();
    this.pickups.enableBody = true;
    this.pickups.physicsBodyType = Phaser.Physics.ARCADE;

    //change variables for the next level
    this.nextLevel = function (level) {
        this.level = level;
        this.levelLength = this.levels[level].time * 1000;
        this.nextSpawn = game.time.now + 1000 * game.rnd.integerInRange(this.levels[level].spawnFreq / 2, this.levels[level].spawnFreq);
        this.pickups.removeAll();
    }

    this.getDrop = function (x, y) {
        // each drop will have a 1/15 percent change of being dropped.
        var dropped = game.rnd.integerInRange(1, 15);
        //1 is the random number chosen to have a pickup drop
        if (dropped == 1) {
            //add the pickup based on the mapping , pickups between 1 and 7
            var index = game.rnd.integerInRange(1, 7);
            p = game.add.sprite(x, y, this.powerupsMap[index]);
            p.powerup = index;
            p.anchor.setTo(0.5, 0.5);
            game.physics.enable(p, Phaser.Physics.ARCADE);
            p.body.checkWorldBounds = true;
            p.body.outOfBoundsKill = true;
            p.scale.x = 1.5;
            p.scale.y = 1.5;
            p.body.velocity.y = 100;
            this.pickups.addChild(p);
        }
    }

    //specific collision function for pickups 
    this.checkCollision = function (collider, collisionFunction) {
        game.physics.arcade.overlap(collider, this.getPickup().children, collisionFunction, null, this);
    }

    //get rid of killed pickups
    this.disposePickups = function () {
        this.pickupschildren = this.pickups.filter(function (p) { return p.alive });
    }
    //getters and setters
    this.getLevelData = function () {
        if (bossFight)
            return this.bossSpawn;
        else
            return this.levels[this.level];
    }

    this.getNextSpawn = function () {
        return this.nextSpawn;
    }

    this.setNextSpawn = function () {
        this.nextSpawn = game.time.now + 1000 * game.rnd.integerInRange(this.levels[this.level].spawnFreq / 2, this.levels[this.level].spawnFreq);
    }

    this.getPickup = function () {
        return this.pickups;
    }

}