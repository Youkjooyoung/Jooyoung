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
public class Cart {

	private int cartId;
	private String userId;
	private int prodNo;
	private int qty;
	private Date regDate;
	private Product product;
}
