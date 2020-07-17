import { Component, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { MsGridComponent } from 'src/components/ms-grid/ms-grid.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  title = 'minesweeper';

  // View childs
  @ViewChild('grid') grid: MsGridComponent;

  public bombs: number;
  public flags: number;
  public win: boolean;

  constructor (private cdref: ChangeDetectorRef) { }

  ngAfterViewInit(): void {
    this.restart();

    // Used to tell Angular that changes occured. Otherwise an error pops in the console since the value hass been changed
    this.cdref.detectChanges();
  }

  public restart(): void {
    this.win = undefined;
    this.bombs = 0;
    this.flags = 0;
    this.bombs = this.grid.bombs;
  }

  /**
   * Display end of the game
   * @param win Whether the user won or not
   */
  public endGame(win: boolean): void {
    this.win = win;
  }

  /**
   * Removes or add a bomb in the header component
   * @param flag Whether the user flagged or unflagged the cell
   */
  public toggleFlagCell(flag: boolean): void {
    if (flag) {
      if (this.bombs > 0) {
        this.bombs--;
      }
      this.flags++;
    } else {
      this.bombs++;
      this.flags--;
    }
  }
}
