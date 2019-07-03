import { Component, OnInit } from '@angular/core';
import { ProductService } from './services/product.service';
import { CategoryService } from './services/category.service';
import { IProduct } from './models/product.interface';
import { IChair } from './models/chair.interface';
import { ICategory } from './models/category.interface';
import { debug } from 'util';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'frontend-test';
  constructor(
    private productService: ProductService,
    private categoryService: CategoryService) {
  }

  private products: IProduct[];
  private categories: ICategory[];

  filterText: string;
  filteredChairList: IChair[];
  allChair: IChair[];

  ngOnInit() {
    this.allChair = new Array<IChair>();
    this.filteredChairList = new Array<IChair>();
    this.loadData();
  }

  loadData() {
    this.loadProducts();
  }

  loadProducts() {
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

  initializeChairList() {
    this.allChair = this.products.map(this.productToChair);
    this.allChair.map(chair => {
      chair.categoryName = this.getCategoryName(chair.categoryId);
    });

    this.filteredChairList = this.allChair;
  }

  productToChair(product: IProduct, index): IChair {

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

  getCategoryName(categoryId: number): string {
    let category = this.categories.find(c => c.id == categoryId);

    return category ? category.name : null;
  }

  onSearchChange(e): void {
    this.filterChairs(e.target.value);
  }

  filterChairs(filterText: string) {
    filterText = filterText.trim().toLowerCase();

    this.filteredChairList = this.allChair.filter(
      c => c.categoryName.toLowerCase().includes(filterText) || 
      c.title.toLowerCase().includes(filterText) ||
      c.description.toLowerCase().includes(filterText));
  }

}
