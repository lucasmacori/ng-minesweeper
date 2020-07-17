import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Row } from 'src/models/row.model';
import { Cell } from 'src/models/cell.model';
import { Coordinates } from 'src/models/coordinates.model';

// Icons
import { IconDefinition, faBomb, faFlag, faRedo } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-ms-grid',
  templateUrl: './ms-grid.component.html',
  styleUrls: ['./ms-grid.component.scss']
})
export class MsGridComponent implements OnInit {

  // Inputs
  @Input() width: number;
  @Input() height: number;

  // Outputs
  @Output() flag: EventEmitter<boolean>;
  @Output() end: EventEmitter<boolean>;
  @Output() restart: EventEmitter<null>;

  // Icons
  public faFlag: IconDefinition = faFlag;
  public faBomb: IconDefinition = faBomb;
  public faRedo: IconDefinition = faRedo;

  public gridClasses: object;

  public gridIsReady: boolean;
  public isEnded: boolean;
  public rows: Array<Row>;
  public bombs: number;
  private bombsCoordinates = Array<Coordinates>();

  constructor() {
    this.flag = new EventEmitter<boolean>();
    this.end = new EventEmitter<boolean>();
    this.restart = new EventEmitter<null>();
    this.gridIsReady = false;
    this.rows = [];
  }

  ngOnInit(): void {
    this.startGame(false);
  }

  /**
   * Initializes a new game
   * This function is automatically called when the component initializes but can be called again by the parent to restart
   */
  public startGame(restart: boolean = true): void {
    this.rows = new Array<Row>();

    // Grid classes
    this.gridClasses = { halfOpacity: false, selectable: true };

    // Default values
    this.width = (this.width && this.width >= 4) ? this.width : 9;
    this.height = (this.height && this.height >= 4) ? this.height : 9;

    // Planting the bombs
    this.bombsCoordinates = this.plantBombs();

    // Building the board
    for (let i = 0; i < this.height; i++) {
      const cells = [];
      for (let j = 0; j < this.width; j++) {

        const isBomb = this.coordinatesAreContained(this.bombsCoordinates, j, i);
        let nearbyBombs = 0;
        if (!isBomb) {
          // Checking for nearby bombs
          nearbyBombs = this.cellHasBombNearby(i, j);
        }

        // Creating the cell
        const cell: Cell = {
          isBomb: isBomb,
          isFlagged: false,
          nearbyBombs: nearbyBombs,
          isClicked: false
        };
        cells.push(cell);
      }
      this.rows.push({ cells: cells })
    }

    this.isEnded = false;
    this.gridIsReady = true;

    if (restart) {
      this.restart.emit();
    }
  }

  /**
   * Returns the list of random bombs coordinates 
   */
  private plantBombs(): Array<Coordinates> {
    const coordinatesArray = new Array<Coordinates>();
    let plantedBombs = 0;

    // Define the number of bombs to be planted
    this.bombs = Math.round((this.width * this.height) * 0.125); // In this case 1 cell out of 8 is a bomb

    // Planting the bombs
    while (this.bombs > plantedBombs) {
      const x = Math.floor((Math.random() * this.width) + 0);
      const y = Math.floor((Math.random() * this.height) + 0);
      const coordinates: Coordinates = { x: x, y: y };
      if (!this.coordinatesAreContained(coordinatesArray, x, y)) {
        coordinatesArray.push(coordinates);
        plantedBombs++;
      }
    }

    return coordinatesArray;
  }

  /**
   * Return whether or not the given coordinates can be found inside the given array of coordinates
   * @param arrayOfCoordinates The array of coordinates to look through
   * @param x The x of the coordinates to find
   * @param y The y of the coordinates to find
   */
  private coordinatesAreContained(arrayOfCoordinates: Array<Coordinates>, x: number, y: number): boolean {
    return arrayOfCoordinates.some((element) => element.x === x && element.y === y)
  }

  /**
   * 
   * @param bombsCoordinates The coordinates of the bombs
   * @param i y coordinates from the original loop
   * @param j x coordinates from the original loop
   * @param recursive If set to 'true', will check other nearby cells and auto click them
   */
  private cellHasBombNearby(i: number, j: number): number {
    let nearbyBombs = 0;

    for (let y = i - 1; y <= i + 1; y++) {
      for (let x = j - 1; x <= j + 1; x++) {
        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
          if (this.coordinatesAreContained(this.bombsCoordinates, x, y)) {
            nearbyBombs++;
          }
        }
      }
    }

    return nearbyBombs;
  }

  /**
   * Automatically reveal empty cells near a clicked cell
   * @param i y coordinates from the original loop
   * @param j x coordinates from the original loop
   */
  private revealNearbyEmptyCells(x: number, y: number): void {

    const originalCell = this.getCellFromCoordinates(x, y);

    // Browsing the nearby cells
    if (originalCell.nearbyBombs === 0) {
      for (let currenty = y - 1; currenty <= y + 1; currenty++) {
        for (let currentx = x - 1; currentx <= x + 1; currentx++) {
          if (currentx >= 0 && currentx < this.width && currenty >= 0 && currenty < this.height) {

            // Fetching the cell and checking that it does not contain a bomb and isn't clicked
            const cell = this.getCellFromCoordinates(currentx, currenty);
            if (!this.coordinatesAreContained(this.bombsCoordinates, currentx, currenty) && !cell.isClicked) {
  
              // Clicking the cell
              cell.isClicked = true;
  
              // Revealing other nearby cells if the cell is empty
              if (cell.nearbyBombs === 0) {
                this.revealNearbyEmptyCells(currentx, currenty);
              }
            }
          }
        }
      }
    }
  }

  /**
   * Checks the grid to find out if the player won or is still playing
   */
  private isWin(): boolean {
    let uncheckedCells = 0;

    if (!this.isEnded) {
      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
          const cell = this.getCellFromCoordinates(x, y);
          if (!cell.isClicked) {
            uncheckedCells++;
          }
        }
      }
    }

    return uncheckedCells === this.bombs;
  }

  /**
   * Gets the cell object from given coordinates
   * @param x The x coordinate of the cell
   * @param y The y coordinate of the cell
   */
  private getCellFromCoordinates(x: number, y: number): Cell {
    return this.rows[y].cells[x];
  }

  /**
   * Shows the number of nearby bombs or the bomb itself when the user clicks on a cell
   * @param cell The cell to click
   */
  public clickCell(cell: Cell, x: number, y: number): void {
    if (!this.isEnded) {
      cell.isClicked = true;

      if (cell.isBomb) {
        this.endOfGame(false);
      } else {
        this.revealNearbyEmptyCells(x, y);
        if (this.isWin()) {
          this.endOfGame(true);
        }
      }
    }
  }

  /**
   * Flags a cell when the user right clicks on it
   * @param cell The cell to flag
   */
  public flagCell(cell: Cell): boolean {
    if (!cell.isClicked && !this.isEnded) {
      cell.isFlagged = cell.isFlagged ? false : true;
      this.flag.emit(cell.isFlagged);
    }

    // Returning false so that the browser context menu doesn't open
    return false;
  }

  /**
   * Ens the game and sends an event to parent
   * @param win Whether the user has won or lost
   */
  private endOfGame(win: boolean): void {
    this.isEnded = true;
    this.end.emit(win);
    this.gridClasses['halfOpacity'] = true;
    this.gridClasses['selectable'] = false;
  }

}
