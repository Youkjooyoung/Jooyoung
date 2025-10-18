package com.dd.product.vo;

import java.sql.Date;

import org.springframework.stereotype.Component;

@Component("reviewReplyVO")
public class ReviewReplyVO {
	private int reply_Count;
	private int review_Num;
	private String reply_Text;
	private int parent_No;
	private String user_Id;
	private Date reply_Date;

	public ReviewReplyVO() {

	}

	public ReviewReplyVO(int reply_Count, int review_Num, String reply_Text, int parent_No, String user_Id,
			Date reply_Date) {
		super();
		this.reply_Count = reply_Count;
		this.review_Num = review_Num;
		this.reply_Text = reply_Text;
		this.parent_No = parent_No;
		this.user_Id = user_Id;
		this.reply_Date = reply_Date;
	}

	public int getReply_Count() {
		return reply_Count;
	}

	public void setReply_Count(int reply_Count) {
		this.reply_Count = reply_Count;
	}

	public int getReview_Num() {
		return review_Num;
	}

	public void setReview_Num(int review_Num) {
		this.review_Num = review_Num;
	}

	public String getReply_Text() {
		return reply_Text;
	}

	public void setReply_Text(String reply_Text) {
		this.reply_Text = reply_Text;
	}

	public int getParent_No() {
		return parent_No;
	}

	public void setParent_No(int parent_No) {
		this.parent_No = parent_No;
	}

	public String getUser_Id() {
		return user_Id;
	}

	public void setUser_Id(String user_Id) {
		this.user_Id = user_Id;
	}

	public Date getReply_Date() {
		return reply_Date;
	}

	public void setReply_Date(Date reply_Date) {
		this.reply_Date = reply_Date;
	}

}
