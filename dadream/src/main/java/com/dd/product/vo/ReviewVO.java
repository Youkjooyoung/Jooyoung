package com.dd.product.vo;

import java.sql.Date;
import java.util.List;

import org.springframework.stereotype.Component;

@Component("reviewVO")
public class ReviewVO {
	private int review_Num;
	private String review_Text;
	private String review_Title;
	private Date review_Date;
	private String review_Image;
	private int product_Num;
	private String user_Id;
	private List<ReviewReplyVO> reviewReply;

	public ReviewVO() {

	}

	public ReviewVO(int review_Num, String review_Text, String review_Title, Date review_Date, String review_Image,
			int product_Num, String user_Id) {
		super();
		this.review_Num = review_Num;
		this.review_Text = review_Text;
		this.review_Title = review_Title;
		this.review_Date = review_Date;
		this.review_Image = review_Image;
		this.product_Num = product_Num;
		this.user_Id = user_Id;
	}

	public int getReview_Num() {
		return review_Num;
	}

	public void setReview_Num(int review_Num) {
		this.review_Num = review_Num;
	}

	public String getReview_Text() {
		return review_Text;
	}

	public void setReview_Text(String review_Text) {
		this.review_Text = review_Text;
	}

	public String getReview_Title() {
		return review_Title;
	}

	public void setReview_Title(String review_Title) {
		this.review_Title = review_Title;
	}

	public Date getReview_Date() {
		return review_Date;
	}

	public void setReview_Date(Date review_Date) {
		this.review_Date = review_Date;
	}

	public String getReview_Image() {
		return review_Image;
	}

	public void setReview_Image(String review_Image) {
		this.review_Image = review_Image;
	}

	public int getProduct_Num() {
		return product_Num;
	}

	public void setProduct_Num(int product_Num) {
		this.product_Num = product_Num;
	}

	public String getUser_Id() {
		return user_Id;
	}

	public void setUser_Id(String user_Id) {
		this.user_Id = user_Id;
	}

	public List<ReviewReplyVO> getReviewReply() {
		return reviewReply;
	}

	public void setReviewReply(List<ReviewReplyVO> reviewReply) {
		this.reviewReply = reviewReply;
	}

}
