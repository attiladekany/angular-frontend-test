import { Component, Input } from '@angular/core';
import { IChair } from 'src/app/models/chair.interface';

@Component({
  selector: '[app-product-list]',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductListComponent {

  @Input() filteredChairList: IChair[]

  constructor(
  ) { }
  
}
