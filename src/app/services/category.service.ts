import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable, of, Subject } from 'rxjs';
import { ICategory } from '../models/category.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) {
  }

  public getJSON(): Observable<any> {
    return this.http.get("./assets/data/en/category.json");
  }

  public getCategories(): Observable<ICategory[]> {
    let categorySubject = new Subject<ICategory[]>();
    let categories: ICategory[];

    this.getJSON().subscribe(response => {
      categories = <ICategory[]>response["data"];
      categorySubject.next(categories);
    });

    return categorySubject.asObservable();
  }
}
