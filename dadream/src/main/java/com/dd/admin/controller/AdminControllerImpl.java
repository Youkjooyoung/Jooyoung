package com.dd.admin.controller;

import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.dd.admin.service.AdminService;
import com.dd.dealing.vo.DealingVO;
import com.dd.dealing.vo.DlorderVO;
import com.dd.dealing.vo.MemberVO;
import com.dd.dealing.vo.NoticeVO;
import com.dd.dealing.vo.ReportVO;
import com.dd.product.vo.OftVO;
import com.dd.product.vo.ProductVO;

@Controller("adminController")
public class AdminControllerImpl implements AdminController {

	@Autowired
	private AdminService adminService;

	/* 관리자페이지 */
	@Override
	@RequestMapping(value = "/admin/admin.do", method = { RequestMethod.GET, RequestMethod.POST })
	public ModelAndView adminMain(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String viewName = (String) request.getAttribute("viewName");
		ModelAndView mav = new ModelAndView();
		List<Integer> proChart = new ArrayList<Integer>();
		List<Integer> dlChart = new ArrayList<Integer>();
		List<OftVO> proList = new ArrayList<OftVO>();
		List<DlorderVO> dlList = new ArrayList<DlorderVO>();
		proChart = adminService.proSum();
		dlChart = adminService.dlSum();
		proList = adminService.proList();
		dlList = adminService.dlList();
		mav.addObject("proChart", proChart);
		mav.addObject("dlChart", dlChart);
		mav.addObject("proList", proList);
		mav.addObject("dlList", dlList);
		mav.setViewName(viewName);
		return mav;
	}

	/* 신고목록 */
	@Override
	@RequestMapping(value = "/admin/reportList.do", method = { RequestMethod.GET, RequestMethod.POST })
	public ModelAndView reportList(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String viewName = (String) request.getAttribute("viewName");
		ModelAndView mav = new ModelAndView();
		List<ReportVO> reportsList = new ArrayList();
		reportsList = adminService.reportsList();
		mav.setViewName(viewName);
		mav.addObject("reportsList", reportsList);
		return mav;
	}

	/* 신고상세 */
	@Override
	@RequestMapping(value = "/admin/reportView.do", method = { RequestMethod.GET, RequestMethod.POST })
	public ModelAndView reportView(@RequestParam("rp_Num") int rp_Num, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		System.out.println(rp_Num);
		String viewName = (String) request.getAttribute("viewName");
		ModelAndView mav = new ModelAndView();
		// List<ReportVO> rpContents = new ArrayList<ReportVO>();
		ReportVO rpContents = adminService.reportView(rp_Num);
		mav.addObject("rpContents", rpContents);
		mav.setViewName(viewName);
		System.out.println(rpContents);
		return mav;
	}

	/* 신고상태 변경 */
	@Override
	@RequestMapping(value = "/admin/reportState.do", method = RequestMethod.POST)
	public String reportState(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String rp_State = request.getParameter("rp_State");
		String dl_ReportNum = request.getParameter("dl_ReportNum");
		Map<String, Object> map = new HashMap<>();
		map.put("dl_ReportNum", dl_ReportNum);
		map.put("rp_State", rp_State);
		System.out.println(rp_State);
		adminService.reportState(map);
		return "redirect:/admin/reportList.do";
	}

	/* 신고삭제(상세페이지) */
	@Override
	@RequestMapping(value = "/admin/deleteReport.do", method = RequestMethod.POST)
	public String deleteReport(@RequestParam("dl_ReportNum") int dl_ReportNum, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		System.out.println("신고삭제");
		adminService.deleteReport(dl_ReportNum);
		return "redirect:/admin/reportList.do";
	}

	/* 신고삭제(여러개) */
	@Override
	@RequestMapping(value = "/admin/deleteReport2.do", method = RequestMethod.POST)
	public void deleteReport2(@RequestParam("checkAll") List<Integer> rpsList, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		System.out.println(rpsList);
		Map<String, Object> rpsMap = new HashMap<String, Object>();
		rpsMap.put("rpsList", rpsList);
		adminService.deleteReport2(rpsMap);
		ModelAndView mav = new ModelAndView();
		response.setContentType("text/html; charset=UTF-8");
		PrintWriter out = response.getWriter();
		out.println("<script>alert('삭제가 완료되었습니다.'); location.href='/admin/reportList.do'</script>");
		out.flush();
	}

	/* 매물목록 */
	@Override
	@RequestMapping(value = "/admin/dealingsList.do", method = { RequestMethod.GET, RequestMethod.POST })
	public ModelAndView dealingsList(HttpServletRequest request, HttpServletResponse response) throws Exception {
		System.out.println("매물목록 들어옴");
		String viewName = (String) request.getAttribute("viewName");
		ModelAndView mav = new ModelAndView();
		List<DealingVO> dealingsList = new ArrayList<DealingVO>();
		dealingsList = adminService.dealingsList();
		mav.setViewName(viewName);
		mav.addObject("dealingsList", dealingsList);
		System.out.println(dealingsList);
		return mav;
	}

	/* 매물상세보기(관리자) */
	@Override
	@RequestMapping(value = "/admin/adminDlView.do", method = { RequestMethod.GET, RequestMethod.POST })
	public ModelAndView adminDlView(@RequestParam("dl_Num") int dl_Num, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		System.out.println(dl_Num);
		String viewName = (String) request.getAttribute("viewName");
		ModelAndView mav = new ModelAndView();
		DealingVO dlContents = adminService.adminDlView(dl_Num);
		mav.addObject("dlContents", dlContents);
		mav.setViewName(viewName);
		System.out.println(dlContents);
		return mav;
	}

	/* 매물삭제(관리자) */
	@Override
	@RequestMapping(value = "/admin/deleteDealing.do", method = RequestMethod.POST)
	public void deleteDealing(@RequestParam("checkAll") List<Integer> dlsList, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		System.out.println(dlsList);
		Map<String, Object> dlsMap = new HashMap<String, Object>();
		dlsMap.put("dlsList", dlsList);
		adminService.deleteDealing(dlsMap);
		response.setContentType("text/html; charset=UTF-8");
		PrintWriter out = response.getWriter();
		out.println("<script>alert('삭제가 완료되었습니다.'); location.href='/admin/dealingsList.do'</script>");
		out.flush();
	}

//	유저정보
	@Override
	@RequestMapping(value = "/admin/member.do", method = RequestMethod.POST)
	public String adminmember(HttpServletRequest req, Model mo) throws Exception {
		List<MemberVO> adminMember = adminService.adminMember();
		mo.addAttribute("adminMember", adminMember);
		return "/admin/adminMember";
	}

//	상품조회
	@Override
	@RequestMapping(value = "/admin/pro.do", method = RequestMethod.POST)
	public String adminpro(HttpServletRequest req, Model mo) throws Exception {
		List<ProductVO> proselect = adminService.adminpro();
		mo.addAttribute("proselect", proselect);
		return "/admin/productList";
	}

	/* 공지사항 */
	@Override
	@RequestMapping(value = "/admin/noticeList.do", method = { RequestMethod.GET, RequestMethod.POST })
	public ModelAndView adminNoticeList(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String viewName = (String) request.getAttribute("viewName");
		ModelAndView mav = new ModelAndView();
		List<NoticeVO> noticList = adminService.adminNoticeList();
		mav.addObject("noticList", noticList);
		mav.setViewName(viewName);

		return mav;
	}

	/* 공지사항 상세보기 */
	@Override
	@RequestMapping(value = "/admin/noticeViewAdmin.do", method = RequestMethod.GET)
	public ModelAndView adminNoticeView(@RequestParam("Notice_Num") int Notice_Num, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		String viewName = (String) request.getAttribute("viewName");
		ModelAndView mav = new ModelAndView();
		NoticeVO noticeVO = adminService.adminNoticeView(Notice_Num);
		mav.addObject("noticeView", noticeVO);
		mav.setViewName(viewName);
		return mav;
	}

	/* 공지사항 수정창 */
	@Override
	@RequestMapping(value = "/admin/modNoticeView.do", method = RequestMethod.POST)
	public ModelAndView modNoticeView(@RequestParam("notice_Num") int Notice_Num, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		String viewName = (String) request.getAttribute("viewName");
		ModelAndView mav = new ModelAndView();
		NoticeVO noticeVO = adminService.adminNoticeView(Notice_Num);
		mav.addObject("noticeView", noticeVO);
		mav.setViewName(viewName);
		return mav;
	}

	/* 공지사항 수정 */
	@Override
	@RequestMapping(value = "/admin/modNotice.do", method = RequestMethod.POST)
	public void modNotice(NoticeVO noticeVO, HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		System.out.println(noticeVO);
		adminService.modNotice(noticeVO);
		response.setContentType("text/html; charset=UTF-8");
		PrintWriter out = response.getWriter();
		out.println("<script>alert('수정이 완료되었습니다.'); location.href='/admin/noticeList.do'</script>");
		out.flush();
	}

	/* 공지사항 삭제 */
	@Override
	@RequestMapping(value = "/admin/deleteNotice.do", method = RequestMethod.POST)
	public void deleteNotice(@RequestParam("checkAll") List<Integer> ntsList, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		System.out.println("체크된 공지번호 : " + ntsList);
		Map<String, Object> ntsMap = new HashMap<String, Object>();
		ntsMap.put("ntsList", ntsList);
		adminService.deleteNotice(ntsMap);
		response.setContentType("text/html; charset=UTF-8");
		PrintWriter out = response.getWriter();
		out.println("<script>alert('삭제가 완료되었습니다.'); location.href='/admin/noticeList.do'</script>");
		out.flush();
	}

	/* 공지사항 글쓰기 창 */
	@Override
	@RequestMapping(value = "/admin/noticeForm.do", method = RequestMethod.GET)
	public ModelAndView noticeForm(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String viewName = (String) request.getAttribute("viewName");
		ModelAndView mav = new ModelAndView();
		mav.setViewName(viewName);
		return mav;
	}

	/* 공지사항 글쓰기 */
	@Override
	@RequestMapping(value = "/admin/addNotice.do", method = RequestMethod.POST)
	public void addNotice(NoticeVO noticeVO, HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		System.out.println("공지글 쓰기 : " + noticeVO);
		adminService.addNotice(noticeVO);
		response.setContentType("text/html; charset=UTF-8");
		PrintWriter out = response.getWriter();
		out.println("<script>alert('글을 등록했습니다.'); location.href='/admin/noticeList.do'</script>");
		out.flush();
	}

//	허위매물 막기
	@Override
	@RequestMapping(value = "/admin/level.do", method = { RequestMethod.GET, RequestMethod.POST })
	public String adminlevel(HttpServletRequest req, Model mo) throws Exception {
		String user_Id = req.getParameter("user_Id");
		System.out.println("user_Id : " + user_Id);
		System.out.println("유저레벨 권한 들어옴");
		mo.addAttribute("user_Id", user_Id);
		return "/admin/level";
	}

//	허위매물 막기 post
	@Override
	@ResponseBody
	@RequestMapping(value = "/admin/levelPost.do", method = { RequestMethod.GET, RequestMethod.POST })
	public Map<String, Object> adminlevelpost(HttpServletRequest req, Model mo, @RequestBody Map<String, Object> mem)
			throws Exception {
		System.out.println("레벨 포스트 들어옴");

		int result = 0;
		result = adminService.levelPost(mem);
		Map<String, Object> map = new HashMap<>();
		map.put("res", result);
		return map;

	}

}
