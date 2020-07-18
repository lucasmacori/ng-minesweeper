import { Component, Input } from '@angular/core';
import { IconDefinition, faBomb, faClock, faFlag } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-ms-header',
  templateUrl: './ms-header.component.html',
  styleUrls: ['./ms-header.component.scss']
})
export class MsHeaderComponent {

  public timer: number;
  private timerStop: boolean;
  @Input() bombs: number;
  @Input() flags: number;
  @Input() win: boolean;

  // Icons
  public faClock: IconDefinition = faClock;
  public faBomb: IconDefinition = faBomb;
  public faFlag: IconDefinition = faFlag;

  constructor() {}

  /**
   * Starts the timer
   */
  public startTimer(): void {
    this.timer = 0;
    this.timerStop = false;
    setInterval(() => {
      if (!this.timerStop) {
        this.timer++;
      }
    }, 1000);
  }

  /**
   * Stops the timer
   */
  public stopTimer(): void {
    this.timerStop = true;
  }

  /**
   * Returns true if the player won
   */
  public isWin(): boolean {
    if (this.win !== undefined) {
      return this.win;
    }
    return false;
  }

  /**
   * Returns true if the player lost
   */
  public isLoose(): boolean {
    if (this.win !== undefined) {
      return !this.win;
    }
    return false;
  }

}
