package com.model2.mvc.service.domain;

import java.sql.Date;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@ToString
public class Purchase {

	private User buyer;
	private String divyAddr;
	private String divyDate;
	private String divyRequest;
	private Date orderDate;
	private String paymentOption;
	private Product purchaseProd;
	private String receiverName;
	private String receiverPhone;
	private String tranCode;
	private int tranNo;
	private Date cancelDate;
	private String cancelUser;
	private String cancelReason;
	private String zipcode;
	private String addrDetail;
	private int qty = 1;
	private int paymentAmount;

	public static final String ORDERED = "001";
	public static final String SHIPPING = "002";
	public static final String DELIVERED = "003";
	public static final String CANCEL_REQUESTED = "004";
	public static final String CANCEL_CONFIRMED = "005";

	public String getFormattedReceiverPhone() {
		if (receiverPhone != null && receiverPhone.length() == 11) {
			return receiverPhone.substring(0, 3) + "-" + receiverPhone.substring(3, 7) + "-"
					+ receiverPhone.substring(7);
		}
		return receiverPhone;
	}

	public void setQty(int qty) {
		this.qty = qty <= 0 ? 1 : qty;
	}
}
