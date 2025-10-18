package com.dd.product.vo;

import java.sql.Date;
import java.util.List;

import org.springframework.stereotype.Component;

@Component("productVO")
public class ProductVO {
	private int product_Num;
	private String product_Name;
	private int product_Price;
	private int product_TotalCount;
	private Date product_Date;
	private String product_Content;
	private String product_Image;
	private String user_Id;
	private int Product_Views;
	private String product_Option1;
	private String product_Option2;
	private List<OrderFinishVO> order;

	public ProductVO() {

	}

	public ProductVO(int product_Num, String product_Name, int product_Price, int product_TotalCount, Date product_Date,
			String product_Content, String product_Image, String user_Id, int product_Views, String product_Option1,
			String product_Option2) {
		super();
		this.product_Num = product_Num;
		this.product_Name = product_Name;
		this.product_Price = product_Price;
		this.product_TotalCount = product_TotalCount;
		this.product_Date = product_Date;
		this.product_Content = product_Content;
		this.product_Image = product_Image;
		this.user_Id = user_Id;
		Product_Views = product_Views;
		this.product_Option1 = product_Option1;
		this.product_Option2 = product_Option2;
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

	public int getProduct_TotalCount() {
		return product_TotalCount;
	}

	public void setProduct_TotalCount(int product_TotalCount) {
		this.product_TotalCount = product_TotalCount;
	}

	public Date getProduct_Date() {
		return product_Date;
	}

	public void setProduct_Date(Date product_Date) {
		this.product_Date = product_Date;
	}

	public String getProduct_Content() {
		return product_Content;
	}

	public void setProduct_Content(String product_Content) {
		this.product_Content = product_Content;
	}

	public String getProduct_Image() {
		return product_Image;
	}

	public void setProduct_Image(String product_Image) {
		this.product_Image = product_Image;
	}

	public String getUser_Id() {
		return user_Id;
	}

	public void setUser_Id(String user_Id) {
		this.user_Id = user_Id;
	}

	public int getProduct_Views() {
		return Product_Views;
	}

	public void setProduct_Views(int product_Views) {
		Product_Views = product_Views;
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

	public List<OrderFinishVO> getOrder() {
		return order;
	}

	public void setOrder(List<OrderFinishVO> order) {
		this.order = order;
	}

}
