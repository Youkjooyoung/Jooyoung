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
public class ProductImage {

	private int imgId;
	private int prodNo;
	private String fileName;
	private Date regDate;
}
