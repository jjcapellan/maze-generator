class Demo extends Phaser.Scene {
  constructor() {
    super('demo');
  }

  create() {
    const tilesize = 50;
    const mapHeight = Math.floor(this.game.config.height / tilesize);
    const mapWidth = Math.floor(this.game.config.width / tilesize);
    // New Maze object
    const mymaze = new Maze(mapWidth, mapHeight);
    // Maze start
    mymaze.gateway(0, 1);
    // Maze exit
    mymaze.gateway(mapWidth - 1, mapHeight - 3);
    // Generates the maze map
    let mazeMap = mymaze.map();
    // Center the map on screen
    let x = Math.round((this.game.config.width - tilesize * mapWidth) / 2);
    let y = Math.round((this.game.config.height - tilesize * mapHeight) / 2);
    // Display the maze map
    this.displayMap(x, y, mazeMap, tilesize);
  }

  displayMap(x0, y0, maze, tilesize) {
    let x = x0;
    let y = y0;
    let t = this;

    for (let i = 0; i < maze.length; i++) {
      renderRow(maze[i])
      x = x0;
      y += tilesize;
    }

    function renderRow(row) {
      for (let i = 0; i < maze[0].length; i++) {
        let frame = "" + row[i][0] + row[i][1] + row[i][2] + row[i][3];
        if (frame != '0000') {
          let cell = t.add.image(x, y, 'atl_maze', frame);
          cell.setOrigin(0, 0);
        }
        x += tilesize;
      }
    }
  }
}