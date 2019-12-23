class Gui extends Phaser.Scene {
    constructor() {
        super('gui');
    }

    create() {
        let params = { tilesize: 30 };
        const gui = new dat.GUI({ with: 400 });
        const datGui = gui.add(params, 'tilesize', 8, 100).step(2);

        datGui.onFinishChange(
            (v) => {
                this.scene.stop('demo');
                this.scene.launch('demo', { tilesize: params.tilesize });
            }
        );
    }
}