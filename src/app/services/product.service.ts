import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { IProduct } from '../models/product.interface';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) {
  }

  public getJSON(): Observable<any> {
    return this.http.get("./assets/data/en/chairs.json");
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
