package com.dd.dealing.vo;

import java.sql.Date;

import org.springframework.stereotype.Component;

@Component("memberVO")
public class MemberVO {
	private String user_Id;
	private String user_Pwd;
	private String user_Name;
	private String user_Phone;
	private String user_Email;
	private int user_Level;
	private Date user_Sign;
	private String user_Address1;
	private String user_Address2;
	private String user_Address3;
	private String user_Business;
	private String pending;

	public MemberVO() {

	}

	public MemberVO(String user_Id, String user_Pwd, String user_Name, String user_Phone, String user_Email,
			int user_Level, Date user_Sign, String user_Address1, String user_Address2, String user_Address3,
			String user_Business, String pending) {

		this.user_Id = user_Id;
		this.user_Pwd = user_Pwd;
		this.user_Name = user_Name;
		this.user_Phone = user_Phone;
		this.user_Email = user_Email;
		this.user_Level = user_Level;
		this.user_Sign = user_Sign;
		this.user_Address1 = user_Address1;
		this.user_Address2 = user_Address2;
		this.user_Address3 = user_Address3;
		this.user_Business = user_Business;
		this.pending = pending;
	}

	public String getUser_Id() {
		return user_Id;
	}

	public void setUser_Id(String user_Id) {
		this.user_Id = user_Id;
	}

	public String getUser_Pwd() {
		return user_Pwd;
	}

	public void setUser_Pwd(String user_Pwd) {
		this.user_Pwd = user_Pwd;
	}

	public String getUser_Name() {
		return user_Name;
	}

	public void setUser_Name(String user_Name) {
		this.user_Name = user_Name;
	}

	public String getUser_Phone() {
		return user_Phone;
	}

	public void setUser_Phone(String user_Phone) {
		this.user_Phone = user_Phone;
	}

	public String getUser_Email() {
		return user_Email;
	}

	public void setUser_Email(String user_Email) {
		this.user_Email = user_Email;
	}

	public int getUser_Level() {
		return user_Level;
	}

	public void setUser_Level(int user_Level) {
		this.user_Level = user_Level;
	}

	public Date getUser_Sign() {
		return user_Sign;
	}

	public void setUser_Sign(Date user_Sign) {
		this.user_Sign = user_Sign;
	}

	public String getUser_Address1() {
		return user_Address1;
	}

	public void setUser_Address1(String user_Address1) {
		this.user_Address1 = user_Address1;
	}

	public String getUser_Address2() {
		return user_Address2;
	}

	public void setUser_Address2(String user_Address2) {
		this.user_Address2 = user_Address2;
	}

	public String getUser_Address3() {
		return user_Address3;
	}

	public void setUser_Address3(String user_Address3) {
		this.user_Address3 = user_Address3;
	}

	public String getUser_Business() {
		return user_Business;
	}

	public void setUser_Business(String user_Business) {
		this.user_Business = user_Business;
	}

	public String getPending() {
		return pending;
	}

	public void setPending(String pending) {
		this.pending = pending;
	}

}
