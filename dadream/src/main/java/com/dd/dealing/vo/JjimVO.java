package com.dd.dealing.vo;

import java.util.List;

import org.springframework.stereotype.Component;

@Component("jjimVO")
public class JjimVO {
	private int dl_Num;
	private String user_Id;

	// 조인을 위해 선언
	private List<DealingVO> dealing;

	public JjimVO() {

	}

	public JjimVO(int dl_Num, String user_Id) {
		this.dl_Num = dl_Num;
		this.user_Id = user_Id;
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

	// 조인문
	public List<DealingVO> getDealing() {
		return dealing;
	}

	public void setDealing(List<DealingVO> dealingVO) {
		this.dealing = dealingVO;
	}

}
