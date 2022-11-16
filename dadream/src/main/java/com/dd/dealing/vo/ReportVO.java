package com.dd.dealing.vo;

import java.sql.Date;
import java.util.List;

import org.springframework.stereotype.Component;

@Component("reportVO")
public class ReportVO {
	private int dl_ReportNum;
	private String rp_Title;
	private String rp_Content;
	private Date rp_Date;
	private String user_Id;
	private int dl_Num;
	private String rp_State;
	private List<DealingVO> dealing;

	public ReportVO() {
	}

	public ReportVO(int dl_ReportNum, String rp_Title, String rp_Content, Date rp_Date, String user_Id, int dl_Num,
			String rp_State) {
		super();
		this.dl_ReportNum = dl_ReportNum;
		this.rp_Title = rp_Title;
		this.rp_Content = rp_Content;
		this.rp_Date = rp_Date;
		this.user_Id = user_Id;
		this.dl_Num = dl_Num;
		this.rp_State = rp_State;
	}

	public int getDl_ReportNum() {
		return dl_ReportNum;
	}

	public void setDl_ReportNum(int dl_ReportNum) {
		this.dl_ReportNum = dl_ReportNum;
	}

	public String getRp_Title() {
		return rp_Title;
	}

	public void setRp_Title(String rp_Title) {
		this.rp_Title = rp_Title;
	}

	public String getRp_Content() {
		return rp_Content;
	}

	public void setRp_Content(String rp_Content) {
		this.rp_Content = rp_Content;
	}

	public Date getRp_Date() {
		return rp_Date;
	}

	public void setRp_Date(Date rp_Date) {
		this.rp_Date = rp_Date;
	}

	public String getUser_Id() {
		return user_Id;
	}

	public void setUser_Id(String user_Id) {
		this.user_Id = user_Id;
	}

	public int getDl_Num() {
		return dl_Num;
	}

	public void setDl_Num(int dl_Num) {
		this.dl_Num = dl_Num;
	}

	public String getRp_State() {
		return rp_State;
	}

	public void setRp_State(String rp_State) {
		this.rp_State = rp_State;
	}

	public List<DealingVO> getDealing() {
		return dealing;
	}

	public void setDealing(List<DealingVO> dealing) {
		this.dealing = dealing;
	}

}