package com.dd.product.vo;

import java.util.List;

import org.springframework.stereotype.Component;

@Component("cartVO")
public class CartVO {
	private int cart_Num;
	private int cart_BuytCount;
	private int product_Num;
	private String user_Id;
	private int order_Num;
//	productVO 1:n 관계

//	추가
	private String product_Option1;
	private String product_Option2;
	private String product_Image;
	private String product_Name;
	private int product_Price;
	private int product_Count;

	private List<ProductVO> product;

	public CartVO() {

	}

	public CartVO(int cart_Num, int cart_BuytCount, int product_Num, String user_Id, List<ProductVO> product,
			String product_Option1, String product_Option2, String product_Image, String product_Name,
			int product_Price, int order_Num, int product_Count) {
		this.cart_Num = cart_Num;
		this.cart_BuytCount = cart_BuytCount;
		this.product_Num = product_Num;
		this.user_Id = user_Id;
		this.product = product;
		this.product_Option1 = product_Option1;
		this.product_Option2 = product_Option2;
		this.product_Image = product_Image;
		this.product_Name = product_Name;
		this.product_Price = product_Price;
		this.order_Num = order_Num;
		this.product_Count = product_Count;
	}

	public int getCart_Num() {
		return cart_Num;
	}

	public void setCart_Num(int cart_Num) {
		this.cart_Num = cart_Num;
	}

	public int getCart_BuytCount() {
		return cart_BuytCount;
	}

	public void setCart_BuytCount(int cart_BuytCount) {
		this.cart_BuytCount = cart_BuytCount;
	}

	public int getProduct_Num() {
		return product_Num;
	}

	public void setProduct_Num(int product_Num) {
		this.product_Num = product_Num;
	}

	public String getUser_Id() {
		return user_Id;
	}

	public void setUser_Id(String user_Id) {
		this.user_Id = user_Id;
	}

	public List<ProductVO> getProduct() {
		return product;
	}

	public void setProduct(List<ProductVO> productVO) {
		this.product = productVO;
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

	public String getProduct_Image() {
		return product_Image;
	}

	public void setProduct_Image(String product_Image) {
		this.product_Image = product_Image;
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

	public int getOrder_Num() {
		return order_Num;
	}

	public void setOrder_Num(int order_Num) {
		this.order_Num = order_Num;
	}

	public int getProduct_Count() {
		return product_Count;
	}

	public void setProduct_Count(int product_Count) {
		this.product_Count = product_Count;
	}

}
