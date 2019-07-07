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
    this.filterText = "";
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
    if (filterText) {
      filterText = filterText.trim().toLowerCase();
    }

    this.filteredChairList = this.allChair.filter(
      c => c.categoryName.toLowerCase().includes(filterText) ||
        c.title.toLowerCase().includes(filterText) ||
        c.description.toLowerCase().includes(filterText));
  }

  private validInput(value: string): boolean {
    const isLowerCaseLetter = (/[a-z]/.test(value));
    const isUpperCaseLetter = (/[A-Z]/.test(value));
    const isNumber = (/[0-9]/.test(value));

    return isLowerCaseLetter || isUpperCaseLetter || isNumber;
  }

  onSearchChange(e): void {
    // In order to avoid "view update itself scenario" --> 'ExpressionChangedAfterItHasBeenCheckedError' we need to trigger blur event manually
    // const input: HTMLInputElement = <HTMLInputElement>e.target;
    // input.blur();

    let str = String.fromCharCode(e.keyCode);

    if (!this.validInput(str)) {
      this.modalService.showModal(this.translate.store.currentLang == Language.HU.toString() ? "Figyelmeztetés!" : "Warning!",
        this.translate.store.currentLang == Language.HU.toString() ? "Csak nagybetű, kisbetű és szám az elfogadott!" : "The input must be letter or number.");
    }
  }

  filtering(e) {
    if (e.key == "Backspace" && this.filterText == '') {
      this.filteredChairList = this.allChair;
    }

    if (this.validInput(this.filterText)) {
      this.filterChairs(this.filterText);
    }
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
