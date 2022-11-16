package com.dd.dealing.vo;

import java.sql.Date;

import org.springframework.stereotype.Component;

/**
 * @author Administrator
 *
 */
@Component("dealingVO")
public class DealingVO {
	private int dl_Num;
	private String dl_Title;
	private String dl_Image;
	private int dl_Price;
	private String dl_Address;
	private String dl_Content;
	private int dl_Views;
	private Date dl_Date;
	private String user_Id;
	private String dl_City;
	private String dl_Form;
	private String dl_Form2;
	private int dl_Room;
	private int dl_Size;
	private String dl_Option;
	private String dl_Lat;
	private String dl_Lng;
	private String dl_Sold;

	public DealingVO() {

	}

	public DealingVO(int dl_Num, String dl_Title, String dl_Image, int dl_Price, String dl_Address, String dl_Content,
			int dl_Views, Date dl_Date, String user_Id, String dl_City, String dl_Form, String dl_Form2, int dl_Room,
			int dl_Size, String dl_Option, String dl_Lat, String dl_Lng, String dl_Sold) {

		this.dl_Num = dl_Num;
		this.dl_Title = dl_Title;
		this.dl_Image = dl_Image;
		this.dl_Price = dl_Price;
		this.dl_Address = dl_Address;
		this.dl_Content = dl_Content;
		this.dl_Views = dl_Views;
		this.dl_Date = dl_Date;
		this.user_Id = user_Id;
		this.dl_City = dl_City;
		this.dl_Form = dl_Form;
		this.dl_Form2 = dl_Form2;
		this.dl_Room = dl_Room;
		this.dl_Size = dl_Size;
		this.dl_Option = dl_Option;
		this.dl_Lat = dl_Lat;
		this.dl_Lng = dl_Lng;
		this.dl_Sold = dl_Sold;
	}

	public int getDl_Num() {
		return dl_Num;
	}

	public void setDl_Num(int dl_Num) {
		this.dl_Num = dl_Num;
	}

	public String getDl_Title() {
		return dl_Title;
	}

	public void setDl_Title(String dl_Title) {
		this.dl_Title = dl_Title;
	}

	public String getDl_Image() {
		return dl_Image;
	}

	public void setDl_Image(String dl_Image) {
		this.dl_Image = dl_Image;
	}

	public int getDl_Price() {
		return dl_Price;
	}

	public void setDl_Price(int dl_Price) {
		this.dl_Price = dl_Price;
	}

	public String getDl_Address() {
		return dl_Address;
	}

	public void setDl_Address(String dl_Address) {
		this.dl_Address = dl_Address;
	}

	public String getDl_Content() {
		return dl_Content;
	}

	public void setDl_Content(String dl_Content) {
		this.dl_Content = dl_Content;
	}

	public int getDl_Views() {
		return dl_Views;
	}

	public void setDl_Views(int dl_Views) {
		this.dl_Views = dl_Views;
	}

	public Date getDl_Date() {
		return dl_Date;
	}

	public void setDl_Date(Date dl_Date) {
		this.dl_Date = dl_Date;
	}

	public String getUser_Id() {
		return user_Id;
	}

	public void setUser_Id(String user_Id) {
		this.user_Id = user_Id;
	}

	public String getDl_City() {
		return dl_City;
	}

	public void setDl_City(String dl_City) {
		this.dl_City = dl_City;
	}

	public String getDl_Form() {
		return dl_Form;
	}

	public void setDl_Form(String dl_Form) {
		this.dl_Form = dl_Form;
	}

	public String getDl_Form2() {
		return dl_Form2;
	}

	public void setDl_Form2(String dl_Form2) {
		this.dl_Form2 = dl_Form2;
	}

	public int getDl_Room() {
		return dl_Room;
	}

	public void setDl_Room(int dl_Room) {
		this.dl_Room = dl_Room;
	}

	public int getDl_Size() {
		return dl_Size;
	}

	public void setDl_Size(int dl_Size) {
		this.dl_Size = dl_Size;
	}

	public String getDl_Option() {
		return dl_Option;
	}

	public void setDl_Option(String dl_Option) {
		this.dl_Option = dl_Option;
	}

	public String getDl_Lat() {
		return dl_Lat;
	}

	public void setDl_Lat(String dl_Lat) {
		this.dl_Lat = dl_Lat;
	}

	public String getDl_Lng() {
		return dl_Lng;
	}

	public void setDl_Lng(String dl_Lng) {
		this.dl_Lng = dl_Lng;
	}

	public String getDl_Sold() {
		return dl_Sold;
	}

	public void setDl_Sold(String dl_Sold) {
		this.dl_Sold = dl_Sold;
	}

}
