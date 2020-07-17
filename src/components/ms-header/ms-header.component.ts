import { Component, Input } from '@angular/core';
import { IconDefinition, faBomb, faClock, faFlag } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-ms-header',
  templateUrl: './ms-header.component.html',
  styleUrls: ['./ms-header.component.scss']
})
export class MsHeaderComponent {

  public timer: number;
  @Input() bombs: number;
  @Input() flags: number;
  @Input() win: boolean;

  // Icons
  public faClock: IconDefinition = faClock;
  public faBomb: IconDefinition = faBomb;
  public faFlag: IconDefinition = faFlag;

  constructor() {
    this.timer = 0;
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
