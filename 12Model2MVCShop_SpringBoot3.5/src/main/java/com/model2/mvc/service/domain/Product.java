package com.model2.mvc.service.domain;

import java.io.Serializable;
import java.sql.Date;

import org.springframework.format.annotation.DateTimeFormat;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@ToString
public class Product implements Serializable {

	private static final long serialVersionUID = 1L;

	private int prodNo;
	private String prodName;
	private String prodDetail;
	@DateTimeFormat(pattern = "yyyyMMdd")
	private String manuDate;
	private int price;
	private String fileName;
	private Date regDate;
	private int viewCount;
	private String buyerId;
	private String buyDate;
	private String tranStatusCode;
	private int stockQty;
	private Integer availableQty;
	private Integer cancelReqCnt;

	public void setPrice(String price) {
		if (price != null && !price.trim().isEmpty()) {
			try {
				this.price = Integer.parseInt(price.replaceAll(",", ""));
			} catch (NumberFormatException e) {
				this.price = 0;
			}
		} else {
			this.price = 0;
		}
	}

	public String getFormattedManuDate() {
		if (this.manuDate != null && this.manuDate.length() == 8) {
			return this.manuDate.substring(0, 4) + "-" + this.manuDate.substring(4, 6) + "-"
					+ this.manuDate.substring(6, 8);
		}
		return this.manuDate;
	}

	public boolean isSoldOut() {
		Integer avail = (availableQty != null ? availableQty : stockQty);
		return avail <= 0;
	}
}
