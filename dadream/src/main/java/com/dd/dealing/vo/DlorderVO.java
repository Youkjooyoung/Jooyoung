package com.dd.dealing.vo;

import java.util.Date;

public class DlorderVO {
	private int dl_Num;
	private String user_Id;
	private int order_Num;
	private Date do_Date;

	public DlorderVO() {
	}

	public DlorderVO(int dl_Num, String user_Id, int order_Num, Date do_Date) {
		this.dl_Num = dl_Num;
		this.user_Id = user_Id;
		this.order_Num = order_Num;
		this.do_Date = do_Date;
	}

	public int getDl_Num() {
		return dl_Num;
	}

	public void setDl_Num(int dl_Num) {
		this.dl_Num = dl_Num;
	}

	public String getUser_Id() {
		return user_Id;
	}

	public void setUser_Id(String user_Id) {
		this.user_Id = user_Id;
	}

	public int getOrder_Num() {
		return order_Num;
	}

	public void setOrder_Num(int order_Num) {
		this.order_Num = order_Num;
	}

	public Date getDo_Date() {
		return do_Date;
	}

	public void setDo_Date(Date do_Date) {
		this.do_Date = do_Date;
	}
}
