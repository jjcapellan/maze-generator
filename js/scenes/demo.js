class Demo extends Phaser.Scene {
  constructor() {
    super('demo');
  }

  create(data) {
    const TILESIZE = data.tilesize;    
    const vTiles = Math.floor(((this.game.config.height/TILESIZE) - 1));
    const hTiles = Math.floor(((this.game.config.width/TILESIZE) - 1));
    const mapHeight = Math.floor((vTiles - 1) / 2);
    const mapWidth = Math.floor((hTiles - 1) / 2);
    // New Maze object
    const mymaze = new Maze(mapWidth, mapHeight);
    // Maze start
    mymaze.gateway(0, 1);
    // Maze exit
    mymaze.gateway(mapWidth - 1, mapHeight - 3);
    // Generates the maze map
    let mazeMap = mymaze.tiles();
    // Center the map on screen
    let x = Math.round((this.game.config.width - TILESIZE * hTiles) / 2);
    let y = Math.round((this.game.config.height - TILESIZE * vTiles) / 2);
    // Display the maze map
    this.renderTiles(x, y, mazeMap, TILESIZE);
  }

  swapZeros(array2d){
    let arr = [...array2d];
    arr.forEach((row,i) => {
      row.forEach((v,i,a)=>{
        a[i] = a[i] ? 0 : 1;
      });      
    });
    return arr;
  }
  

  renderTiles(x, y, maze, tilesize){
    const width = tilesize * maze[0].length;
    const height = tilesize * maze.length;

    // Walls    
    let wallsMap = this.make.tilemap({ data: maze, tileWidth: 50, tileHeight: 50 });
    let wallTile = wallsMap.addTilesetImage('wall');
    let wallsLayer = wallsMap.createStaticLayer(0, wallTile, x , y);
    wallsLayer.setDisplaySize(width,height);

    // Floor 
    const floorArray = this.swapZeros(maze); // swaps 0 - 1
    let map = this.make.tilemap({ data: floorArray, tileWidth: 50, tileHeight: 50 });
    let floorTile = map.addTilesetImage('floor');
    let floorLayer = map.createStaticLayer(0, floorTile, x, y);
    floorLayer.setDisplaySize(width, height);    
    
    // Shadows
    const offset = 0.2 * tilesize; // 20% of tile
    let rt = this.add.renderTexture(x + offset, y + offset, width, height);
    rt.draw(wallsLayer,0,0);
    rt.setAlpha(0.4);
    rt.setTint(0);

    // Move walls to front
    wallsLayer.setDepth(rt.depth + 1);
  }
  
}