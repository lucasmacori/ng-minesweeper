import { Component, OnInit, Input } from '@angular/core';
import { IconDefinition, faBomb, faClock, faFlag } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-ms-header',
  templateUrl: './ms-header.component.html',
  styleUrls: ['./ms-header.component.scss']
})
export class MsHeaderComponent implements OnInit {

  public timer: number;
  @Input() bombs: number;
  @Input() flags: number;

  // Icons
  public faClock: IconDefinition = faClock;
  public faBomb: IconDefinition = faBomb;
  public faFlag: IconDefinition = faFlag;

  constructor() {
    this.timer = 0;
  }

  ngOnInit(): void {
  }

}
