import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MsGridComponent } from './../components/ms-grid/ms-grid.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MsHeaderComponent } from '../components/ms-header/ms-header.component';
import { MenuComponent } from '../components/menu/menu.component';

@NgModule({
  declarations: [
    AppComponent,
    MsGridComponent,
    MsHeaderComponent,
    MenuComponent
  ],
  imports: [
    BrowserModule,
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
