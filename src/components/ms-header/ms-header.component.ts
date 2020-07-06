import { Component, OnInit, Input } from '@angular/core';
import { IconDefinition, faBomb } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-ms-header',
  templateUrl: './ms-header.component.html',
  styleUrls: ['./ms-header.component.scss']
})
export class MsHeaderComponent implements OnInit {

  @Input() bombs: number;

  // Icons
  public faBomb: IconDefinition = faBomb;

  constructor() { }

  ngOnInit(): void {
  }

}
