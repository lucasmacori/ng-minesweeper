import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { IconDefinition, faWrench, faBomb, faArrowLeft, faHeart } from '@fortawesome/free-solid-svg-icons';
import { faGithub, faAngular } from '@fortawesome/free-brands-svg-icons';
import { MenuSelection } from './../../models/menuSelection.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';

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
  public faAngular: IconDefinition = faAngular;
  public faHeart: IconDefinition = faHeart;
  public faGithub: IconDefinition = faGithub;

  // Custom menu
  public showCustomMenu: boolean;
  public customFormGroup: FormGroup;
  public customSubmitClasses: object;

  constructor() {
    this.selection = new EventEmitter<MenuSelection>();
    this.showCustomMenu = false;
  }

  public ngOnInit(): void {
    this.customFormGroup = new FormGroup({
      cols: new FormControl('', [ Validators.min(4), Validators.max(99999), Validators.required ]),
      rows: new FormControl('', [ Validators.min(4), Validators.max(99999), Validators.required ])
    });
    this.customSubmitClasses = { invalid: !this.customFormGroup.valid };
    this.customFormGroup.valueChanges.subscribe(() => {
      this.customSubmitClasses = { invalid: !this.customFormGroup.valid };
    });
  }

  public selectMode(mode: string, width?: number, height?: number): void {
    const menuSelection: MenuSelection = { width: 0, height: 0};
    
    // Selecting the mode
    switch (mode.toUpperCase()) {
      case 'EASY':
        menuSelection.width = 5;
        menuSelection.height = 5;
        break;
      case 'NORMAL':
        menuSelection.width = 9;
        menuSelection.height = 9;
        break;
      case 'HARD':
        menuSelection.width = 15;
        menuSelection.height = 15;
        break;
      case 'HARDCORE':
        menuSelection.width = 30;
        menuSelection.height = 30;
        break;
      case 'CUSTOM':
        menuSelection.width = width;
        menuSelection.height = height;
        if (!width || !height) {
          return;
        }
        break;
      default: return;
    }

    // Sending the settings to parent component
    this.selection.emit(menuSelection);
  }

  public selectCustomMode(): void {
    if (this.customFormGroup.valid) {
      const width = this.customFormGroup.value.cols;
      const height = this.customFormGroup.value.rows;
      this.selectMode('CUSTOM', width, height);
    }
  }

  public toggleCustomMenu(): void {
    this.showCustomMenu = !this.showCustomMenu;
  }
}
