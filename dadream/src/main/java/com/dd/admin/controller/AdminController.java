package com.dd.admin.controller;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import com.dd.dealing.vo.NoticeVO;

public interface AdminController {
	public ModelAndView adminMain(HttpServletRequest request, HttpServletResponse response) throws Exception;

	public ModelAndView reportList(HttpServletRequest request, HttpServletResponse response) throws Exception;

	public ModelAndView reportView(@RequestParam("rp_Num") int rp_Num, HttpServletRequest request,
			HttpServletResponse response) throws Exception;

	public String reportState(HttpServletRequest request, HttpServletResponse response) throws Exception;

	public String deleteReport(@RequestParam("dl_ReportNum") int dl_ReportNum, HttpServletRequest request,
			HttpServletResponse response) throws Exception;

	public void deleteReport2(@RequestParam("checkAll") List<Integer> rpsList, HttpServletRequest request,
			HttpServletResponse response) throws Exception;

	public ModelAndView dealingsList(HttpServletRequest request, HttpServletResponse response) throws Exception;

	public ModelAndView adminDlView(@RequestParam("dl_Num") int dl_Num, HttpServletRequest request,
			HttpServletResponse response) throws Exception;

	public void deleteDealing(@RequestParam("checkAll") List<Integer> dlsList, HttpServletRequest request,
			HttpServletResponse response) throws Exception;

	public String adminmember(HttpServletRequest req, Model mo) throws Exception;

	public String adminpro(HttpServletRequest req, Model mo) throws Exception;

	public ModelAndView adminNoticeList(HttpServletRequest request, HttpServletResponse response) throws Exception;

	public ModelAndView adminNoticeView(@RequestParam("Notice_Num") int Notice_Num, HttpServletRequest request,
			HttpServletResponse response) throws Exception;

	public ModelAndView modNoticeView(@RequestParam("notice_Num") int Notice_Num, HttpServletRequest request,
			HttpServletResponse response) throws Exception;

	public void modNotice(NoticeVO noticeVO, HttpServletRequest request, HttpServletResponse response) throws Exception;

	public void deleteNotice(@RequestParam("checkAll") List<Integer> ntsList, HttpServletRequest request,
			HttpServletResponse response) throws Exception;

	public ModelAndView noticeForm(HttpServletRequest request, HttpServletResponse response) throws Exception;

	public void addNotice(NoticeVO noticeVO, HttpServletRequest request, HttpServletResponse response) throws Exception;

	public String adminlevel(HttpServletRequest req, Model mo) throws Exception;

	public Map<String, Object> adminlevelpost(HttpServletRequest req, Model mo, @RequestBody Map<String, Object> mem)
			throws Exception;
}
