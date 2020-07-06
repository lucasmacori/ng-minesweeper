import { Component, ViewChild, AfterViewInit } from '@angular/core';
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

  ngAfterViewInit(): void {
    this.bombs = this.grid.bombs;
  }

  /**
   * Display end of the game
   * @param win Whether the user won or not
   */
  public endGame(win: boolean): void {

  }

  /**
   * Removes or add a bomb in the header component
   * @param flag Whether the user flagged or unflagged the cell
   */
  public toggleFlagCell(flag: boolean): void {
    if (flag) {
      this.bombs--;
    } else {
      this.bombs++;
    }
  }
}
