package com.model2.mvc.service.domain;

import java.sql.Date;

public class Purchase {
	private User buyer;
	private String divyAddr;
	private String divyDate;
	private String divyRequest;
	private Date orderDate;
	private String paymentOption;
	private Product purchaseProd;
	private String receiverName;
	private String receiverPhone; // 원본 저장 (DB에서 그대로 들어옴)
	private String tranCode;
	private int tranNo;

	private Date cancelDate;
	private String cancelUser;

	String ORDERED = "001"; // 주문완료
	String SHIPPING = "002"; // 배송중
	String DELIVERED = "003"; // 배송완료
	String CANCEL_REQUESTED = "004"; // 취소요청
	String CANCEL_CONFIRMED = "005"; // 취소확인

	public Purchase() {
	}

	// ==========================
	// Getter / Setter
	// ==========================
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

	// ==========================
	// 추가: 포맷팅된 연락처 Getter
	// ==========================
	public String getFormattedReceiverPhone() {
		if (receiverPhone != null && receiverPhone.length() == 11) {
			return receiverPhone.substring(0, 3) + "-" + receiverPhone.substring(3, 7) + "-"
					+ receiverPhone.substring(7);
		}
		return receiverPhone; // 11자리가 아니면 그대로 반환
	}

	public Date getCancelDate() {
		return cancelDate;
	}

	public void setCancelDate(Date cancelDate) {
		this.cancelDate = cancelDate;
	}

	public String getCancelUser() {
		return cancelUser;
	}

	public void setCancelUser(String cancelUser) {
		this.cancelUser = cancelUser;
	}

	@Override
	public String toString() {
		return "PurchaseVO [buyer=" + buyer + ", divyAddr=" + divyAddr + ", divyDate=" + divyDate + ", divyRequest="
				+ divyRequest + ", orderDate=" + orderDate + ", paymentOption=" + paymentOption + ", purchaseProd="
				+ purchaseProd + ", receiverName=" + receiverName + ", receiverPhone=" + receiverPhone + ", tranCode="
				+ tranCode + ", tranNo=" + tranNo + "]";
	}
}
