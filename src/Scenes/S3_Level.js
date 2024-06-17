class LevelOne extends Phaser.Scene {
    constructor() {
        super("level1");
    }

    init() {
        this.ACCELERATION = 2560;
        this.DRAG = 2560;
        this.physics.world.gravity.y = 1500;
        this.JUMP_VELOCITY = -700;

        this.firstJump = false;
        this.secondJump = false;

        this.playerKeys = 0;
        this.playerScore = 0;

        this.spawnPointX = 100;
        this.spawnPointY = 250;

        this.loss = false;
        this.win = false;

        this.physics.world.drawDebug = false;
    }

    preload() {
    }

    create() {
        // create layers
        this.map = this.add.tilemap("level-one", 18, 18, 125, 20);

        this.tileset = this.map.addTilesetImage("tilemap-packed", "tilemap_sheet");
        this.background = this.map.addTilesetImage("sky", "sky_sheet");

        this.skyLayer = this.map.createLayer("Skies", this.background);
        this.rockLayer = this.map.createLayer("Pillars", this.tileset).setScrollFactor(0.75).setScale(1.5);
        this.treeLayer = this.map.createLayer("Trees", this.tileset).setScrollFactor(0.75).setScale(1.5);

        this.hazardLayer = this.map.createLayer("Hazards", this.tileset);
        this.hazardLayer.forEachTile((hazard) => {
            if (hazard.index == 69)
                hazard.setSize(10, 5);
        });
        this.hazardLayer.setCollisionByProperty({ collides: true });

        this.groundLayer = this.map.createLayer("Ground-n-Platforms", this.tileset);
        this.groundLayer.setCollisionByProperty({ collides: true });

        // create objects
        this.coins = this.map.createFromObjects("Objects", {
            name: "coin",
            key: "tilemap_sheet",
            frame: 151
        })

        this.keys = this.map.createFromObjects("Objects", {
            name: "key",
            key: "tilemap_sheet",
            frame: 27
        })

        this.barriers = this.map.createFromObjects("Objects", {
            type: "barrier",
            key: "tilemap_sheet",
            frame: 28
        })

        this.checkpoints = this.map.createFromObjects("Objects", {
            name: "checkpoint"
        })

        this.goal = this.map.createFromObjects("Objects", {
            name: "goal"
        })

        this.physics.world.enable(this.coins, Phaser.Physics.Arcade.STATIC_BODY);
        this.coinGroup = this.add.group(this.coins);

        this.physics.world.enable(this.keys, Phaser.Physics.Arcade.STATIC_BODY);
        this.keyGroup = this.add.group(this.keys);

        this.physics.world.enable(this.barriers, Phaser.Physics.Arcade.STATIC_BODY);

        this.physics.world.enable(this.checkpoints, Phaser.Physics.Arcade.STATIC_BODY);
        this.pointGroup = this.add.group(this.checkpoints);

        this.physics.world.enable(this.goal, Phaser.Physics.Arcade.STATIC_BODY);

        for (let coin of this.coins)
            coin.anims.play("spin");

        // enable physics
        my.sprite.player = this.physics.add.sprite(this.spawnPointX, this.spawnPointY, "tilemap_characters", 0);
        my.sprite.player.setFlip(true, false);
        my.sprite.player.setCollideWorldBounds(true);
        my.sprite.player.body.setMaxVelocityX(200);
        my.sprite.player.body.setMaxVelocityY(500);

        this.physics.add.collider(my.sprite.player, this.groundLayer);
        for (let barrier of this.barriers)
            this.physics.add.collider(my.sprite.player, barrier);
        this.physics.add.collider(my.sprite.player, this.hazardLayer, () => {
            this.respawn();
        });

        // object behavior
        this.physics.add.overlap(my.sprite.player, this.coinGroup, (obj1, obj2) => {
            this.playerScore++;
            this.sound.play("coinPickup");
            obj2.destroy();
        })

        this.physics.add.overlap(my.sprite.player, this.keyGroup, (obj1, obj2) => {
            this.playerKeys++;
            for (let barrier of this.barriers) {
                if (barrier.name == ("barrier0" + this.playerKeys))
                    barrier.destroy();
            }
            this.sound.play("keyPickup");
            obj2.destroy();
        })

        this.physics.add.overlap(my.sprite.player, this.pointGroup, (obj1, obj2) => {
            this.spawnPointX = obj2.x;
            this.spawnPointY = obj2.y;
            this.sound.play("spawnReset");
            obj2.destroy();
        })

        this.physics.add.overlap(my.sprite.player, this.goal, (obj1, obj2) => {
            this.scene.get("textScene").setState("well done");
            my.sprite.player.body.setAccelerationX(0);
            my.sprite.player.body.setDragX(this.DRAG);

            my.sprite.player.anims.play("idle");
            my.vfx.walking.stop();

            this.win = true;
        })

        // create keys
        this.input.keyboard.on('keydown-D', () => {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this);

        this.restart = this.input.keyboard.addKey("R");
        cursors = this.input.keyboard.createCursorKeys();

        // particle systems
        my.vfx.walking = this.add.particles(0, 0, "kenny-particles", {
            alpha: { start: 1, end: 0.1 },
            follow: my.sprite.player,
            followOffset: { x: 0, y: 9 },
            frame: ["smoke_01.png"],
            frequency: 100,
            lifespan: 250,
            scale: { start: 0.03, end: 0.1 }
        })

        my.vfx.jumping = this.add.particles(0, 0, "kenny-particles", {
            alpha: { start: 1, end: 0.1 },
            follow: my.sprite.player,
            followOffset: { x: 0, y: 5 },
            frame: ["smoke_10.png"],
            lifespan: 250,
            scale: { start: 0.03, end: 0.07 },
            stopAfter: 1
        })

        // camera behavior setup
        this.physics.world.bounds.setTo(0, 0, this.map.widthInPixels, this.map.heightInPixels);

        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25);
        this.cameras.main.setZoom(3.5);

        this.scene.launch("textScene");
    }

    update() {
        let playerBody = my.sprite.player.body;
        if (!this.loss && !this.win) {
            if (cursors.left.isDown || cursors.right.isDown) {
                if (cursors.left.isDown) {
                    playerBody.setAccelerationX(-this.ACCELERATION);

                    my.sprite.player.resetFlip();
                    my.sprite.player.anims.play("walk", true);
                } else if (cursors.right.isDown) {
                    playerBody.setAccelerationX(this.ACCELERATION);

                    my.sprite.player.setFlip(true, false);
                    my.sprite.player.anims.play("walk", true);
                }

                if (playerBody.blocked.down)
                    my.vfx.walking.start();
                else
                    my.vfx.walking.stop();
            } else {
                playerBody.setAccelerationX(0);
                playerBody.setDragX(this.DRAG);

                my.sprite.player.anims.play("idle");
                my.vfx.walking.stop();
            }

            if (playerBody.blocked.down) {
                this.firstJump = this.secondJump = false;
            } else {
                this.firstJump = true;
                my.sprite.player.anims.play("jump");
            }
            if (Phaser.Input.Keyboard.JustDown(cursors.up)) {
                if (!this.secondJump) {
                    playerBody.setVelocityY(this.JUMP_VELOCITY);
                    my.vfx.jumping.start();
                    if (!this.firstJump)
                        this.firstJump = true;
                    else
                        this.secondJump = true;
                }
            }
        } else {
            if (this.restart.isDown)
                this.scene.restart(this);
        }

        this.scene.get("textScene").setScore(this.playerScore);
    }

    respawn() {
        if (this.playerScore > 0)
            my.sprite.player.setPosition(this.spawnPointX, this.spawnPointY);
        else {
            this.scene.get("textScene").setState("game over");
            my.sprite.player.destroy();
            this.loss = true;
        }

        this.playerScore -= 4;
        if (this.playerScore < 0)
            this.playerScore = 0;
    }
}