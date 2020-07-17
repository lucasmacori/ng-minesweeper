import { Component, ChangeDetectorRef } from '@angular/core';
import { MenuSelection } from 'src/models/menuSelection.model';
import { IconDefinition, faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'minesweeper';

  // Icons
  public faTimes: IconDefinition = faTimes;

  // Menu
  public selected: boolean;
  public menuSelection: MenuSelection;

  // Game
  public bombs: number;
  public flags: number;
  public win: boolean;

  constructor (private changeDetector: ChangeDetectorRef) {
    this.selected = false;
  }

  public selection(menuSelection: MenuSelection): void {
    this.selected = true;
    this.menuSelection = menuSelection;
  }

  public restart(bombs: number): void {
    this.win = undefined;
    this.bombs = bombs;
    this.flags = 0;
    this.changeDetector.detectChanges();
  }

  /**
   * Display end of the game
   * @param win Whether the user won or not
   */
  public endGame(win: boolean): void {
    this.win = win;
  }

  /**
   * Stops the game and go back to the main menu
   */
  public stop(): void {
    this.menuSelection = undefined;
    this.selected = false;
  }

  /**
   * Removes or add a fl in the header component
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
