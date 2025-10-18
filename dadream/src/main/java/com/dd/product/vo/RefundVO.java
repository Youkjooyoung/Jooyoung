package com.dd.product.vo;

import org.springframework.stereotype.Component;

@Component("refundVO")
public class RefundVO {
	private int refund_Num;
	private String user_Id;
	private String order_Num;
	private String refund_Name;
	private String refund_Content;

	public RefundVO() {
	}

	public RefundVO(int refund_Num, String user_Id, String order_Num, String refund_Name, String refund_Content) {
		this.refund_Num = refund_Num;
		this.user_Id = user_Id;
		this.order_Num = order_Num;
		this.refund_Name = refund_Name;
		this.refund_Content = refund_Content;
	}

	public int getRefund_Num() {
		return refund_Num;
	}

	public void setRefund_Num(int refund_Num) {
		this.refund_Num = refund_Num;
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

	public String getRefund_Name() {
		return refund_Name;
	}

	public void setRefund_Name(String refund_Name) {
		this.refund_Name = refund_Name;
	}

	public String getRefund_Content() {
		return refund_Content;
	}

	public void setRefund_Content(String refund_Content) {
		this.refund_Content = refund_Content;
	}

}
