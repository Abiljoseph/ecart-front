import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.css']
})
export class ViewProductComponent implements OnInit {

  productId:string = ""
  product:any= {}

  constructor(private viewActivatedRoute: ActivatedRoute, private api:ApiService){

  }

  ngOnInit(): void {
    this.viewActivatedRoute.params.subscribe((param:any) => {
      this.productId = param.id
      
    })
    this.api.viewProduct(this.productId).subscribe(
      (result:any) => {
        console.log(result);
        this.product = result
        
      },
      (result:any) => {
        console.log(result.error);
        
      }
    )

  }
  addTowishlist(product:any){
    this.api.addToWishlist(product)
    .subscribe ((result:any) => {
      alert(result);
    },
    (result:any) => {
      alert(result.error)
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
