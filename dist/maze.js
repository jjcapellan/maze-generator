/**
 * Class to generate mazes using a non recursive backtrack algorithm.
 *
 * @link   https://github.com/jjcapellan/maze-generator
 * @author Juan José Capellán
 * @license [MIT](https://raw.githubusercontent.com/jjcapellan/maze-generator/master/LICENSE)
 * 
**/

class Maze {
    constructor(columns, rows) {
        this.height = rows;
        this.width = columns;
        this.gates = [];
        this.direction = { left: 'left', right: 'right', up: 'up', down: 'down' };
    }
    

    /**
     * Generates the route between start and end points.
     *
     * @param {row[]} maze2d array 2d
     * @param {integer} startX
     * @param {integer} startY
     * @param {integer} endX
     * @param {integer} endY
     * @returns {Array} Array of pairs x,y of the correct route
     * @memberof Maze
     */
    getRoute(maze2d, startX, startY, endX, endY) {
        const goal = [xToTile(endX), xToTile(endY)];
        let route = [];
        let t = this;
        let visited = new Map();

        // First route point
        route.push([[xToTile(startX),xToTile(startY)], getActions(xToTile(startX),xToTile(startY))]);
          // Mark point as visited
        visited.set(startX+"-"+startY, true);

        function cell(x, y) {
            return maze2d[y][x];
        }

        function xToTile(x){
            return x * 2 + 1;
        }

        function last() {
            return route[route.length - 1][0];
        }

        function clean() {
            route.forEach((v,i,arr) => {
                v.pop();
                arr[i] = arr[i].pop();
            });
        }

        function getActions(x, y) {
            let actions = [];
            let left = (x - 1 >= 0) ? cell(x - 1, y) : null;
            if (left && !visited.has((x-1)+"-"+y)) {
                actions.push('left');
            }
            let up = (y - 1 >= 0) ? cell(x, y - 1) : null;
            if (up && !visited.has(x+"-"+(y-1))) {
                actions.push('up');
            }
            let down = (y + 1 < maze2d.length) ? cell(x, y + 1) : null;
            if (down && !visited.has(x+"-"+(y+1))) {
                actions.push('down');
            }
            let right = (x + 1 < maze2d[0].length) ? cell(x + 1, y) : null;
            if (right && !visited.has((x+1)+"-"+y)) {
                actions.push('right');
            }
            return actions;
        }

        function makeRoute() {
            do {
                if (last()[0] == goal[0] && last()[1] == goal[1]) {
                    clean();
                    return route;
                }
                if (route[route.length - 1][1].length > 0) {
                    let dir = route[route.length - 1][1].pop();
                    move(dir);
                } else {
                    route.pop();
                }
            } while (true);

        }

        function move(dir) {
            let pos = last();
            let x = pos[0];
            let y = pos[1];

            switch (dir) {
                case 'right':
                    x += 1;
                    break;
                case 'left':
                    x -= 1;
                    break;
                case 'up':
                    y -= 1;
                    break;
                case 'down':
                    y += 1;
                    break;
                default:
                    break;
            }
          
            // Mark visited
            visited.set(x+"-"+y, true);
            route.push([[x, y], getActions(x, y)]);
        }

        return makeRoute();
    }


    /**
     * Converts cells array format to a 2d array.
     * This array only has zeros and ones. 0: wall 1: path.
     * @param {row[]} cellsMap 
     * @returns {row[]} 
     * @memberof Maze
     */
    cellsToTiles(cellsMap) {
        let tileMap = new Array(this.height * 2 + 1);
        for (let i = 0; i < tileMap.length; i++) {
            tileMap[i] = new Array(this.width * 2 + 1).fill(0);
        }
        cellsMap.forEach((row, i) => {
            let y = (i + 1) * 2 - 1;
            row.forEach((cel, c) => {
                let x = (c + 1) * 2 - 1;
                // Center of 3x3 allways opened
                tileMap[y][x] = 1;
                // Up tile
                tileMap[y - 1][x] = cel[1];
                // Down tile
                tileMap[y + 1][x] = cel[2];
                // Left tile
                tileMap[y][x - 1] = cel[0];
                // Right tile
                tileMap[y][x + 1] = cel[3];
                // Corner of 3x3 are allways 0
            });
        });
        return tileMap
    }


    /**
     * Adds a new gateway to the gates array. The gateway should be positioned
     * in an edge of the maze.
     * @param {integer} x X position of the gateway.
     * @param {integer} y Y position of the gateway.
     * @memberof Maze
     */
    gateway(x, y) {
        this.gates.push([x, y]);
    }

    /**
     * Returns 2d array representing the maze.
     * Each element is a single value 0 or 1 (wall or path).
     * The tiles are grouped by rows, and the rows are contained in the maze array.
     * @returns {rows[]} Contains the mace cells
     * @memberof Maze
     */
    tiles() {
        return this.cellsToTiles(this.cells());
    }


    /**
     * Returns an array of cells representing the maze.
     * Each cell is an array containing the state of the four walls (0:closed, 1:opened). 
     * Example: [1,0,0,1] // [left opened, up closed, down closed, right opened]
     * The cells are grouped by rows, and the rows are contained in the maze array. 
     * @returns {rows[]} Contains the mace cells
     * @memberof Maze
     */
    cells() {

        let t = this;
        let maze = [];
        let cellsStack = [];
        let cursor = [];

        for (let i = 0; i < t.height; i++) {
            maze.push(initRow());
        }

        function initRow() {
            let row = [];
            for (let i = 0; i < t.width; i++) {
                row.push([0, 0, 0, 0, 1]); //[left open?, up open?, down open?, right open?, not visited?]
            }
            return row;
        }

        function cell(x, y) {
            return maze[y][x];
        }

        function getNonVisited(x, y) {
            let freeOnes = [];
            let left = (x - 1 >= 0) ? cell(x - 1, y)[4] : null;
            if (left) {
                freeOnes.push({ x: x - 1, y: y, to: 'left' });
            }
            let up = (y - 1 >= 0) ? cell(x, y - 1)[4] : null;
            if (up) {
                freeOnes.push({ x: x, y: y - 1, to: 'up' });
            }
            let down = (y + 1 < t.height) ? cell(x, y + 1)[4] : null;
            if (down) {
                freeOnes.push({ x: x, y: y + 1, to: 'down' });
            }
            let right = (x + 1 < t.width) ? cell(x + 1, y)[4] : null;
            if (right) {
                freeOnes.push({ x: x + 1, y: y, to: 'right' });
            }

            return freeOnes;
        }

        function move(direction) {
            let x = cursor[0];
            let y = cursor[1];
            let dir = direction;
            switch (dir) {
                case t.direction.right:
                    // Deletes current right wall
                    cell(x, y)[3] = 1;
                    // New current
                    cursor = [x + 1, y];
                    // Deletes left wall of new current
                    cell(x + 1, y)[0] = 1;
                    break;
                case t.direction.left:
                    cell(x, y)[0] = 1;
                    cursor = [x - 1, y];
                    cell(x - 1, y)[3] = 1;
                    break;
                case t.direction.up:
                    cell(x, y)[1] = 1;
                    cursor = [x, y - 1];
                    cell(x, y - 1)[2] = 1;
                    break;
                case t.direction.down:
                    cell(x, y)[2] = 1;
                    cursor = [x, y + 1];
                    cell(x, y + 1)[1] = 1;
                    break;
                default:
                    break;
            }
            // Mark it as visited
            cell(cursor[0], cursor[1])[4] = 0;
            // Adds this cell to stack
            cellsStack.push(cursor);
        }

        function generate() {
            cursor = [Math.floor(Math.random() * (t.width - 1) + 1), Math.floor(Math.random() * (t.height - 1) + 1)];
            // Marks first cell as visited
            cell(cursor[0], cursor[1])[4] = 0;
            // First cell added to the stack
            cellsStack.push(cursor);

            do {
                let nearCells = getNonVisited(cursor[0], cursor[1]);
                // Inits path
                while (nearCells.length > 0) {
                    let idx = Math.floor(Math.random() * nearCells.length);
                    let dir = nearCells[idx].to;
                    move(dir);
                    nearCells = getNonVisited(cursor[0], cursor[1]);
                }
                // Backtrace walked path searching for new paths
                cursor = cellsStack.pop();
                if (!cursor) break;
            } while (true);
        }

        function setGateway(x, y) {
            let start = cell(x, y);
            if (x == 0) {
                start[0] = 1;
            } else if (y == 0) {
                start[1] = 1;
            } else if (x == t.width - 1) {
                start[3] = 1;
            } else if (y == t.height - 1) {
                start[2] = 1;
            }
        }

        function trimCells() {
            maze.forEach((row) => {
                row.forEach((c) => { c.pop(); });
            });
        }

        generate();
        trimCells();
        t.gates.forEach((v, i) => { setGateway(v[0], v[1]); });

        return maze;
    }

    /**
     * Deletes all content of gates array. 
     * It is necessary if you want to change the doors.
     * Use it before add the new gateways and call map().
     * @memberof Maze
     */
    resetGates() {
        this.gates = [];
    }
}