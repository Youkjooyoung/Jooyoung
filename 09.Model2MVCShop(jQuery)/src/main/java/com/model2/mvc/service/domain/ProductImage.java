package com.model2.mvc.service.domain;

import java.sql.Date;

public class ProductImage {

	private int imgId;
	private int prodNo;
	private String fileName;
	private Date regDate;

	public int getImgId() {
		return imgId;
	}

	public void setImgId(int imgId) {
		this.imgId = imgId;
	}

	public int getProdNo() {
		return prodNo;
	}

	public void setProdNo(int prodNo) {
		this.prodNo = prodNo;
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

	@Override
	public String toString() {
		return "ProductImage [imgId=" + imgId + ", prodNo=" + prodNo + ", fileName=" + fileName + ", regDate=" + regDate
				+ "]";
	}

}
