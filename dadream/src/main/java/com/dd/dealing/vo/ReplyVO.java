package com.dd.dealing.vo;


import java.util.Date;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.annotation.JsonFormat;
@Component
public class ReplyVO {

	private String reply_content;		//댓글 내용
	private int reply_Num;		//댓글 번호
	@JsonFormat(pattern = "yyyy-MM-dd HH:mm", timezone = "Asia/Seoul")
	private Date reply_regDate;	//댓글 등록 날짜
	private int inte_Num;		//게시글 번호
	private String user_Id;

	
	public ReplyVO() {
		
	}
	public ReplyVO(String reply_content, int reply_Num, Date reply_regDate,String user_Id,int inte_Num) {
		super();
		this.reply_content = reply_content;
		this.reply_Num = reply_Num;
		this.reply_regDate = reply_regDate;
		this.inte_Num = inte_Num;
		this.user_Id = user_Id;
	}
	
	public String getReply_content() {
		return reply_content;
	}
	public void setReply_content(String reply_content) {
		this.reply_content = reply_content;
	}
	public int getReply_Num() {
		return reply_Num;
	}
	public void setReply_Num(int reply_Num) {
		this.reply_Num = reply_Num;
	}
	public Date getReply_regDate() {
		return reply_regDate;
	}
	public void setReply_regDate(Date reply_regDate) {
		this.reply_regDate = reply_regDate;
	}
	public int getInte_Num() {
		return inte_Num;
	}
	public void setInte_Num(int inte_Num) {
		this.inte_Num = inte_Num;
	}
	public String getUser_Id() {
		return user_Id;
	}
	public void setUser_Id(String user_Id) {
		this.user_Id = user_Id;
	}
	@Override
	public String toString() {
		return "ReplyVO [reply_Num="+ reply_Num + ", reply_content=" + reply_content + ", user_Id=" + user_Id + ", reply_regDate=" + reply_regDate + ","
				+ "inte_Num= " + inte_Num + "]";
	}
	
}
