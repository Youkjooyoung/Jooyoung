package com.dd.dealing.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.expression.ParseException;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.dd.dealing.vo.BoardVO;
import com.dd.dealing.vo.DealingVO;
import com.dd.dealing.vo.MemberVO;
import com.dd.dealing.vo.NoticeVO;
import com.dd.dealing.vo.ReplyVO;

public interface DealingController {

	public String MAIN(HttpServletRequest request, HttpServletResponse response) throws Exception;

	public String userjoin(HttpServletRequest request, HttpServletResponse response) throws Exception;

	public ModelAndView userform(@RequestParam("memberjoin") String memberjoin, HttpServletRequest request,
			HttpServletResponse response) throws Exception;

	public Map<String, Object> idcheck(@RequestBody Map<String, Object> body) throws Exception;

	public ModelAndView addMember(MemberVO member, HttpServletRequest request, HttpServletResponse response)
			throws Exception;

	public String uformcheck(HttpServletRequest request, HttpServletResponse response) throws Exception;

	public Map<String, Object> phoneCheck(HttpServletRequest req, @RequestParam("phone") String phone) throws Exception;

	public ModelAndView removeMem(HttpServletRequest request, HttpServletResponse response) throws Exception;

	public Map<String, Object> infoCheck(@RequestBody MemberVO member, HttpServletRequest request) throws Exception;

	public Map<String, Object> memberMod(@RequestBody MemberVO member, HttpServletRequest request) throws Exception;

	public Map<String, Object> pwdCheck(HttpServletRequest request, HttpServletResponse response) throws Exception;

	public String login(HttpServletRequest request, HttpServletResponse response) throws Exception;

	public String kakaologin( RedirectAttributes rAttr, Model model,
			HttpServletRequest request) throws IOException, ParseException, Exception;

	public ModelAndView logincheck(@ModelAttribute("member") MemberVO member, RedirectAttributes rAttr,
			HttpServletRequest request, HttpServletResponse response) throws Exception;

	public ModelAndView logout(HttpServletRequest request, HttpServletResponse response) throws Exception;

	public ModelAndView mypage(HttpServletRequest request, HttpServletResponse response) throws Exception;

	public String dealingmain(HttpServletRequest request, HttpServletResponse response) throws Exception;

	public String gongsilCenter(HttpServletRequest request, HttpServletResponse response) throws Exception;

	public List<DealingVO> gongsilSearch(@RequestParam(required = false) List<String> dl_Form,
			@RequestParam(required = false, defaultValue = "") String dl_Address, HttpServletRequest request,
			HttpServletResponse response) throws Exception;

	public ModelAndView modDealing(@RequestParam("modDl_Num") int dl_Num, @RequestParam("modDlUser_Id") String user_Id,
			HttpServletRequest request, HttpServletResponse response) throws Exception;

	public ResponseEntity modDealing2(MultipartHttpServletRequest multipartRequest, HttpServletResponse response)
			throws Exception;

	public ResponseEntity deleteDealing(@RequestParam("delDl_Num") int dl_Num,
			@RequestParam("delDlUser_Id") String user_Id, @RequestParam("delDl_Image") String dl_Image,
			HttpServletRequest request, HttpServletResponse response) throws Exception;

	public String dealingform(HttpServletRequest request, HttpServletResponse response) throws Exception;

	public int jjimCheck(HttpServletRequest request, HttpServletResponse response) throws Exception;

	public String jjim(HttpServletRequest request, HttpServletResponse response) throws Exception;

	public String jjimRemove(HttpServletRequest request, HttpServletResponse response) throws Exception;

	public ResponseEntity dealingpost(MultipartHttpServletRequest multipartRequest, HttpServletResponse response)
			throws Exception;

	public String call(Model model);

	public String dealingmod(HttpServletRequest request, HttpServletResponse response) throws Exception;

	public String modanddel(Model model);

	public ModelAndView map(HttpServletRequest request, HttpServletResponse response) throws Exception;

	public ResponseEntity showMap(HttpServletRequest request, HttpServletResponse response) throws Exception;

	public ModelAndView read(HttpServletRequest request, HttpServletResponse response) throws Exception;

	public ResponseEntity showMap2(HttpServletRequest request, HttpServletResponse response) throws Exception;

	public ResponseEntity hereMe(HttpServletRequest request, HttpServletResponse response) throws Exception;

	public String addboard(BoardVO board, HttpServletRequest request, HttpServletResponse response) throws Exception;

	public ResponseEntity boardpost(MultipartHttpServletRequest multipartRequest, HttpServletResponse response)
			throws Exception;

	public ModelAndView inteboardlist(HttpServletRequest request, HttpServletResponse response) throws Exception;

	public String read(BoardVO boardVO, @RequestParam("inte_Num") int inte_Num, Model model, HttpServletRequest req,
			HttpServletResponse res) throws Exception;

	public String update(@ModelAttribute("boardVO") BoardVO boardVO, @RequestParam("inte_Num") int inte_Num,
			Model model) throws Exception;

	public ResponseEntity modArticle(MultipartHttpServletRequest multipartRequest, HttpServletResponse response)
			throws Exception;

	public ResponseEntity removeArticle(@RequestParam("inte_Num") int inte_Num, HttpServletRequest request,
			HttpServletResponse response) throws Exception;

	public ModelAndView noticelist(HttpServletRequest request, HttpServletResponse response) throws Exception;

	public String addnotice(NoticeVO notice, HttpServletRequest request, HttpServletResponse response) throws Exception;

	public ResponseEntity noticepost(MultipartHttpServletRequest multipartRequest, HttpServletResponse response)
			throws Exception;

	public String noticeread(NoticeVO noticeVO, @RequestParam("notice_Num") int notice_Num, Model model,
			HttpServletRequest req) throws Exception;

	public String noticeupdate(@ModelAttribute("noticeVO") NoticeVO noticeVO,
			@RequestParam("notice_Num") int notice_Num, Model model) throws Exception;

	public String notice_update_action(@ModelAttribute("noticeVO") NoticeVO noticeVO, HttpServletRequest request,
			RedirectAttributes redirect, Model model);

	public ResponseEntity modNoticle(MultipartHttpServletRequest multipartRequest, HttpServletResponse response)
			throws Exception;

	public ResponseEntity removeNoticle(@RequestParam("notice_Num") int notice_Num, HttpServletRequest request,
			HttpServletResponse response) throws Exception;

	public ResponseEntity<String> replywrite(@RequestBody ReplyVO reply, HttpServletRequest req) throws Exception;

	public ResponseEntity<ArrayList<ReplyVO>> getlist(@PathVariable int inte_Num) throws Exception;

	public ResponseEntity<String> replymodify(@RequestBody ReplyVO reply, HttpServletRequest req, Model model)
			throws Exception;

	public ResponseEntity<String> replyremove(@PathVariable("reply_Num") int reply_Num, HttpServletRequest req,
			ReplyVO reply) throws Exception;

	public Map<String, Object> report(@RequestBody Map<String, Object> report, HttpServletRequest request,
			HttpServletResponse response) throws Exception;

	public String reportPop(HttpServletRequest request, Model model);

	public String up(MultipartHttpServletRequest multipartRequest) throws Exception;

	public String up1(MultipartHttpServletRequest multipartRequest) throws Exception;

}
