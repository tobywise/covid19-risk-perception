
var explosions;
var boost_on;

class GameScene extends Phaser.Scene {

    constructor(key) {
        super({
            key: key,
            physics: {
                default: 'arcade',
                arcade: {
                    debug: false,
                    gravity: { y: 0 },
                    setBounds: true,
                    width: 800,
                    height: 600,
                    x: 0,
                    y: 0,
                    checkCollision: {
                        up: true,
                        down: true,
                        left: true,
                        right: true
                    }
                }
            },
        });
    }


    init(data) {

        // If no top score, set to zero
        if (!data) {
            this.topScore = 0;
        }

        if (data) {
            if (data.score > this.topScore) {
                this.topScore = data.score;
            }
            if (data.practice == true) {
                this.practicePhase = 0;
            }
            else {
                this.practicePhase = 999;
            }
            
        }

        this.hole = null;
        this.hole2 = null;

    }


    preload() {

        // Images

        // Ship
        this.load.image('ship', './assets/thrust_ship.png');
        this.load.image('fire', './assets/flame2.png');
        this.load.image('shield_boost', './assets/shields.png');

        // Background
        this.load.image('space', './assets/space2.png')

        // Asteroids
        this.load.image('ast1', './assets/asteroid1.png');
        this.load.image('ast2', './assets/asteroid2.png');
        this.load.image('ast3', './assets/asteroid3.png');
        this.asteroid_textures = ['ast1', 'ast2', 'ast3']

        // Beacons
        this.load.image('beacon1', './assets/beacon1.png');
        this.load.image('beacon2', './assets/beacon2.png');

        // Explosion
        this.load.spritesheet('kaboom', './assets/explode.png', {
            frameWidth: 128,
            frameHeight: 128
        });

    }

    add_updates(delay, beaconLag, xVelocity) {
        
        // Update the asteroids
        this.asteroidEvent = this.time.addEvent({
            delay: delay,
            callback: this.updateAsteroids,
            args: [beaconLag, xVelocity],
            callbackScope: this,
            loop: true
        });

        // Update warning beacons
        this.beaconEvent = this.time.addEvent({
            delay: delay,
            callback: this.updateBeacons,
            args: [xVelocity],
            callbackScope: this,
            loop: true
        });

    }

    create() {
        // this.cache.game.canvas.hidden = false;
        this.beacon_textures = this.cache.game.beacon_textures;

        // Add explosions, from here https://github.com/robhimslf/game-dev-invaders
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers( 'kaboom', {
                start: 0,
                end: 15
            }),
            frameRate: 16,
            repeat: 0,
            hideOnComplete: true
        });

        explosions = this.add.group({
            defaultKey: 'kaboom',
            maxSize: 10,
            active: false
        });


        // Turn off gravity. There is no gravity in space.
        this.physics.gravity = 0;

        // Background
        this.space = this.physics.add.image(400, 300, 'space');

        // Fire behind the spaceship
        this.fire = this.physics.add.image(225, 345, 'fire').setActive().setVelocity(0, 0);
        this.fire.setRotation(4.71);
        this.fire.setScale(0.3, 0.3);
        this.fire.collideWorldBounds = true;

        // The spaceship itself
        this.ship = this.physics.add.image(200, 300, 'ship').setActive().setVelocity(0, 0);
        this.ship.setCollideWorldBounds(true);
        this.ship.onWorldBounds = true;
        this.ship.depth = 20;
        console.log(this.ship)

        // Shield boost
        this.shield_boost = this.physics.add.image(300, 300, 'shield_boost').setActive().setVelocity(0, 0); 
        this.shield_boost.depth = 10;
        this.shield_boost.energy = 1;
        boost_on = false;
        this.boostKey = this.shield_boost.scene.input.keyboard.addKey('S');  // Get key object

        // Shield bar
        this.ship.health = 1;

        var graphics = this.add.graphics();
        this.healthBar = new Phaser.Geom.Rectangle(30, 40, 140, 20);
        graphics.fillStyle(0x1dadf7, 1);
        graphics.fillRectShape(this.healthBar);

        var graphicsBackground = this.add.graphics();
        this.healthBarBackground = new Phaser.Geom.Rectangle(30, 40, 140, 20);
        graphicsBackground.fillStyle(0xe2e2e2, 1);
        graphicsBackground.fillRectShape(this.healthBarBackground);


        // Update health bar
        this.healthEvent = this.time.addEvent({
            delay: 50,
            callback: function() {

                graphics.clear();
                graphicsBackground.setDepth(1999);
                graphics.setDepth(2000);

                var w = 140 * this.ship.health;
                this.healthBar.setSize(w, 20);

                if (this.ship.health <= 0.3) {
                    graphics.fillStyle(0xff9400, 1);
                }
                else {
                    graphics.fillStyle(0x1dadf7, 1);
                }

                graphics.fillRectShape(this.healthBar);
            },
            callbackScope: this,
            loop: true
        });

        // Shield boost bar
        var graphics2Background = this.add.graphics();
        graphics2Background.setDepth(1999);
        this.boostBarBackground = new Phaser.Geom.Rectangle(30, 92, 140, 20);
        graphics2Background.fillStyle(0xe2e2e2, 1);
        graphics2Background.fillRectShape(this.boostBarBackground);

        var graphics2 = this.add.graphics();
        graphics2.setDepth(2000);
        this.boostBar = new Phaser.Geom.Rectangle(30, 92, 140, 20);
        graphics2.fillStyle(Phaser.Display.Color.HexStringToColor('#d90070').color);
        graphics2.fillRectShape(this.boostBar);

        // Update boost bar
        this.boostEvent = this.time.addEvent({
            delay: 50,
            callback: function() {

                // I have no idea why any of this works
                graphics2.clear();

                var w = 140 * this.shield_boost.energy;
                this.boostBar.setSize(w, 20);

                if (this.shield_boost.energy < 1) {
                    graphics2.fillStyle(Phaser.Display.Color.HexStringToColor('#b55b89').color);
                }
                else {
                    graphics2.fillStyle(Phaser.Display.Color.HexStringToColor('#d90070').color);
                }

                graphics2.fillRectShape(this.boostBar);
            },
            callbackScope: this,
            loop: true
        });

        // Add asteroids
        this.asteroids = this.physics.add.group({
            key: 'asteroid',
            repeat: 24,
            setXY: { x: 700, y: 10, stepY: 25 },
            setVelocityX: -70
        });

        // Set texture of the asteroids
        this.asteroids.children.iterate(function (child) {
            child.setTexture(this.asteroid_textures[Phaser.Math.Between(0, 2)]);
            child.setX(2000);
        }, this);
        this.asteroids.depth = 0;

        // Add beacons
        this.beacons = this.physics.add.group({
            key: 'beacon',
            repeat: 1,
            setXY: { x: 500, y: 100, stepY: 400 },
            setVelocityX: -70
        });

        // Set texture of the beacons
        for (var i=0; i < this.beacons.getChildren().length; i++) {
            var child = this.beacons.getChildren()[i];
            child.setTexture(this.beacon_textures[i]);
            child.setX(2000);
            child.setScale(2);
        }
        this.beacons.depth = -999;


        // Collider - lets us know when the ship has hit an asteroid
        this.collider = this.physics.add.overlap(this.ship, this.asteroids, this.collide);

        // Instruction text
        this.instructionText = this.make.text({    
            style: {
            font: '25px Rubik',
            fill: 'white',
        }}).setX(400).setY(50).setDepth(2000).setAlign('center').setOrigin(0.5);

        this.countdownText = this.make.text({    
            style: {
            font: '70px Rubik',
            fill: 'white',
        }}).setX(400).setY(300).setDepth(2000).setAlign('center').setOrigin(0.5);

        // Shield text
        this.shieldText = this.make.text({    
                style: {
                font: '15px Rubik',
                fill: 'white',
        }}).setText(this.scoreVal).setX(30).setY(20).setDepth(2000);

        // Score
        this.scoreVal = 0;
        this.scoreLabel = this.make.text({    
            style: {
            font: '15px Rubik',
            fill: 'white',
        }}).setText(this.scoreVal).setX(30).setY(540).setDepth(2000);

        this.score = this.make.text({    
                style: {
                font: '35px Rubik',
                fill: 'white',
        }}).setText(this.scoreVal).setX(30).setY(550).setDepth(2000);

        // Update score every few milliseconds
        this.scoreEvent = this.time.addEvent({
            delay: 100,
            callback: function() {
                this.scoreVal += 10
            },
            callbackScope: this,
            loop: true
        });

        // keep track of trials
        this.last_asteroid = null;

        // We need to see things
        var graphics = this.add.graphics();

        // Update asteroids and beacons
        this.updatesAdded = 0;
        // this.add_updates(3100);

        // Practice phase
        if (this.practicePhase == 0) {
            this.shield_boost.energy = 0.8;
        }
        else {
            // This is after a game over screen
            // Set everything to starting conditions
            this.instructionText.setText('');
            this.countdownText.setText('');
            // Start the asteroids and beacons updating
            this.add_updates(3100, 2200, -1000);
            this.practicePhase = 999;
            this.shield_boost.energy = 1;
            this.ship.health = 1;
        }
        console.log(this.practicePhase);

        // Text to show shield integrity
        this.shieldText.setText('Shields\n\n\nShield boost');

        // Text to show score
        this.scoreLabel.setText('Score:')
        
        // Score indicator z
        this.score.depth = 1000;

        // Data save, will be updated later
        this.dataSaveEvent = null;

    }

    // Update - runs constantly
    update() {

        // PRACTICE STUFF

        if (this.practicePhase == 0) {
            this.instructionText.setText("Let's practice!\nTry using the up and down arrow keys\nto move the spaceship");
        }

        if (this.cache.game.player_trial == 4 & this.practicePhase == 1) {
            this.practicePhase = 2;
            this.instructionText.setText('Press S to boost your shields');
            this.asteroidEvent.remove();
            this.beaconEvent.remove();
        }

        
        if (this.cache.game.player_trial == 5 & this.practicePhase == 3) {
            // GET READY SCREEN
            this.instructionText.setY(200);
            this.instructionText.setText('Get ready to begin!');
            this.instructionCountdownSeconds = 5;
            this.instructionCountdown = this.time.addEvent({
                delay:1000,
                callback: function() {
                    // START GAME
                    if (this.instructionCountdownSeconds == 0) {
                        this.instructionText.setText('');
                        this.countdownText.setText('');
                        this.instructionCountdown.remove();
                        // Start the asteroids and beacons updating
                        this.add_updates(3100, 2200, -1000);
                        this.practicePhase = 999;
                        this.shield_boost.energy = 1;
                        this.ship.health = 1;
                        this.scoreVal = 0;
                    }
                    // COUNTDOWN
                    else {
                        this.instructionText.setText('Get ready to begin!\nGame starts in');
                        this.countdownText.setText(this.instructionCountdownSeconds);
                        this.instructionCountdownSeconds -= 1;
                    }
                },
                callbackScope: this,
                loop: true
            })
            this.asteroidEvent.remove();
            this.beaconEvent.remove();
            this.practicePhase = 4;
        }

        

        // Make sure the spaceship doesn't move horizontally
        this.ship.x = 200;
        
        // Add fire
        this.fire.x = this.ship.x - 20;
        this.fire.y = this.ship.y;

        // Key responses
        var cursors = this.input.keyboard.createCursorKeys();

        if (cursors.up.isDown) {
            this.ship.body.velocity.y -= 20;
            this.fire.body.velocity.y -= 20;
            this.fire.visible = true;
            if (this.practicePhase == 0) {
                this.setPracticePhase1 = this.time.addEvent({
                    delay: 4000,
                    callback: function() { 
                        this.practicePhase = 1;
                        this.instructionText.setText('Try avoiding the asteroids\nUse the warning beacons to help you');
                        if (this.updatesAdded == 0) {
                            this.add_updates(7000, 2200, -400);
                            this.updatesAdded = 1;
                        }
                    },
                    callbackScope: this,
                    loop: false
                });
            }
        }

        else if (cursors.down.isDown) {
            this.ship.body.velocity.y += 20;
            this.fire.body.velocity.y += 20;
            this.fire.visible = true;
        }

        else {
            this.ship.body.velocity.y *=0.98;
            this.fire.body.velocity.y *=0.98;
            this.fire.visible = false;
        }

        // Add shield boost
        if (this.boostKey.isDown & boost_on == false & this.shield_boost.energy >= 1) {
            if (this.practicePhase > 1) {
                if (this.updatesAdded == 1) {
                    this.add_updates(5000, 2500, -500);
                    this.updatesAdded = 2;
                    this.practicePhase = 3;
                }
                this.shield_boost.energy = 0;
                this.shieldEvent = this.time.addEvent({
                    delay: 2000,
                    callback: function() { 
                        boost_on = true;
                    },
                    callbackScope: this,
                    loop: false
                });
            }
        }


        if (boost_on) {
            this.shield_boost.x = this.ship.x;
            this.shield_boost.y = this.ship.y;
        }
        else {
            this.shield_boost.x = -999;
        }


        // Text to show score
        this.score.setText(this.scoreVal);

        // Constantly increase ship health and boost
        if (this.ship.health < 1) {
            this.ship.health += 0.00012;
        }

        if (this.shield_boost.energy < 1) {
            this.shield_boost.energy += 0.0004;
        }

        // Update trial count
        if (this.last_asteroid != null &&
            this.ship.x > this.last_asteroid.x &&
            (this.cache.game.trial - this.cache.game.player_trial == 1)) {
                this.trialUpdate = this.time.addEvent({
                    delay:500,
                    callback: function() {
                        if (this.cache.game.player_trial != this.cache.game.trial) {
                            this.cache.game.player_trial += 1;
                        }
                    },
                    callbackScope: this,
                    loop:false
                })
            
            boost_on = false;
            if (this.dataSaveEvent != null) {
                this.dataSaveEvent.remove();
            }
            
        }

        // End task if last trial done
        if (this.cache.game.player_trial >= this.cache.game.n_trials) {
            this.nextPhase();
        }


    }


    // Collision between ship and asteroid
    collide(bodyA, bodyB, axis, context)
    {
        // bodyA = ship, bodyB = asteroid

        // Lower health
        if (boost_on == true) {
            bodyA.health -= 0.02;
        }
        else {
            if (this.practicePhase < 999 & bodyA.health < 0.1) {
                bodyA.health = 0.1;                
            }
            bodyA.health -= 0.08;
            // bodyA.health -= 0.5;
        }
        

        // ADD EXPLOSION
        // console.log(explosions);
        // console.log(explosions.get())
        var explosion = explosions.get();
        // console.log(explosion);
        explosion.setScale(0.6, 0.6);
        explosion.setOrigin( 0.8, 0.5 );
        explosion.x = bodyB.x;
        explosion.y = bodyB.y;;
        explosion.play('explode');


        // Hide asteroid
        bodyB.x = -99999999999;
        bodyB.checkCollision = false;

        // Make ship a bit red
        bodyA.setTint('0xff0000');

        // But only for a second
        bodyA.scene.time.addEvent({
            delay: 1000,
            callback: function() {
                if (bodyA.health <= 0.2) {
                    bodyA.setTint('0xff0000');
                }
                else {
                    bodyA.setTint();
                }

            },
            callbackScope: this,
            loop: false
        });

        // End game if health goes to zero
        if (bodyA.health <= 0.01) {
            bodyA.scene.gameOver()
        }

    }

    // Create new asteroid belt
    updateAsteroids(beaconLag, xVelocity) {

        // Reset explosions
        explosions = this.add.group({
            defaultKey: 'kaboom',
            maxSize: 10
        });
        // console.log(this.cache.game.trial);
        // Get position of holes in the asteroid belt
        this.hole = this.cache.game.trial_info.positions_A[this.cache.game.trial];
        this.hole2 = this.cache.game.trial_info.positions_B[this.cache.game.trial];

        // Position asteroids - asteroids are already created and are just moved into position on each trial, so we're not constantly creating new objects
        var max_val = 0;
        this.last_asteroid = null;
        for (let i = 0; i < this.asteroids.getChildren().length; i++) {
            var childAsteroid = this.asteroids.getChildren()[i];
            childAsteroid.setDepth(0);
            var val = Phaser.Math.Between(beaconLag, beaconLag+200);

            // Create the hole
            if ((i < this.hole - 3 || i > this.hole) && (i < this.hole2 || i > this.hole2 + 3)) {
                childAsteroid.setX(val);
                childAsteroid.setVelocity(xVelocity, 0);
                if (val > max_val) {
                    max_val = val;
                    this.last_asteroid = childAsteroid;
                }
            }
            else {
                childAsteroid.setX(99999);

            }
        }

        // Adjust post-outcome duration
        this.asteroidEvent.paused = true;
        this.asteroidDelay = this.time.addEvent({
            delay: this.cache.game.trial_info.post_outcome_durations[this.cache.game.trial] * 1000,
            callback: function() { 
                this.asteroidEvent.paused = false;
            },
            callbackScope: this,
            loop: false
        });

    }

    updateBeacons(xVelocity) {
        for (var i=0; i < this.beacons.getChildren().length; i++) {
            var childBeacon = this.beacons.getChildren()[i];
            var val = 800;
            childBeacon.setX(val)
            childBeacon.setVelocity(xVelocity, 0)
            childBeacon.setTexture(this.beacon_textures[Math.abs(i - this.cache.game.trial_info.beacon_position[this.cache.game.trial])]);
            childBeacon.setX(1000);
            childBeacon.setDepth(0);
        }

        // console.log(this.cache.game.player_trial);
        // console.log(this.practicePhase);

        // Adjust post-outcome duration
        this.beaconEvent.paused = true;
        console.log(this.cache.game.trial_info.post_outcome_durations[this.cache.game.trial]);
        this.beaconDelay = this.time.addEvent({
            delay: this.cache.game.trial_info.post_outcome_durations[this.cache.game.trial] * 1000,
            callback: function() { 
                this.beaconEvent.paused = false;
            },
            callbackScope: this,
            loop: false
        });

        // Save data (locally) - just do this between beacon appearing and going through asteroid belt
        // console.log(this.cache.game.trial_info.beacon_position);
        this.cache.game.data[this.cache.game.player_trial] = {
            trial_number: this.cache.game.trial,
            hole1_y: this.hole,
            hole2_y: this.hole2,
            score: this.scoreVal,
            health: this.ship.health,
            boost_energy: this.shield_boost.energy,
            player_y: [this.ship.y],
            game_over: false,
            beacon_positions: this.cache.game.trial_info.beacon_position[this.cache.game.player_trial],
            iti: this.cache.game.trial_info.post_outcome_durations[this.cache.game.player_trial] 
        }

        // console.log(this.cache.game.data);

        // Add player Y positions
        if (this.practicePhase == 999) {
            this.dataSaveEvent = this.time.addEvent({
                delay: 200,
                callback: function () {
                    if (this.cache.game.player_trial in this.cache.game.data) {
                        this.cache.game.data[this.cache.game.player_trial]['player_y'].push(this.ship.y);
                    }
                },
                callbackScope: this,
                loop: true,
            });
        }

        // Add trial
        this.cache.game.trial += 1;
    }

    gameOver() {

        // Stop keyboard input
        var cursors = this.input.keyboard.createCursorKeys();
        cursors.up.isDown = false;
        cursors.down.isDown = false;

        // Calculate scores
        if (!this.topScore) {
            this.topScore = this.scoreVal;
        }

        else if (this.scoreVal > this.topScore) {
            this.topScore = this.scoreVal;
        }

        this.cache.game.data[this.cache.game.player_trial]['game_over'] = true;

        // Show game over screen
        this.scene.start('GameOver', {score: this.scoreVal, topScore: this.topScore, game: 'game'});

    }

    nextPhase() {

        var cursors = this.input.keyboard.createCursorKeys();
        cursors.up.isDown = false;
        cursors.down.isDown = false;

        this.ship.body = false;
        this.asteroids.body = false;
        this.fire.body = false;
        this.space.body = false;

        if (!this.topScore) {
            this.topScore = this.scoreVal;
        }

        else if (this.scoreVal > this.topScore) {
            this.topScore = this.scoreVal;
        }

        this.scene.start('EndScene', {score: this.scoreVal, topScore: this.topScore});

    }
}

export default GameScene;