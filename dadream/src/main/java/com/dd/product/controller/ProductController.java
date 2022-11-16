package com.dd.product.controller;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.ModelAndView;

import com.dd.dealing.vo.JjimVO;
import com.dd.product.vo.CartListVO;
import com.dd.product.vo.CartOrderListVO;
import com.dd.product.vo.CartVO;
import com.dd.product.vo.OrderFinishVO;
import com.dd.product.vo.OrderVO;
import com.dd.product.vo.ProductVO;
import com.dd.product.vo.RefundVO;
import com.dd.product.vo.ReviewReplyVO;
import com.dd.product.vo.ReviewVO;

public interface ProductController {
	public ModelAndView productmain(HttpServletRequest request, HttpServletResponse response) throws Exception;

	public ModelAndView product(@ModelAttribute ProductVO product, HttpServletRequest request,
			HttpServletResponse response) throws Exception;

	public String productform(HttpServletRequest request, HttpServletResponse response) throws Exception;

	public List<JjimVO> proDl(HttpServletRequest request, HttpServletResponse response) throws Exception;

	public ResponseEntity productpost(@RequestParam(value = "product_Option1", required = false) String product_Option1,
			@RequestParam(value = "product_Option2", required = false) String product_Option2,
			MultipartHttpServletRequest multipartRequest, HttpServletResponse response) throws Exception;

	public String productmod(Model model, HttpServletRequest request, HttpServletResponse response) throws Exception;

	public ModelAndView productmanager(HttpServletRequest req) throws Exception;

	public ModelAndView productMod(HttpServletRequest req) throws Exception;

	public String productUpdate(@RequestParam String product_Option1, @RequestParam String product_Option2,
			MultipartHttpServletRequest req) throws Exception;

	public Map<String, Object> productdelete(@RequestBody int pro, HttpServletRequest req) throws Exception;

	public String upload(MultipartHttpServletRequest multipartRequest) throws Exception;


	public Map<String, Object> review(@RequestBody Map<String, Object> body, ReviewVO review, HttpServletRequest req);

	public String reviewReply(@ModelAttribute ReviewReplyVO reply, HttpServletRequest req) throws Exception;

	public ModelAndView daedatgle(@ModelAttribute ReviewReplyVO reply, HttpServletRequest req) throws Exception;

	public Map<String, Object> cartpost(@RequestBody Map<String, Object> body, CartVO cartVO,
			HttpServletRequest request);

	public ModelAndView cart(Model model, HttpServletRequest request);

	public Map<String, Object> cartdelete(@RequestBody int body, HttpServletRequest request);

	public ModelAndView addCartOrder(CartListVO cartlist, HttpServletRequest request, HttpServletResponse response)
			throws Exception;

	public ModelAndView cartorder(HttpServletRequest request, OrderVO orderVO);

	public ModelAndView carteach(CartOrderListVO cartorderlistVO, HttpServletRequest request,
			HttpServletResponse response) throws Exception;

	public ModelAndView order(HttpServletRequest request, OrderVO orderVO);

	public Map<String, Object> ordereach(@RequestBody Map<String, Object> body, OrderVO orderVO,
			HttpServletRequest request);

	public Map<String, Object> ordereachfinish(OrderFinishVO ofv, HttpServletRequest request,
			@RequestBody Map<String, Object> body);

	public ModelAndView orderfinishs(HttpServletRequest request, OrderFinishVO ofv);

	public String oft(HttpServletRequest request);

	public ModelAndView mypaylist(HttpServletRequest request);

	public String stateupdate(HttpServletRequest req) throws Exception;

	public String statedelete(HttpServletRequest request) throws Exception;

	public String reviewform(Model Mo, HttpServletRequest req);
	
	public String refundform(Model mo, HttpServletRequest req);
	
	public Map<String, Object> payrefunds(@RequestBody Map<String, Object> body, RefundVO refund,
			HttpServletRequest request);
}
