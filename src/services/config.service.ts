import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { Score } from 'src/models/score.model';
import { Subject } from 'rxjs';

@Injectable()
export class ConfigService {

  constructor(private electronService: ElectronService) { }

  /**
   * Saves a new score in the database
   * @param score The score to save
   */
  public saveScore(score: Score): void {
    if (this.electronService.isElectronApp) {
      this.electronService.ipcRenderer.send('saveScore', score);
    }
  }

  /**
   * Fetches the saved scores from the databse
   */
  public getScores(): Array<Score> {
    let scores = new Array<Score>();
    if (this.electronService.isElectronApp) {
      scores = this.electronService.ipcRenderer.sendSync('getScores');
    }
    return scores;
  }
}
