class MainMenu extends Phaser.Scene {
    constructor() {
        super("mainMenu");

        this.switchPage = false;
    }

    create() {
        // scrolling background
        this.background = this.add.tileSprite(0, 0, game.config.width, game.config.height,
            "menu_background").setOrigin(0).setScale(2.0);
        this.foreground = this.add.tileSprite(0, game.config.height - 72, game.config.width,
            72, "menu_foreground").setOrigin(0).setScale(4.0);

        // title
        this.title = this.add.bitmapText(game.config.width / 2, 100, "retro",
            "Terra Explorer", 100).setOrigin(0.5).setBlendMode(Phaser.BlendModes.ADD);

        // options
        this.options = [];
        this.options.push(
            this.add.bitmapText((game.config.width / 2) - 250, 160, "retro",
                "By Isaac Kim", 32).setOrigin(0.5).setBlendMode(Phaser.BlendModes.ADD)
        );
        this.options.push(
            this.add.bitmapText(game.config.width / 2, (game.config.height / 2) + 300, "retro",
                "Press Enter to start", 32).setOrigin(0.5).setBlendMode(Phaser.BlendModes.ADD)
        );

        this.startGame = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    }

    update() {
        this.background.tilePositionX += 0.3;
        this.foreground.tilePositionX += 0.6;

        if (Phaser.Input.Keyboard.JustDown(this.startGame)){
            this.scene.start("level1");
        }
    }
}