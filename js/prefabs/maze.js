/*
* Class to generate an array of cells or tiles which represents a maze.
*/

class Maze {
    constructor(columns, rows) {
        this.height = rows;
        this.width = columns;
        this.gates = [];
        this.direction = { left: 'left', right: 'right', up: 'up', down: 'down' };
    }


    /**
     * Converts cells array format. The new format defines each cell as 3x3 tiles.
     * This array only has zeros and ones. 1: allow pass 2: deny pass.
     * @param {row[]} cellsMap 
     * @returns {row[]} Array of 0 and 1 values. 1: pass; 2: not pass 
     * @memberof Maze
     */
    cellsTotiles(cellsMap) {
        let tileMap = new Array(this.height * 3);
        for (let i = 0; i < this.height * 3; i++) {
            tileMap[i] = new Array(this.width * 3).fill(0);
        }
        cellsMap.forEach((row, i) => {
            let y = i * 3;
            row.forEach((cel, c) => {
                let x = c * 3;
                // Center of 3x3 allways opened
                tileMap[y + 1][x + 1] = 1;
                // Up tile
                tileMap[y][x + 1] = cel[1];
                // Down tile
                tileMap[y + 2][x + 1] = cel[2];
                // Left tile
                tileMap[y + 1][x] = cel[0];
                // Right tile
                tileMap[y + 1][x + 2] = cel[3];
                // Corner of 3x3 are allways 0
            });
        });
        return tileMap
    }


    /**
     * Add a new gateway to the gates array. The gateway should be positioned
     * in an edge of the maze.
     * @param {integer} x X position of the gateway.
     * @param {integer} y Y position of the gateway.
     * @memberof Maze
     */
    gateway(x, y) {
        this.gates.push([x, y]);
    }

    tiles() {
        return this.cellsTotiles(this.cells());
    }


    /**
     * Returns an array representing the maze. The maze is composed by cells.
     * the cell array containts the state of the four walls (0:closed, 1:opened),
     * and visited state. Example: [1,0,0,1,1] // [left opened, up closed, down closed, right opened, visited]
     * the cells are grouped by rows, and the rows are contained in the maze array.
     *      *
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
            console.log([Math.floor(Math.random() * (t.width - 1)), Math.floor(Math.random() * (t.height - 1))]);
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

        generate();

        t.gates.forEach((v, i) => { setGateway(v[0], v[1]); });
        window.maze = maze;

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