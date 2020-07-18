import { Component, ChangeDetectorRef, ViewChild } from '@angular/core';
import { MenuSelection } from 'src/models/menuSelection.model';
import { IconDefinition, faTimes } from '@fortawesome/free-solid-svg-icons';
import { MsHeaderComponent } from 'src/components/ms-header/ms-header.component';
import { ConfigService } from 'src/services/config.service';
import { Score } from 'src/models/score.model';
import { MsGridComponent } from 'src/components/ms-grid/ms-grid.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'minesweeper';

  @ViewChild('header') header: MsHeaderComponent;
  @ViewChild('grid') grid: MsGridComponent;

  // Icons
  public faTimes: IconDefinition = faTimes;

  // Menu
  public selected: boolean;
  public menuSelection: MenuSelection;

  // Game
  public bombs: number;
  public flags: number;
  public win: boolean;

  constructor (private changeDetector: ChangeDetectorRef, private configService: ConfigService) {
    this.selected = false;
  }

  /**
   * Sets up the game with the menu settings
   * @param menuSelection The difficulity settings chosen in the main menu
   */
  public selection(menuSelection: MenuSelection): void {
    this.selected = true;
    this.menuSelection = menuSelection;
  }

  /**
   * (Re)Starts the game
   * @param bombs The number of bombs in the grid
   */
  public restart(bombs: number): void {
    this.win = undefined;
    this.bombs = bombs;
    this.flags = 0;
    this.changeDetector.detectChanges();
    this.header.startTimer();
  }

  /**
   * Display end of the game
   * @param win Whether the user won or not
   */
  public endGame(win: boolean): void {
    this.win = win;
    this.header.stopTimer();

    // If the player won, saving their score in the database
    if (win) {
      const score: Score = {
        cols: this.menuSelection.width,
        rows: this.menuSelection.height,
        bombs: this.grid.bombs,
        time: this.header.timer
      };
  
      // Saving the score
      this.configService.saveScore(score);
    }
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
