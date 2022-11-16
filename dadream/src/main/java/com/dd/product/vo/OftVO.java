package com.dd.product.vo;

import java.sql.Date;

import org.springframework.stereotype.Component;

@Component("otvVO")
public class OftVO {
	private String user_Id;
	private String order_Num;
	private String order_GetName;
	private String order_Address1;
	private String order_Address2;
	private String order_Address3;
	private int order_Phone;
	private String order_Rqd;
	private String order_State;
	private String product_Name;
	private int product_Count;
	private int product_TotalPrice;
	private Date order_Date;
	private int product_Price;
	private int product_Num;

	public OftVO() {

	}

	public OftVO(String user_Id, String order_Num, String order_GetName, String order_Address1, String order_Address2,
			String order_Address3, int order_Phone, String order_Rqd, String order_State, String product_Name,
			int product_Count, int product_TotalPrice, Date order_Date, int product_Price, int product_Num) {
		super();
		this.user_Id = user_Id;
		this.order_Num = order_Num;
		this.order_GetName = order_GetName;
		this.order_Address1 = order_Address1;
		this.order_Address2 = order_Address2;
		this.order_Address3 = order_Address3;
		this.order_Phone = order_Phone;
		this.order_Rqd = order_Rqd;
		this.order_State = order_State;
		this.product_Name = product_Name;
		this.product_Count = product_Count;
		this.product_TotalPrice = product_TotalPrice;
		this.order_Date = order_Date;
		this.product_Price = product_Price;
		this.product_Num = product_Num;
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

	public String getOrder_GetName() {
		return order_GetName;
	}

	public void setOrder_GetName(String order_GetName) {
		this.order_GetName = order_GetName;
	}

	public String getOrder_Address1() {
		return order_Address1;
	}

	public void setOrder_Address1(String order_Address1) {
		this.order_Address1 = order_Address1;
	}

	public String getOrder_Address2() {
		return order_Address2;
	}

	public void setOrder_Address2(String order_Address2) {
		this.order_Address2 = order_Address2;
	}

	public String getOrder_Address3() {
		return order_Address3;
	}

	public void setOrder_Address3(String order_Address3) {
		this.order_Address3 = order_Address3;
	}

	public int getOrder_Phone() {
		return order_Phone;
	}

	public void setOrder_Phone(int order_Phone) {
		this.order_Phone = order_Phone;
	}

	public String getOrder_Rqd() {
		return order_Rqd;
	}

	public void setOrder_Rqd(String order_Rqd) {
		this.order_Rqd = order_Rqd;
	}

	public String getOrder_State() {
		return order_State;
	}

	public void setOrder_State(String order_State) {
		this.order_State = order_State;
	}

	public String getProduct_Name() {
		return product_Name;
	}

	public void setProduct_Name(String product_Name) {
		this.product_Name = product_Name;
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

	public Date getOrder_Date() {
		return order_Date;
	}

	public void setOrder_Date(Date order_Date) {
		this.order_Date = order_Date;
	}

	public int getProduct_Price() {
		return product_Price;
	}

	public void setProduct_Price(int product_Price) {
		this.product_Price = product_Price;
	}

	public int getProduct_Num() {
		return product_Num;
	}

	public void setProduct_Num(int product_Num) {
		this.product_Num = product_Num;
	}

}
