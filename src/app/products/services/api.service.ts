import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  searchTerm = new BehaviorSubject("")
  cartItemCount = new BehaviorSubject("0")
  BASE_URL = 'https://ecart-dcz7.onrender.com'

  constructor(private http:HttpClient) {
    this.cartCount()
   }

  getAllProducts(){
    return this.http.get(`${this.BASE_URL}/products/get-all-products`)
  }

  viewProduct(id:any){
    return this.http.get(`${this.BASE_URL}/products/${id}`)
  }

  addToWishlist(product:any){
    const body = {
   id: product.id,
   title: product.title,
   price: product.price,
   image: product.image
    }
    return this.http.post(`${this.BASE_URL}/products/wishlist`,body)
  }
 getWishlistItems(){
  return this.http.get(`${this.BASE_URL}/wishlist/get-all-items`)
 }

 removeWishlistItem(id:any){
  return this.http.delete(`${this.BASE_URL}/wishlists/remove-item/${id}`)
 }

 addToCart(product:any){
  const body = {
    id:product.id,
    title:product.title,
    price:product.price,
    image:product.image,
    quantity:product.quantity
  }
  return this.http.post(`${this.BASE_URL}/cart/Add-to-cart`,body)
 }

 getcart(){
  return this.http.get(`${this.BASE_URL}/cart/get-All-items`)
 }

 cartCount(){
  this.getcart().subscribe(
    (result: any) => {
      this.cartItemCount.next(result.length)
    }
  )
 }

 removeCartItem(id:any){
  return this.http.delete(`${this.BASE_URL}/cart/item/${id}`)
 }

 incrCartItem(id:any){
  return this.http.get(`${this.BASE_URL}/cart/incr-item/${id}`)
 }

 decrCartItem(id:any){
  return this.http.get(`${this.BASE_URL}/cart/decr-item/${id}`)

 }

 emptyCart(){
  return this.http.delete(`${this.BASE_URL}/cart/empty-cart`)
 }


}
   