import { Component, OnInit } from '@angular/core';
import { ProductService } from './services/product.service';
import { CategoryService } from './services/category.service';
import { IProduct } from './models/product.interface';
import { IChair } from './models/chair.interface';
import { ICategory } from './models/category.interface';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Language } from './enums/lang.enum';
import { ModalService } from './services/modal.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(
    private translate: TranslateService,
    private modalService: ModalService,
    private productService: ProductService,
    private categoryService: CategoryService) {
    translate.addLangs(['en', 'hu']);
    translate.setDefaultLang('hu');

    translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.loadData();
    });
  }

  private products: IProduct[];
  private categories: ICategory[];

  title = 'frontend-test';
  languages: typeof Language = Language;

  filterText: string;
  filteredChairList: IChair[];
  allChair: IChair[];

  ngOnInit() {
    let lang = localStorage.getItem('lang');

    if (!lang) {
      this.translate.use(Language.HU.toString());
      localStorage.setItem('lang', Language.HU.toString());
    } else {
      this.translate.use(lang);
    }

    this.allChair = new Array<IChair>();
    this.filteredChairList = new Array<IChair>();
    this.loadData();
  }

  private loadData() {
    this.loadProducts();
  }

  private loadProducts() {
    this.productService.getProducts()
      .subscribe((products: IProduct[]) => {
        this.products = products;
        this.categoryService.getCategories().subscribe(
          (categories: ICategory[]) => {
            this.categories = categories;
            this.initializeChairList();
          },
          error => console.log('error: ', error)
        );
      },
        error => console.log('error: ', error)
      );
  }

  private initializeChairList() {
    this.allChair = this.products.map(this.productToChair);
    this.allChair.map(chair => {
      chair.categoryName = this.getCategoryName(chair.categoryId);
    });

    this.filteredChairList = this.allChair;
  }

  private productToChair(product: IProduct, index): IChair {

    let chairItem: IChair = {
      id: product.id,
      title: product.title,
      categoryId: product.category,
      categoryName: null,
      description: product.description,
      visible: product.visible
    };
    return chairItem;
  }

  private getCategoryName(categoryId: number): string {
    let category = this.categories.find(c => c.id == categoryId);

    return category ? category.name : null;
  }

  private filterChairs(filterText: string) {
    filterText = filterText.trim().toLowerCase();

    this.filteredChairList = this.allChair.filter(
      c => c.categoryName.toLowerCase().includes(filterText) ||
        c.title.toLowerCase().includes(filterText) ||
        c.description.toLowerCase().includes(filterText));
  }

  onSearchChange(e): void {
    this.modalService.showModal("hello", "body text");

    this.filterChairs(e.target.value);
  }

  onTranslationClicked(e, lang: Language): void {
    e.preventDefault();

    if (this.translate.store.currentLang != lang.toString()) {

      this.translate.use(lang.toString());
      localStorage.setItem('lang', lang.toString());
    }
  }

  getActiveLang(lang: Language): boolean {
    return this.translate.store.currentLang == lang.toString();
  }

}
