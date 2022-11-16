package com.dd.product.vo;

import java.util.Date;
import java.util.List;

import org.springframework.stereotype.Component;

import com.dd.dealing.vo.MemberVO;

@Component("orderVO")
public class OrderVO {
	private String user_Id;
	private String order_Num;
	private int product_Num;
	private String product_Name;
	private int product_Price;
	private Date order_Date;
	private int product_TotalCount;
	private int cart_Num;
	private int product_TotalPrice;
	private int product_Count;
	private String product_Option1;
	private String product_Option2;
	private String product_Image;
	private List<CartVO> cart;
	private List<ProductVO> product;
	private List<MemberVO> member;
	private List<OrderVO> orderList;

	public OrderVO() {
	}

	public OrderVO(String user_Id, String order_Num, int product_Num, String product_Name, int product_Price,
			int product_TotalCount, int cart_Num, int product_TotalPrice, int product_Count, String product_Image,
			String product_Option1, String product_Option2) {
		this.user_Id = user_Id;
		this.order_Num = order_Num;
		this.product_Num = product_Num;
		this.product_Name = product_Name;
		this.product_Price = product_Price;
		this.product_TotalCount = product_TotalCount;
		this.cart_Num = cart_Num;
		this.product_Price = product_Price;
		this.product_Image = product_Image;
		this.product_Option1 = product_Option1;
		this.product_Option2 = product_Option2;
	}

	public String getUser_Id() {
		return user_Id;
	}

	public void setUser_Id(String user_Id) {
		this.user_Id = user_Id;
	}

	public String getOrder_Num() {
		return order_Num;
	}

	public void setOrder_Num(String order_Num) {
		this.order_Num = order_Num;
	}

	public int getProduct_Num() {
		return product_Num;
	}

	public void setProduct_Num(int product_Num) {
		this.product_Num = product_Num;
	}

	public String getProduct_Name() {
		return product_Name;
	}

	public void setProduct_Name(String product_Name) {
		this.product_Name = product_Name;
	}

	public int getProduct_Price() {
		return product_Price;
	}

	public void setProduct_Price(int product_Price) {
		this.product_Price = product_Price;
	}

	public Date getOrder_Date() {
		return order_Date;
	}

	public void setOrder_Date(Date order_Date) {
		this.order_Date = order_Date;
	}

	public int getProduct_TotalCount() {
		return product_TotalCount;
	}

	public void setProduct_TotalCount(int product_TotalCount) {
		this.product_TotalCount = product_TotalCount;
	}

	public int getCart_Num() {
		return cart_Num;
	}

	public void setCart_Num(int cart_Num) {
		this.cart_Num = cart_Num;
	}

	public int getProduct_Count() {
		return product_Count;
	}

	public void setProduct_Count(int product_Count) {
		this.product_Count = product_Count;
	}

	public int getProduct_TotalPrice() {
		return product_TotalPrice;
	}

	public void setProduct_TotalPrice(int product_TotalPrice) {
		this.product_TotalPrice = product_TotalPrice;
	}

	public List<CartVO> getCart() {
		return cart;
	}

	public void setCart(List<CartVO> cart) {
		this.cart = cart;
	}

	public List<ProductVO> getProduct() {
		return product;
	}

	public void setProduct(List<ProductVO> product) {
		this.product = product;
	}

	public List<MemberVO> getMember() {
		return member;
	}

	public void setMember(List<MemberVO> member) {
		this.member = member;
	}

	public String getProduct_Image() {
		return product_Image;
	}

	public void setProduct_Image(String product_Image) {
		this.product_Image = product_Image;
	}

	public String getProduct_Option1() {
		return product_Option1;
	}

	public void setProduct_Option1(String product_Option1) {
		this.product_Option1 = product_Option1;
	}

	public String getProduct_Option2() {
		return product_Option2;
	}

	public void setProduct_Option2(String product_Option2) {
		this.product_Option2 = product_Option2;
	}

	public void Total() {
		this.product_TotalPrice = this.product_Count * this.product_Price;
	}

	public List<OrderVO> getOrderList() {
		return orderList;
	}

	public void setOrderList(List<OrderVO> orderList) {
		this.orderList = orderList;
	}

}
