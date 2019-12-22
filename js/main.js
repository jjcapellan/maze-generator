function runGame() {
  var config = {
    type: Phaser.AUTO,
    scale: {
      parent: 'game',
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 1680,
      height: 1050
    },
    backgroundColor: 0x000000,
    scene: [LoadScreen, Demo, Gui]
  };

  var game = new Phaser.Game(config);
}

window.onload = function () {
  runGame();
};
