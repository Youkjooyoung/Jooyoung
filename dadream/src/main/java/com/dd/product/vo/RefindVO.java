package com.dd.product.vo;

import org.springframework.stereotype.Component;

@Component("refindVO")
public class RefindVO {
	private String order_Num;
	private String refind_Name;
	private String refind_Count;

	public RefindVO() {
	}

	public RefindVO(String order_Num, String refind_Name, String refind_Count) {
		this.order_Num = order_Num;
		this.refind_Name = refind_Name;
		this.refind_Count = refind_Count;
	}

	public String getOrder_Num() {
		return order_Num;
	}

	public void setOrder_Num(String order_Num) {
		this.order_Num = order_Num;
	}

	public String getRefind_Name() {
		return refind_Name;
	}

	public void setRefind_Name(String refind_Name) {
		this.refind_Name = refind_Name;
	}

	public String getRefind_Count() {
		return refind_Count;
	}

	public void setRefind_Count(String refind_Count) {
		this.refind_Count = refind_Count;
	}
}
