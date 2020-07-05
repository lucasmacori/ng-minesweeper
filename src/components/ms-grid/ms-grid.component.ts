import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Row } from 'src/models/row.model';
import { Cell } from 'src/models/cell.model';
import { Coordinates } from 'src/models/coordinates.model';

// Icons
import { IconDefinition, faBomb, faFlag } from '@fortawesome/free-solid-svg-icons';

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
  @Output() end: EventEmitter<boolean>;

  // Icons
  public faFlag: IconDefinition = faFlag;
  public faBomb: IconDefinition = faBomb;

  public gridIsReady: boolean;
  public isEnded: boolean;
  public rows: Array<Row>;
  public bombs: number;

  constructor() {
    this.gridIsReady = false;
    this.rows = [];
  }

  ngOnInit(): void {
    this.startGame();
  }

  /**
   * Initializes a new game
   * This function is automatically called when the component initializes but can be called again by the parent to restart
   */
  public startGame(): void {
    // Default values
    this.width = (this.width && this.width >= 4) ? this.width : 9;
    this.height = (this.height && this.height >= 4) ? this.height : 9;

    // Planting the bombs
    const bombsCoordinates = this.plantBombs();

    // Building the board
    for (let i = 0; i < this.height; i++) {
      const cells = [];
      for (let j = 0; j < this.width; j++) {
        const cell: Cell = {
          isBomb: this.coordinatesAreContained(bombsCoordinates, j, i),
          isFlagged: false,
          nearbyBombs: 0,
          isClicked: false
        };
        cells.push(cell);
      }
      this.rows.push({ cells: cells })
    }

    this.isEnded = false;
    this.gridIsReady = true;
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
   * Shows the number of nearby bombs or the bomb itself when the user clicks on a cell
   * @param cell The cell to click
   */
  public clickCell(cell: Cell): void {
    if (!this.isEnded) {
      cell.isClicked = true;

      // Click actions
      if (cell.isBomb) {
        this.endOfGame(false);
      }
    }
  }

  /**
   * Flags a cell when the user right clicks on it
   * @param cell The cell to flag
   */
  public flagCell(cell: Cell): boolean {
    if (!cell.isClicked && !this.isEnded) {
      cell.isFlagged = true;
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
  }

}
