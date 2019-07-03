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

  filteredChairList: IChair[];

  ngOnInit() {
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
    this.filteredChairList = this.products.map(this.productToChair);
    this.filteredChairList.map(chair => {
      chair.categoryName = this.getCategoryName(chair.categoryId);
    });

    console.log(this.filteredChairList);
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
}
