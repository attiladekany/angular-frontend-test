import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { IProduct } from '../models/product.interface';
import { TranslateService } from '@ngx-translate/core';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(
    private http: HttpClient,
    private translate: TranslateService) {
  }

  public getJSON(): Observable<any> {
    return this.http.get("./assets/i18n/" + this.translate.store.currentLang + "/chairs.json");
  }

  public getProducts(): Observable<IProduct[]> {
    let productSubject = new Subject<IProduct[]>();
    let products: IProduct[];

    this.getJSON().subscribe(response => {
      products = <IProduct[]>response["data"];
      productSubject.next(products);
    });

    return productSubject.asObservable();
  }
}
