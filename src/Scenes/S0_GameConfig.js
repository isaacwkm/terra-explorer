class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }
    
    preload() {
        this.load.setPath("./assets/");

        // preload background
        this.load.image("menu_background", "background.png");
        this.load.image("menu_foreground", "tilemap/ground_tile.png");

        // preload character sheet
        this.load.spritesheet("tilemap_characters", "tilemap/tilemap-characters_packed.png", {
            frameWidth: 24,
            frameHeight: 24
        })

        // preload tilemap
        this.load.image("sky_sheet", "tilemap/sky.png");
        this.load.image("tilemap_tiles", "tilemap/tilemap_packed.png");
        this.load.tilemapTiledJSON("level-one", "tilemap/level-one.tmj");

        this.load.spritesheet("tilemap_sheet", "tilemap/tilemap_packed.png", {
            frameWidth: 18,
            frameHeight: 18
        });

        // preload particle sheet
        this.load.multiatlas("kenny-particles", "kenny-particles.json");
        
        // preload audio
        this.load.audio("spawnReset", "audio/powerUp1.ogg");
        this.load.audio("coinPickup", "audio/powerUp2.ogg");
        this.load.audio("keyPickup", "audio/powerUp5.ogg");

        this.load.audio("playerHurt", "audio/explosionCrunch_000.ogg");
        this.load.audio("playerDeath", "audio/explosionCrunch_004.ogg");

        this.load.audio("bounce", "audio/phaseJump1.ogg");
        this.load.audio("squash", "audio/impactPlate_light_000.ogg");
        this.load.audio("pew", "audio/laserSmall_000.ogg");

        // preload font
        this.load.bitmapFont("retro", "fonts/retro_0.png", "fonts/retro.fnt");
    }

    create() {
        // create animations
        this.anims.create({
            key: "walk",
            defaultTextureKey: "tilemap_characters",
            frames: [
                { frame: 0 },
                { frame: 1 }
            ],
            frameRate: 15,
            repeat: -1
        })

        this.anims.create({
            key: "idle",
            defaultTextureKey: "tilemap_characters",
            frames: [
                { frame: 0 }
            ],
            repeat: -1
        })

        this.anims.create({
            key: "jump",
            defaultTextureKey: "tilemap_characters",
            frames: [
                { frame: 1 }
            ],
            repeat: -1
        })
        
        this.anims.create({
            key: "spin",
            defaultTextureKey: "tilemap_sheet",
            frames: [
                { frame: 151 }, { frame: 152 }
            ],
            frameRate: 10,
            repeat: -1
        })

        this.scene.start("mainMenu");
    }
}