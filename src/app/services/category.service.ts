import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable, Subject } from 'rxjs';
import { ICategory } from '../models/category.interface';
import { TranslateService } from '@ngx-translate/core/';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(
    private http: HttpClient,
    private translate: TranslateService) {
  }

  public getJSON(): Observable<any> {
    return this.http.get("./assets/i18n/" + this.translate.store.currentLang + "/category.json");
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
