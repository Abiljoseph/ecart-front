import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit{

  wishlistItems:any = []

  constructor(private api: ApiService){

  }

  ngOnInit(): void {
    this.api.getWishlistItems().subscribe(
      (result:any) => {
        console.log(result);
        this.wishlistItems = result
        
      },
      (result:any) =>{
        alert(result.error)
      }
    )
  }

  removeWishlistItem(id:any){
    this.api.removeWishlistItem(id).subscribe(
    (result:any) => {
      console.log(result);
      
        this.wishlistItems = result
      },
    (result:any)=> {
      console.log(result.error);
    }
    )
  }

  addtocart(product:any){
    Object.assign(product,{quantity:1})

    this.api.addToCart(product).subscribe(
      (result) => {
        this.api.cartCount()
        alert(result)
        this.removeWishlistItem(product.id)
      },
      (result) => {
        alert(result.error)
      }
    )
    
  }

}
