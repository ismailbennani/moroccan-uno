import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './common/home/home.component';
import { PageNotFoundComponent } from './common/page-not-found/page-not-found.component';
import { RouterLink, RouterOutlet } from '@angular/router';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [AppComponent, HomeComponent, PageNotFoundComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterOutlet,
    SvgIconsModule.forRoot({
      icons: [],
      sizes: {
        xs: '10px',
        sm: '12px',
        md: '16px',
        lg: '20px',
        xl: '30px',
        xxl: '40px',
      },
      defaultSize: 'md',
    }),
    MatButtonModule,
    RouterLink,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
