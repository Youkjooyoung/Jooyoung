package com.dd.dealing.vo;

import java.sql.Date;

import org.springframework.stereotype.Component;

@Component("noticeVO")
public class NoticeVO {
	private int notice_Num;
	private String notice_Title;
	private String notice_Text;
	private Date notice_Date;
	private String user_Id;
	private int viewCnt;
	private String notice_Category;

	public NoticeVO() {

	}

	public NoticeVO(int notice_Num, String notice_Title, String notice_Text, Date notice_Date, String user_Id,
			int viewCnt, String notice_Category) {
		super();
		this.notice_Num = notice_Num;
		this.notice_Title = notice_Title;
		this.notice_Text = notice_Text;
		this.notice_Date = notice_Date;
		this.user_Id = user_Id;
		this.viewCnt = viewCnt;
		this.notice_Category = notice_Category;
	}

	public int getNotice_Num() {
		return notice_Num;
	}

	public void setNotice_Num(int notice_Num) {
		this.notice_Num = notice_Num;
	}

	public String getNotice_Title() {
		return notice_Title;
	}

	public void setNotice_Title(String notice_Title) {
		this.notice_Title = notice_Title;
	}

	public String getNotice_Text() {
		return notice_Text;
	}

	public void setNotice_Text(String notice_Text) {
		this.notice_Text = notice_Text;
	}

	public Date getNotice_Date() {
		return notice_Date;
	}

	public void setNotice_Date(Date notice_Date) {
		this.notice_Date = notice_Date;
	}

	public String getUser_Id() {
		return user_Id;
	}

	public void setUser_Id(String user_Id) {
		this.user_Id = user_Id;
	}

	public int getViewCnt() {
		return viewCnt;
	}

	public void setViewCnt(int viewCnt) {
		this.viewCnt = viewCnt;
	}

	public String getNotice_Category() {
		return notice_Category;
	}

	public void setNotice_Category(String notice_Category) {
		this.notice_Category = notice_Category;
	}

}