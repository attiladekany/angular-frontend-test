import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { IProduct } from 'src/app/models/product.model';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  constructor(private productService: ProductService) { }

  products: IProduct[];

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts()
      .subscribe((data) => {
        this.products = data;
      })
  }

}
