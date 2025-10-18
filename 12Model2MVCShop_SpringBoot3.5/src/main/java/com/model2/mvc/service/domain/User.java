package com.model2.mvc.service.domain;

import java.sql.Date;

//==>회원정보를 모델링(추상화/캡슐화)한 Bean
public class User {

	/// Field
	private String userId;
	private String userName;
	private String password;
	private String role;
	private String ssn;
	private String phone;
	private String addr;
	private String email;
	private Date regDate;
	/////////////// EL 적용 위해 추가된 Field ///////////
	private String phone1;
	private String phone2;
	private String phone3;
	//////////////////////////////////////////////////////////////////////////////////////////////
	// JSON ==> Domain Object Binding을 위해 추가된 부분
	private String regDateString;

	private String kakaoId;
	private String profileImg;
	private String zipcode; // 우편번호
	private String addrDetail; // 상세주소

	private String googleId; // 구글 소셜 로그인용 ID

	/// Constructor
	public User() {
	}

	/// Method
	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}

	public String getSsn() {
		return ssn;
	}

	public void setSsn(String ssn) {
		this.ssn = ssn;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
		if (phone != null && phone.contains("-")) {
			String[] parts = phone.split("-");
			if (parts.length > 0)
				phone1 = parts[0];
			if (parts.length > 1)
				phone2 = parts[1];
			if (parts.length > 2)
				phone3 = parts[2];
		} else {
			// 하이픈이 없는 경우 자동 포맷팅
			if (phone.length() == 11) {
				phone1 = phone.substring(0, 3);
				phone2 = phone.substring(3, 7);
				phone3 = phone.substring(7);
			} else {
				phone1 = phone;
			}
		}
	}

	public String getAddr() {
		return addr;
	}

	public void setAddr(String addr) {
		this.addr = addr;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public Date getRegDate() {
		return regDate;
	}

	//////////////////////////////////////////////////////////////////////////////////////////////
	// JSON ==> Domain Object Binding을 위해 추가된 부분
	public void setRegDate(Date regDate) {
		this.regDate = regDate;

		if (regDate != null) {
			// JSON ==> Domain Object Binding을 위해 추가된 부분
			this.setRegDateString(regDate.toString().split("-")[0] + "-" + regDate.toString().split("-")[1] + "-"
					+ regDate.toString().split("-")[2]);
		}

	}

	/////////////// EL 적용 위해 추가된 getter Method ///////////
	public String getPhone1() {
		return phone1;
	}

	public String getPhone2() {
		return phone2;
	}

	public String getPhone3() {
		return phone3;
	}

	@Override
	public String toString() {
		return "UserVO : [userId] " + userId + " [userName] " + userName + " [password] " + password + " [role] " + role
				+ " [ssn] " + ssn + " [phone] " + phone + " [email] " + email + " [regDate] " + regDate;
	}

	////////////////////////////////////////////////////////////////////////////////////////
	// JSON ==> Domain Object Binding을 위해 추가된 부분
	// POJO 의 중요성
	public void setPhone1(String phone1) {
		this.phone1 = phone1;
	}

	public void setPhone2(String phone2) {
		this.phone2 = phone2;
	}

	public void setPhone3(String phone3) {
		this.phone3 = phone3;
	}
	/////////////////////////////////////////////////////////////////////////////////////////

	public String getRegDateString() {
		return regDateString;
	}

	public void setRegDateString(String regDateString) {
		this.regDateString = regDateString;
	}

	public String getKakaoId() {
		return kakaoId;
	}

	public void setKakaoId(String kakaoId) {
		this.kakaoId = kakaoId;
	}

	public String getProfileImg() {
		return profileImg;
	}

	public void setProfileImg(String profileImg) {
		this.profileImg = profileImg;
	}

	public String getZipcode() {
		return zipcode;
	}

	public void setZipcode(String zipcode) {
		this.zipcode = zipcode;
	}

	public String getAddrDetail() {
		return addrDetail;
	}

	public void setAddrDetail(String addrDetail) {
		this.addrDetail = addrDetail;
	}

	public String getGoogleId() {
		return googleId;
	}

	public void setGoogleId(String googleId) {
		this.googleId = googleId;
	}
}