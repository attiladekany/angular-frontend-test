import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { IProduct } from 'src/app/models/product.interface';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: '[app-product-list]',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductListComponent implements OnInit {

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService
  ) { }

  products: IProduct[];
  filteredProducts: IProduct[];

  ngOnInit() {
    this.loadProducts();

    this.categoryService.getCategories().subscribe((data) => {
      console.log(data);
    },
      error => console.log('error: ', error)

    );
  }

  loadProducts() {
    this.productService.getProducts()
      .subscribe((data) => {
        this.products = data;
        this.filteredProducts = this.products;
      },
        error => console.log('error: ', error)
      )
  }

}
