package com.model2.mvc.service.domain;

import java.io.Serializable;
import java.sql.Date;

public class Product implements Serializable {

	private static final long serialVersionUID = 1L;

	private int prodNo;
	private String prodName;
	private String prodDetail;
	private String manuDate; // MANUFACTURE_DAY
	private int price;
	private String fileName; // IMAGE_FILE
	private Date regDate;
	private int viewCount; // 조회수 추가

	private String buyerId;
	private String buyDate;

	public int getProdNo() {
		return prodNo;
	}

	public void setProdNo(int prodNo) {
		this.prodNo = prodNo;
	}

	public String getProdName() {
		return prodName;
	}

	public void setProdName(String prodName) {
		this.prodName = prodName;
	}

	public String getProdDetail() {
		return prodDetail;
	}

	public void setProdDetail(String prodDetail) {
		this.prodDetail = prodDetail;
	}

	public String getManuDate() {
		return manuDate;
	}

	public void setManuDate(String manuDate) {
		this.manuDate = manuDate;
	}

	public int getPrice() {
		return price;
	}

	public void setPrice(String price) {
		if (price != null && !price.trim().isEmpty()) {
			try {
				// "123,123" → "123123"
				this.price = Integer.parseInt(price.replaceAll(",", ""));
			} catch (NumberFormatException e) {
				this.price = 0; // 예외 발생 시 기본값
			}
		} else {
			this.price = 0;
		}
	}

	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

	public Date getRegDate() {
		return regDate;
	}

	public void setRegDate(Date regDate) {
		this.regDate = regDate;
	}

	public String getFormattedManuDate() {
		if (this.manuDate != null && this.manuDate.length() == 8) {
			return this.manuDate.substring(0, 4) + "-" + this.manuDate.substring(4, 6) + "-"
					+ this.manuDate.substring(6, 8);
		}
		return this.manuDate;
	}

	public int getViewCount() {
		return viewCount;
	}

	public void setViewCount(int viewCount) {
		this.viewCount = viewCount;
	}

	public String getBuyerId() {
		return buyerId;
	}

	public void setBuyerId(String buyerId) {
		this.buyerId = buyerId;
	}

	public String getBuyDate() {
		return buyDate;
	}

	public void setBuyDate(String buyDate) {
		this.buyDate = buyDate;
	}

	@Override
	public String toString() {
		return "Product [prodNo=" + prodNo + ", prodName=" + prodName + ", price=" + price + ", viewCount=" + viewCount
				+ "]";
	}
}
