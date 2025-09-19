package com.model2.mvc.service.domain;

import java.sql.Date;

public class Purchase {
	private User buyer;
	private String divyAddr;	//배송주소
	private String divyDate;	//배송 희망일자
	private String divyRequest;	// 요구사항
	private Date orderDate;	//Date타입의 구매 일자
	private String paymentOption;	//지불방식
	private Product purchaseProd;	//ProductVO 타입의 구매 물품정보
	private String receiverName;		//받는 사람이름
	private String receiverPhone;	//받는 사람의 휴대폰번호
	private String tranCode;	//구매 상태코드
	private int tranNo;		//int 타입의 구매번호
	
	public Purchase(){
	}
	
	public User getBuyer() {
		return buyer;
	}
	public void setBuyer(User buyer) {
		this.buyer = buyer;
	}
	public String getDivyAddr() {
		return divyAddr;
	}
	public void setDivyAddr(String divyAddr) {
		this.divyAddr = divyAddr;
	}
	public String getDivyDate() {
		return divyDate;
	}
	public void setDivyDate(String divyDate) {
		this.divyDate = divyDate;
	}
	public String getDivyRequest() {
		return divyRequest;
	}
	public void setDivyRequest(String divyRequest) {
		this.divyRequest = divyRequest;
	}
	public Date getOrderDate() {
		return orderDate;
	}
	public void setOrderDate(Date orderDate) {
		this.orderDate = orderDate;
	}
	public String getPaymentOption() {
		return paymentOption;
	}
	public void setPaymentOption(String paymentOption) {
		this.paymentOption = paymentOption;
	}
	public Product getPurchaseProd() {
		return purchaseProd;
	}
	public void setPurchaseProd(Product purchaseProd) {
		this.purchaseProd = purchaseProd;
	}
	public String getReceiverName() {
		return receiverName;
	}
	public void setReceiverName(String receiverName) {
		this.receiverName = receiverName;
	}
	public String getReceiverPhone() {
		return receiverPhone;
	}
	public void setReceiverPhone(String receiverPhone) {
		this.receiverPhone = receiverPhone;
	}
	public String getTranCode() {
		return tranCode;
	}
	public void setTranCode(String tranCode) {
		this.tranCode = tranCode;
	}
	public int getTranNo() {
		return tranNo;
	}
	public void setTranNo(int tranNo) {
		this.tranNo = tranNo;
	}
	
	@Override
	public String toString() {
		return "PurchaseVO [buyer=" + buyer + ", divyAddr=" + divyAddr
				+ ", divyDate=" + divyDate + ", divyRequest=" + divyRequest
				+ ", orderDate=" + orderDate + ", paymentOption="
				+ paymentOption + ", purchaseProd=" + purchaseProd
				+ ", receiverName=" + receiverName + ", receiverPhone="
				+ receiverPhone + ", tranCode=" + tranCode + ", tranNo="
				+ tranNo + "]";
	}
}