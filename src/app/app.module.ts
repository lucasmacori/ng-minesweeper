import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxElectronModule } from 'ngx-electron';

import { AppComponent } from './app.component';
import { MsGridComponent } from './../components/ms-grid/ms-grid.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MsHeaderComponent } from '../components/ms-header/ms-header.component';
import { MenuComponent } from '../components/menu/menu.component';
import { OnlyNumbersDirective } from '../directives/only-numbers.directive';
import { TimerPipe } from '../pipes/timer.pipe';
import { ConfigService } from 'src/services/config.service';

@NgModule({
  declarations: [
    AppComponent,
    MsGridComponent,
    MsHeaderComponent,
    MenuComponent,
    OnlyNumbersDirective,
    TimerPipe
  ],
  imports: [
    BrowserModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    NgxElectronModule
  ],
  providers: [ConfigService],
  bootstrap: [AppComponent]
})
export class AppModule { }
