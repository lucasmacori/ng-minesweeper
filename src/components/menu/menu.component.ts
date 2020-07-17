import { Component, Output, EventEmitter } from '@angular/core';
import { IconDefinition, faWrench, faBomb } from '@fortawesome/free-solid-svg-icons';
import { MenuSelection } from './../../models/menuSelection.model';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {

  @Output() selection: EventEmitter<MenuSelection>;

  // Icons
  public faBomb: IconDefinition = faBomb;
  public faWrench: IconDefinition = faWrench;

  constructor() {
    this.selection = new EventEmitter<MenuSelection>();
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

}
