import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ProductListComponent } from './components/product/product.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core'
import { MultiTranslateHttpLoader } from "ngx-translate-multi-http-loader";
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { ModalContentComponent } from './components/modal-content/modal-content.component';
import { ModalService } from './services/modal.service';

export function HttpLoaderFactory(http: HttpClient) {
  return new MultiTranslateHttpLoader(http, [
    { prefix: "./assets/i18n/", suffix: "/category.json" },
    { prefix: "./assets/i18n/", suffix: "/chairs.json" },
  ]);
}

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    ModalContentComponent
  ],
  entryComponents: [ModalContentComponent],
  imports: [
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    BrowserModule,
    HttpClientModule,
    NgbModule
  ],
  providers: [ModalService],
  bootstrap: [AppComponent]
})
export class AppModule { }
