import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.css']
})
export class AllProductsComponent implements OnInit {

  products:any = [];
  searchKey:string = ""
 
  constructor(private api:ApiService){

  }

  ngOnInit(): void {
    this.api.getAllProducts().subscribe(
      (result:any) => {
        this.products = result;
        console.log(this.products);
        
        
      },
      (result:any) =>{
        console.log(result.error)
      }
    )
  this.api.searchTerm.subscribe(
    (result:any) => {
      this.searchKey = result
    }
  )

  }

  addtocart(product:any){
    Object.assign(product,{quantity:1})

    this.api.addToCart(product).subscribe(
      (result) => {
        this.api.cartCount()
        alert(result)
      },
      (result) => {
        alert(result.error)
      }
    )
    
  }

}
 