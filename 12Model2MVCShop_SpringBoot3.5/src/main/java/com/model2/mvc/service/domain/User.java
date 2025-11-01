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
public class User {

	private String userId;
	private String userName;
	private String password;
	private String role;
	private String ssn;
	private String phone;
	private String addr;
	private String email;
	private Date regDate;

	private String phone1;
	private String phone2;
	private String phone3;

	private String regDateString;
	private String kakaoId;
	private String profileImg;
	private String zipcode;
	private String addrDetail;
	private String googleId;

	public void setPhone(String phone) {
		this.phone = phone;
		if (phone != null) {
			if (phone.contains("-")) {
				String[] parts = phone.split("-");
				phone1 = parts.length > 0 ? parts[0] : "";
				phone2 = parts.length > 1 ? parts[1] : "";
				phone3 = parts.length > 2 ? parts[2] : "";
			} else if (phone.length() == 11) {
				phone1 = phone.substring(0, 3);
				phone2 = phone.substring(3, 7);
				phone3 = phone.substring(7);
			} else {
				phone1 = phone;
			}
		}
	}

	public void setRegDate(Date regDate) {
		this.regDate = regDate;
		if (regDate != null) {
			this.regDateString = regDate.toString();
		}
	}
}
