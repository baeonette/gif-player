import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { InputComponent } from './components/input/input.component';
import { HomeComponent } from './components/home/home.component';
import { GifsComponent } from './components/gifs/gifs.component';
import { PlayingComponent } from './components/playing/playing.component';

@NgModule({
  declarations: [
    AppComponent,
    InputComponent,
    HomeComponent,
    GifsComponent,
    PlayingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
