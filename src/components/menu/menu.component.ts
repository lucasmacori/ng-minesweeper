import { Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { IconDefinition, faWrench, faBomb, faArrowLeft, faHeart, faTrophy } from '@fortawesome/free-solid-svg-icons';
import { faGithub, faAngular } from '@fortawesome/free-brands-svg-icons';
import { MenuSelection } from './../../models/menuSelection.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Score } from 'src/models/score.model';
import { ConfigService } from 'src/services/config.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  @Output() selection: EventEmitter<MenuSelection>;

  // Icons
  public faBomb: IconDefinition = faBomb;
  public faWrench: IconDefinition = faWrench;
  public faArrowLeft: IconDefinition = faArrowLeft;
  public faTrophy: IconDefinition = faTrophy;
  public faAngular: IconDefinition = faAngular;
  public faHeart: IconDefinition = faHeart;
  public faGithub: IconDefinition = faGithub;

  // Custom menu
  public showCustomMenu: boolean;
  public customFormGroup: FormGroup;
  public customSubmitClasses: object;

  // Scores menu
  public showScoresMenu: boolean
  public scores: Array<Score>;

  constructor(private configService: ConfigService) {
    this.selection = new EventEmitter<MenuSelection>();
    this.showCustomMenu = false;
    this.showScoresMenu = false;
  }

  public ngOnInit(): void {
    this.customFormGroup = new FormGroup({
      cols: new FormControl('', [ Validators.min(4), Validators.max(50), Validators.required ]),
      rows: new FormControl('', [ Validators.min(4), Validators.max(50), Validators.required ])
    });
    this.customSubmitClasses = { invalid: !this.customFormGroup.valid };
    this.customFormGroup.valueChanges.subscribe(() => {
      this.customSubmitClasses = { invalid: !this.customFormGroup.valid };
    });
  }

  /**
   * 
   * @param mode The selected difficulty mode
   * @param width The number of columns (if custom mode)
   * @param height The number of rows (if custom mode)
   */
  public selectMode(mode: string, width?: number, height?: number): void {
    const menuSelection: MenuSelection = { width: 0, height: 0, mode: '' };
    
    // Selecting the mode
    switch (mode.toUpperCase()) {
      case 'EASY':
        menuSelection.width = 5;
        menuSelection.height = 5;
        menuSelection.mode = 'EASY';
        break;
      case 'NORMAL':
        menuSelection.width = 9;
        menuSelection.height = 9;
        menuSelection.mode = 'NORMAL';
        break;
      case 'HARD':
        menuSelection.width = 15;
        menuSelection.height = 15;
        menuSelection.mode = 'HARD';
        break;
      case 'HARDCORE':
        menuSelection.width = 30;
        menuSelection.height = 30;
        menuSelection.mode = 'HARDCORE';
        break;
      case 'CUSTOM':
        menuSelection.width = width;
        menuSelection.height = height;
        menuSelection.mode = 'CUSTOM';
        if (!width || !height) {
          return;
        }
        break;
      default: return;
    }

    // Sending the settings to parent component
    this.selection.emit(menuSelection);
  }

  /**
   * Fetches the number of rows and columns and starts the custom mode
   */
  public selectCustomMode(): void {
    if (this.customFormGroup.valid) {
      const width = this.customFormGroup.value.cols;
      const height = this.customFormGroup.value.rows;
      this.selectMode('CUSTOM', width, height);
    }
  }

  /**
   * Shows or hides the custom mode menu
   */
  public toggleCustomMenu(): void {
    this.showCustomMenu = !this.showCustomMenu;
  }

  /**
   * Shows or hides the scores menu
   */
  public toggleScoresMenu(): void {
    this.showScoresMenu = !this.showScoresMenu;

    // Fetching the scores from the database
    if (this.showScoresMenu) {
      this.scores = this.configService.getScores();
      this.scores = this.renameAttribute(this.scores, 'score_mode', 'mode');
      this.scores = this.renameAttribute(this.scores, 'score_cols', 'cols');
      this.scores = this.renameAttribute(this.scores, 'score_rows', 'rows');
      this.scores = this.renameAttribute(this.scores, 'score_bombs', 'bombs');
      this.scores = this.renameAttribute(this.scores, 'score_time', 'time');
      this.scores = this.renameAttribute(this.scores, 'score_date', 'date');
    }

    console.log(this.scores);
  }

  private renameAttribute(objs: Array<Score>, oldAttribute: string, newAttribute: string): Array<Score> {
    objs.forEach(function(e) {
      e[newAttribute] = e[oldAttribute];
      delete e[oldAttribute];    
    });
    return objs;
  }
}
