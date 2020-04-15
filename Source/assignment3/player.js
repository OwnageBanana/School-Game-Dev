
//the player Constructor serves as the create method for the sprite, the lives and  the Guns of th player 
function Player(x, y) {
    this.x = x;
    this.y = y;
    this.playerSpeed = 1;
    this.powerupTimer = 0;
    this.invulTime = 500;
    this.lastHit = 0;

    //bomb variables
    this.bombCount = 3;
    this.bombCooldown = 0;
    this.bombDuration = 0;
    this.isDetonating = false;


    //adding first the bomb group so the player is drawn on top of it
    this.bombs = game.add.group();

    //player weapon manages bullets and gun types
    this.weapon = new Weapon();

    this.player = game.add.sprite(x, y, 'player');
    this.player.anchor.setTo(0.5, 0.5);
    this.player.animations.add('fly', [0, 1], 10, true);
    this.player.play('fly');
    game.physics.enable(this.player, Phaser.Physics.ARCADE);
    this.player.body.collideWorldBounds = true;

    //player shield variables
    this.hasShield = false;
    this.shield = game.add.sprite(x, y, 'player_shield');
    this.shield.anchor.setTo(0.5, 0.5);
    this.shield.kill();
    game.physics.enable(this.shield, Phaser.Physics.ARCADE);

    //lives group to put lives in
    this.lives = game.add.group();
    this.player.lives = this.lives;


    //bomb group to add bombs to
    this.bomb = this.bombs.create(0, 0, 'bomb_explosion');
    this.bomb.anchor.setTo(0.5, 0.5);
    this.bomb.visible = false;

    this.bombIcons = game.add.group();

    game.physics.enable(this.bomb, Phaser.Physics.ARCADE);



    //player update function for getting the players inputs to move it around or fire its weapon
    this.update = function () {

        this.player.body.velocity.x = 0;
        this.player.body.velocity.y = 0;
        if (this.powerupTimer < game.time.now) {
            this.playerSpeed = 1
        }

        this.isDetonating = this.bombDuration > game.time.now;
        if (this.isDetonating) {

            this.bomb.scale.x += 0.05;
            this.bomb.scale.y += 0.05;
        } else {
            this.bomb.visible = false;
            this.bomb.kill();
        }



        if (this.player.alive) {


            //space to fure a bullet
            if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
                this.weapon.fireBullet(this.player.x, this.player.y);
            }

            //on bomb use
            if (game.input.keyboard.isDown(Phaser.Keyboard.B) && this.canFireBomb()) {
                this.fireBomb();
            }

            if (cursors.left.isDown) {
                this.player.body.velocity.x = -300 * this.playerSpeed;
            }
            else if (cursors.right.isDown) {
                this.player.body.velocity.x = 300 * this.playerSpeed;
            }
            if (cursors.up.isDown) {
                this.player.body.velocity.y = -300 * this.playerSpeed;
            }
            else if (cursors.down.isDown) {
                this.player.body.velocity.y = 300 * this.playerSpeed;
            }

            if (this.hasShield) {
                this.shield.body.x = this.player.body.x - 4;
                this.shield.body.y = this.player.body.y - 7;
            }
        }
    }

    //resets the player variables for game restart
    this.reset = function(){
        this.removeShield();
        this.playerSpeed = 1;
        this.powerupTimer = 0;
        this.invulTime = 500;
        this.lastHit = 0;
        this.weapon.powerupKey = 0;
        this.weapon.powerupTimer = 0;
        
        this.bombCount = 3;
        this.bombCooldown = 0;
        this.bombDuration = 0;
        this.isDetonating = false;
    }

    //next level function to change all the level variables and reset the players lives
    this.nextLevel = function (x, y) {
        this.x = x;
        this.y = y;
        this.player.body.x = x;
        this.player.body.y = y;
        this.playerSpeed = 1;
        this.powerupTimer = 0;
        this.invulTime = 500;
        this.lastHit = 0;

        this.lives.removeAll();
        //10 lives for the player again
        for (var i = 1; i <= 10; i++) {
            var ship = this.lives.create(game.world.width - (10 * i), 60, 'player');
            ship.anchor.setTo(0.5, 0.5);
            ship.scale.x = 0.5;
            ship.scale.y = 0.5;
            ship.angle = 90;
            ship.alpha = 0.70;
        }

        this.bombIcons.removeAll();
        this.addBombIcons();


    }

    //function to increase the player's speed if they get the speed upgrade 
    this.increaseSpeed = function () {
        this.playerSpeed = 2;
        this.powerupTimer = game.time.now * 30 * 1000;
    }


    //function return a player life to them.
    this.addLife = function () {
        for (i = 9; i >= 0; i--) {
            if (!this.lives.children[i].alive) {
                this.lives.children[i].revive();
                break;
            }
        }
    }

    //function set variables to draw the shield 
    this.addShield = function () {
        this.hasShield = true;
        this.shield.revive();
    }

    //function to kill the shield
    this.removeShield = function () {
        this.hasShield = false;
        this.shield.kill();
    }

    this.fireBomb = function () {
        this.removeBomb();
        this.bomb.revive();
        this.bomb.visible = true;
        this.bomb.reset(this.player.x, this.player.y);
        this.bomb.scale.x = 0.1;
        this.bomb.scale.y = 0.1;
        this.bombDuration = game.time.now + 3000;
    }

    //function adding a bomb to the weapon object
    this.canFireBomb = function () {
        return this.bombCount >= 1 && this.bombCooldown < game.time.now;
    }

    //function adding a bomb to the weapon object
    this.addBomb = function () {
        if (this.bombCount < 3){
            this.bombCount += 1;
            for (i = 2; i >= 0; i--) {
                if (!this.bombIcons.children[i].alive) {
                    this.bombIcons.children[i].revive();
                    break;
                }
            }
        }
    }
    this.addBombIcons = function () {
        for (var i = 1; i <= this.bombCount; i++) {
            var icon = this.bombIcons.create(game.world.width - (20 * i),150, 'bomb_icon');
            icon.anchor.setTo(0.5, 0.5);
            icon.alpha = 0.70;
        }
    }

    //function adding a bomb to the weapon object
    this.removeBomb = function () {
        this.bombCooldown = game.time.now + 2000;
        this.bombCount -= 1;
        this.bombIcons.getFirstAlive().kill();
    }

    //returns if the bomb is detonating currently to check colisions
    this.getIsDetonating = function () {
        return this.isDetonating;
    }

    //getters and setters
    this.getBomb = function () {
        return this.bomb;
    }
    this.getPlayer = function () {
        return this.player;
    }
    this.getWeapon = function () {
        return this.weapon;
    }
    this.getBullets = function () {
        return this.weapon.getBullets();
    }
    this.getLastHit = function () {
        return this.lastHit;
    }
    this.setLastHit = function () {
        this.lastHit = game.time.now;
    }
    this.getInvulTime = function () {
        return this.invulTime;
    }

    //auto move for the menu. mvoes the player back and forth
    this.autoMove = function () {
        this.player.body.x = (200 * Math.sin(game.time.now / 1000)) + game.world.width / 2;
    }


}
