package com.dd.product.controller;

import java.io.File;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.ModelAndView;

import com.dd.dealing.vo.BoardVO;
import com.dd.dealing.vo.JjimVO;
import com.dd.dealing.vo.MemberVO;
import com.dd.product.service.ProductService;
import com.dd.product.vo.CartListVO;
import com.dd.product.vo.CartOrderListVO;
import com.dd.product.vo.CartVO;
import com.dd.product.vo.OrderFinishVO;
import com.dd.product.vo.OrderVO;
import com.dd.product.vo.ProductVO;
import com.dd.product.vo.RefundVO;
import com.dd.product.vo.ReviewReplyVO;
import com.dd.product.vo.ReviewVO;

@Controller("productController")
public class ProductControllerImpl implements ProductController {
	private static final String PRODUCT_IMAGE_REPO = "C:\\spring\\project\\dadream\\src\\main\\resources\\static\\product";
	private static final Logger log = LoggerFactory.getLogger(ProductControllerImpl.class);
	@Autowired
	private ProductService productService;
	@Autowired
	private ProductVO productVO;

	/* 사용자 가구 메인 */
	@Override
	@RequestMapping(value = { "/productmain.do" }, method = RequestMethod.GET)
	public ModelAndView productmain(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String viewName = (String) request.getAttribute("viewName");
		System.out.println("interceptor에서 온 viewName:" + viewName);
		ModelAndView mav = new ModelAndView();
		mav.setViewName(viewName);
		List<ProductVO> product = productService.productView();
		List<BoardVO> board = productService.inteView();
		mav.addObject("product", product);
		mav.addObject("board", board);
		log.info("ㅎㅇ");
		return mav;
	}

	/* 상품목록 */
	@Override
	@RequestMapping(value = { "/product.do" }, method = RequestMethod.GET)
	public ModelAndView product(@ModelAttribute ProductVO product, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		String viewName = (String) request.getAttribute("viewName");
		String product_Name = (String) product.getProduct_Name();
		System.out.println("product_Name :" + product_Name);

		List<ProductVO> productsList = productService.listProducts(product_Name);
		ModelAndView mav = new ModelAndView(viewName);
		HttpSession session = request.getSession();
		MemberVO member = (MemberVO) session.getAttribute("member");
		String user_Id = "";
		if (member == null) {
			user_Id = "guest";
		} else {
			user_Id = member.getUser_Id();
		}

		List<CartVO> info = new ArrayList();
//		Map<String, Object> info = new HashMap<>();
		info = productService.cartlist(user_Id);
//		mav.setViewName(viewName);
		mav.addObject("productsList", productsList);
		mav.addObject("info", info);
		return mav;
	}

	/* 판매자 상품 등록 창 */
	@Override
	@RequestMapping(value = { "/productform.do" }, method = { RequestMethod.POST })
	public String productform(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String viewName = (String) request.getAttribute("viewName");
		System.out.println("interceptor에서 온 viewName:" + viewName);
		return viewName;
	}

	/* 상품목록창에서 부동산 리스트 */
	@Override
	@ResponseBody
	@RequestMapping(value = "/proDealing.do", method = RequestMethod.POST)
	public List<JjimVO> proDl(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String user_Id2 = request.getParameter("user_Id");
		System.out.println("유저 아이디 : " + user_Id2);
		List<JjimVO> proDlList = new ArrayList<JjimVO>();
		proDlList = productService.proDl(user_Id2);
		System.out.println("매물 리스트 : " + proDlList);
		return proDlList;
	}

	/* 상품 글 등록 */
	@Override
	@RequestMapping(value = "/productpost.do", method = RequestMethod.POST)
	@ResponseBody
	public ResponseEntity productpost(@RequestParam(value = "product_Option1", required = false) String product_Option1,
			@RequestParam(value = "product_Option2", required = false) String product_Option2,
			MultipartHttpServletRequest multipartRequest, HttpServletResponse response) throws Exception {
		multipartRequest.setCharacterEncoding("utf-8");
		Map<String, Object> productMap = new HashMap<String, Object>();
		Enumeration enu = multipartRequest.getParameterNames();
		while (enu.hasMoreElements()) {
			String name = (String) enu.nextElement();
//			System.out.println(name);
			String value = multipartRequest.getParameter(name);
//			System.out.println(value);
			productMap.put(name, value);
		}
//		MultivalueMap 도 사용가능
		productMap.put("product_Option1", product_Option1);
		productMap.put("product_Option2", product_Option2);
		String imageFileName = upload(multipartRequest);
		HttpSession session = multipartRequest.getSession();
		MemberVO memberVO = (MemberVO) session.getAttribute("member");
		String user_Id = memberVO.getUser_Id();
		System.out.println("이미지 파일 이름 : " + imageFileName);
		productMap.put("user_Id", user_Id);
		productMap.put("product_Views", 1);
		productMap.put("product_Image", imageFileName);
		String message;
		ResponseEntity resEnt = null;
		HttpHeaders responseHeaders = new HttpHeaders();
		responseHeaders.add("content-Type", "text/html;charset=utf-8");

		try {
			int result = productService.addProduct(productMap);
//			
			message = "<script>";
			message += "alert('상품등록이 완료되었습니다.');";
			message += "location.href='" + multipartRequest.getContextPath() + "/productmain.do'";
			message += "</script>";
			resEnt = new ResponseEntity(message, responseHeaders, HttpStatus.CREATED);
		} catch (Exception e) {
			File srcFile = new File(PRODUCT_IMAGE_REPO + "\\" + "imageFileName");
			srcFile.delete();

			message = "<script>";
			message += "alert('다시 시도 하세요');";
//			message += "location.href='" + multipartRequest.getContextPath() + "location.reload();'";
			message += "";
			message += "</script>";
			resEnt = new ResponseEntity(message, responseHeaders, HttpStatus.CREATED);
			e.printStackTrace();
		}
		return resEnt;

	}

	/* 판매자 상품 상세 */
	@Override
	@RequestMapping(value = { "/productview.do" }, method = { RequestMethod.GET })
	public String productmod(Model model, HttpServletRequest request, HttpServletResponse response) throws Exception {
		String viewName = (String) request.getAttribute("viewName");
		System.out.println("interceptor에서 온 viewName:" + viewName);
		String product_Num = (String) request.getParameter("product_Num");
		int product_Nums = Integer.parseInt(product_Num);
		System.out.println("product_Nums :" + product_Nums);
		productService.viewCount(product_Nums);// 조회수
		List<ReviewVO> reviewList = productService.reviewList(product_Nums);
		System.out.println("reviewList" + reviewList);
		List<ReviewReplyVO> reply = productService.revReply();
		ProductVO result = productService.productinfo(product_Nums);
//		int parentMax = productService.parentMax();
//		System.out.println("리뷰 부모 제일 높은거 : " + parentMax);
		List<ReviewReplyVO> totalReply = productService.totalReply();
		model.addAttribute("totalReply", totalReply);
		System.out.println("totalReply" + totalReply);
//		model.addAttribute("parentMax", parentMax);
		model.addAttribute("product_Num", product_Num);
		model.addAttribute("result", result);
		model.addAttribute("review", reviewList);
		model.addAttribute("reply", reply);
		return viewName;
	}

//	상품관리 
	@Override
	@RequestMapping(value = "/productmanager.do", method = RequestMethod.POST)
	public ModelAndView productmanager(HttpServletRequest req) throws Exception {
		String viewName = (String) req.getAttribute("viewName");
		HttpSession session = req.getSession();
		MemberVO member = (MemberVO) session.getAttribute("member");
		String user_Id = member.getUser_Id();
		List<ProductVO> pro = productService.proMyList(user_Id);
		System.out.println("viewName : " + viewName);
		ModelAndView mav = new ModelAndView("/product/productmanager");
		mav.addObject("pro", pro);
		return mav;
	}

//	상품수정 
	@Override
	@RequestMapping(value = "/productMod.do", method = { RequestMethod.GET, RequestMethod.POST })
	public ModelAndView productMod(HttpServletRequest req) throws Exception {
		String product_Nums = (String) req.getParameter("product_Num");
		int product_Num = Integer.parseInt(product_Nums);
		String user_Id = (String) req.getParameter("user_Id");
		ProductVO map = new ProductVO();
		map.setUser_Id(user_Id);
		map.setProduct_Num(product_Num);
		ProductVO pro = (ProductVO) productService.proMod(map);
		ModelAndView mav = new ModelAndView("/product/productMod");
		mav.addObject("pro", pro);

		return mav;
	}

//	상품수정 전송
	@Override
	@RequestMapping(value = "/prdouctUpdate.do", method = { RequestMethod.GET, RequestMethod.POST })
	public String productUpdate(@RequestParam String product_Option1, @RequestParam String product_Option2,
			MultipartHttpServletRequest req) throws Exception {
		req.setCharacterEncoding("UTF-8");
		Map<String, Object> proModMap = new HashMap<>();
		Enumeration enu = req.getParameterNames();
		while (enu.hasMoreElements()) {
			String name = (String) enu.nextElement();
			System.out.println("key : " + name);
			String value = req.getParameter(name);
			System.out.println("value : " + value);
			proModMap.put(name, value);
		}
		String product_Nums = (String) req.getParameter("product_Num");
		int product_Num = Integer.parseInt(product_Nums);
		proModMap.put("product_Num", product_Num);

		proModMap.put("product_Option1", product_Option1);
		proModMap.put("product_Option2", product_Option2);
		String imageFileName = upload(req);
		HttpSession session = req.getSession();
		MemberVO memberVO = (MemberVO) session.getAttribute("member");
		String user_Id = memberVO.getUser_Id();
		System.out.println("이미지 파일 이름 : " + imageFileName);
		proModMap.put("user_Id", user_Id);
		proModMap.put("product_Image", imageFileName);

		productService.proPatch(proModMap);
		if (imageFileName != null && imageFileName.length() != 0) {

			File srcFile = new File(PRODUCT_IMAGE_REPO + "\\" + user_Id + "\\" + imageFileName);
//			File destDir = new File(PRODUCT_IMAGE_REPO + "\\" + user_Id);
//			FileUtils.moveFileToDirectory(srcFile, destDir, true);
//			FileUtils = srcfile 에 있는것을 destDir  장소로 옮긴다/
			if (srcFile != null) {
				String originalFileName = (String) proModMap.get("originalFileName");
				File oldFile = new File(PRODUCT_IMAGE_REPO + "\\" + user_Id + "\\" + originalFileName);
				oldFile.delete();
			}
		}

		return "redirect:/productview.do?product_Num=" + product_Num;

	}

//	상품삭제 
	@Override
	@ResponseBody
	@RequestMapping(value = "/proDelete.do", method = RequestMethod.POST)
	public Map<String, Object> productdelete(@RequestBody int pro, HttpServletRequest req) throws Exception {
		System.out.println(pro);

//		HttpSession session = req.getSession();
//		MemberVO member = (MemberVO) session.getAttribute("member");
//		String user_Id = member.getUser_Id();
		int result = 0;
		result = productService.proDelete(pro);
		Map<String, Object> map = new HashMap<>();
		map.put("result", result);

		return map;
	}

//	이미지 업로드
	@Override
	public String upload(MultipartHttpServletRequest multipartRequest) throws Exception {
		String imageFileName = null;
		Iterator<String> fileNames = multipartRequest.getFileNames();
		HttpSession session = multipartRequest.getSession();
		MemberVO memberVO = (MemberVO) session.getAttribute("member");
		String user_Id = memberVO.getUser_Id();
		int count = 0;
//		썸머노트가 뻇어가서 일단 주석
//		while (fileNames.hasNext()) {
		String fileName = fileNames.next();
		MultipartFile mFile = multipartRequest.getFile(fileName);
		imageFileName = mFile.getOriginalFilename();
		File file = new File(PRODUCT_IMAGE_REPO + "\\" + user_Id + "\\" + imageFileName);
		if (mFile.getSize() != 0) {
			if (!file.exists()) {
				file.getParentFile().mkdirs();
				mFile.transferTo(new File(PRODUCT_IMAGE_REPO + "\\" + user_Id + "\\" + imageFileName));
			}
		}
//		}
		return imageFileName;
	}

//	리뷰
	@Override
	@RequestMapping(value = "/reviewform.do", method = { RequestMethod.GET, RequestMethod.POST })
	public String reviewform(Model mo, HttpServletRequest req) {
//		String viewName = (String) req.getAttribute("viewName");
		String product_Num = req.getParameter("product_Num");
		mo.addAttribute("product_Num", product_Num);
		return "/product/reviewform";
	}

//	리뷰등록
	@Override
	@RequestMapping(value = "/reviewpost.do", method = { RequestMethod.POST })
	public Map<String, Object> review(@RequestBody Map<String, Object> body, ReviewVO review, HttpServletRequest req) {
		int result = 0;
		String product_Num = req.getParameter("product_Num");
		HttpSession session = req.getSession();
		MemberVO member = (MemberVO) session.getAttribute("member");
		String user_Id = (String) member.getUser_Id();
		body.put("user_Id", user_Id);
		body.put("product_Num", product_Num);
		result = productService.reviewpost(body);
		Map<String, Object> response = new HashMap<>();
		response.put("result", result);
		return response;
	}

//	리뷰 답글
	@Override
	@RequestMapping(value = "/reviewReply.do", method = { RequestMethod.POST })
	public String reviewReply(@ModelAttribute ReviewReplyVO reply, HttpServletRequest req) throws Exception {
		HttpSession session = req.getSession();
		MemberVO member = (MemberVO) session.getAttribute("member");
		String user_Id = member.getUser_Id();
		String product_Num = req.getParameter("product_Num");
		reply.setUser_Id(user_Id);
		reply.setParent_No(0);
		productService.reviewReply(reply);
		return "redirect:/productview.do?product_Num=" + product_Num;
	}

//	리뷰 댓글 리스트
//	@RequestMapping(value = "/revReply.do", method = { RequestMethod.POST })
//	@ResponseBody
//	private Map<String, Object> revReply(@RequestBody int review_Num, HttpServletRequest req) throws Exception {
//		List<ReviewReplyVO> result = productService.revReply(review_Num);
//		System.out.println(review_Num);
//		Map<String, Object> map = new HashMap<>();
//		map.put("result", result);
//		System.out.println("result" + result);
//		return map;
//	}

//	대댓글
	@Override
	@RequestMapping(value = "/daedatgle.do", method = { RequestMethod.POST })
	public ModelAndView daedatgle(@ModelAttribute ReviewReplyVO reply, HttpServletRequest req) throws Exception {
		HttpSession session = req.getSession();
		MemberVO member = (MemberVO) session.getAttribute("member");
		String user_Id = member.getUser_Id();
		reply.setUser_Id(user_Id);
		String product_Nums = req.getParameter("product_Num");
		int product_Num = Integer.parseInt(product_Nums);

		productService.daedatgle(reply);

		ModelAndView mav = new ModelAndView("redirect:/productview.do?product_Num=" + product_Num);
		return mav;
	}

	////////////////////////// 주문/장바구니/등//////////////////////////////

	/* 장바구니 등록 */
	@Override
	@ResponseBody
	@RequestMapping(value = "/cart.do", method = RequestMethod.POST)
	public Map<String, Object> cartpost(@RequestBody Map<String, Object> body, CartVO cartVO,
			HttpServletRequest request) {

		System.out.println("cart들어왔다");

		int result = 0;

		HttpSession session = request.getSession();
		MemberVO member = (MemberVO) session.getAttribute("member");
		String user_Id = member.getUser_Id();

		body.put("user_Id", user_Id);
		System.out.println(body);
		result = productService.cart(body);
		Map<String, Object> cart = new HashMap<String, Object>();
		cart.put("result", result);

		return cart;
	}

	/* 장바구니 창 */
	@Override
	@RequestMapping("/cartweb.do")
	public ModelAndView cart(Model model, HttpServletRequest request) {
		HttpSession session = request.getSession();
		MemberVO member = (MemberVO) session.getAttribute("member");
		String user_Id = member.getUser_Id();
		List<CartVO> info = new ArrayList();
//		Map<String, Object> info = new HashMap<>();
		info = productService.cartlist(user_Id);
		System.out.println("info :" + info);
		ModelAndView mav = new ModelAndView("/cartweb");
		mav.addObject("info", info);
		return mav;
	}

//	장바구니 삭제
	@Override
	@ResponseBody
	@RequestMapping(value = "/cartdelete.do", method = RequestMethod.POST)
	public Map<String, Object> cartdelete(@RequestBody int body, HttpServletRequest request) {

		int result = 0;
		result = productService.cartdelete(body);
		System.out.println("cartbody :" + body);
		Map<String, Object> map = new HashMap<>();
		map.put("result", result);
		return map;
	}

//	장바구니 목록 구매 db 연동
	@Override
	@ResponseBody
	@RequestMapping(value = "/addCartOrder.do", method = { RequestMethod.POST, RequestMethod.GET })
	public ModelAndView addCartOrder(CartListVO cartlist, HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		HttpSession session = request.getSession();
		MemberVO member = (MemberVO) session.getAttribute("member");
		String user_Id = member.getUser_Id();
		productService.deletecartorder(user_Id);
		request.setCharacterEncoding("utf-8");

		productService.addCartOrder(cartlist);
		System.out.println(cartlist);
		ModelAndView mav = new ModelAndView("redirect:/cartorder.do");
		return mav;
	}

//	장바구니 결제 리스트
	@Override
	@RequestMapping(value = "/cartorder.do", method = { RequestMethod.GET, RequestMethod.POST })
	public ModelAndView cartorder(HttpServletRequest request, OrderVO orderVO) {
		HttpSession session = request.getSession();
		MemberVO member = (MemberVO) session.getAttribute("member");
		String user_Id = member.getUser_Id();

		List<OrderVO> info = new ArrayList<>();
		info = productService.ordercartlist(user_Id);
		String viewName = (String) request.getAttribute("viewName");
		System.out.println("interceptor에서 온 viewName:" + viewName);
		ModelAndView mav = new ModelAndView("/cartorder");
		String cart_Num = (String) request.getParameter("cart_Num");
		System.out.println(cart_Num);
		info.add(orderVO);
		mav.addObject("user_Id", user_Id);
		mav.addObject("cart_Num", cart_Num);
		mav.addObject("info", info);
		System.out.println("info :" + info);
		return mav;
	}

//	장바구니 결제 db리스트
	@Override
	@ResponseBody
	@RequestMapping(value = "/carteach.do", method = { RequestMethod.POST, RequestMethod.GET })
	public ModelAndView carteach(CartOrderListVO cartorderlistVO, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		HttpSession session = request.getSession();
		MemberVO member = (MemberVO) session.getAttribute("member");
		String user_Id = member.getUser_Id();
		request.setCharacterEncoding("utf-8");
//		productService.cocount(cartorderlistVO);
		productService.carteach(cartorderlistVO);
		ModelAndView mav = new ModelAndView("redirect:/orderfinishs.do");
		return mav;
	}

	// 결제창
	@Override
	@RequestMapping(value = "/order.do", method = RequestMethod.POST)
	public ModelAndView order(HttpServletRequest request, OrderVO orderVO) {
		HttpSession session = request.getSession();
		MemberVO member = (MemberVO) session.getAttribute("member");

		String user_Id = member.getUser_Id();
		List<OrderVO> infoOrder = new ArrayList();
//			Map<String, Object> infoOrder = new HashMap<>();
		infoOrder = productService.orderlist(user_Id);
		System.out.println("infoOrder :" + infoOrder);
		String viewName = (String) request.getAttribute("viewName");
		System.out.println("interceptor에서 온 viewName:" + viewName);
		ModelAndView mav = new ModelAndView("/order");
		String product_Num = (String) request.getParameter("product_Num");
		System.out.println("product_Num :" + product_Num);

		mav.addObject("product_Num", product_Num);
		mav.addObject("infoOrder", infoOrder);

		return mav;
	}

//	결제 잠시 db연동
	@Override
	@ResponseBody
	@RequestMapping(value = "/ordereach.do", method = { RequestMethod.GET, RequestMethod.POST })
	public Map<String, Object> ordereach(@RequestBody Map<String, Object> body, OrderVO orderVO,
			HttpServletRequest request) {
		int result = 0;
		HttpSession session = request.getSession();
		MemberVO member = (MemberVO) session.getAttribute("member");
		String user_Id = member.getUser_Id();
		productService.deletecartorder(user_Id);
		String order_Num = orderVO.getOrder_Num();
		System.out.println("order_Num : " + order_Num);
		body.put("user_Id", user_Id);

		body.put("orderVO", orderVO);
		body.put("productVO", productVO);
		result = productService.order(body);
		Map<String, Object> order = new HashMap<String, Object>();
		order.put("result", result);
		System.out.println("body : " + body);
		System.out.println("result : " + result);
		System.out.println("user_Id : " + user_Id);
		return order;
	}

//	결제 정보 받기
	@Override
	@ResponseBody
	@RequestMapping(value = "orderfinish.do", method = { RequestMethod.GET, RequestMethod.POST })
	public Map<String, Object> ordereachfinish(OrderFinishVO ofv, HttpServletRequest request,
			@RequestBody Map<String, Object> body) {

		int result = 0;
		int results = 0;
		HttpSession session = request.getSession();
		MemberVO member = (MemberVO) session.getAttribute("member");
		String user_Id = member.getUser_Id();
		body.put("user_Id", user_Id);
		body.put("ofv", ofv);
//		results = productService.ocount(body);
		result = productService.orders(body);
		Map<String, Object> order = new HashMap<String, Object>();
		order.put("results", results);
		order.put("result", result);
		System.out.println("body : " + body);
		System.out.println("order : " + order);
		return order;
	}

//	토스호출
	@Override
	@RequestMapping(value = "/orderfinishs.do", method = { RequestMethod.GET, RequestMethod.POST })
	public ModelAndView orderfinishs(HttpServletRequest request, OrderFinishVO ofv) {
		HttpSession session = request.getSession();
		MemberVO member = (MemberVO) session.getAttribute("member");

		String user_Id = member.getUser_Id();
		String viewName = (String) request.getAttribute("viewName");
		System.out.println("interceptor에서 온 viewName:" + viewName);
		List<OrderFinishVO> info = new ArrayList<>();
		info = productService.orderfinishs(user_Id);
		System.out.println("info :" + info);
		String product_Name = ofv.getProduct_Name();
		System.out.println("product_Name : " + product_Name);
		ModelAndView mav = new ModelAndView(viewName);
		mav.addObject("info", info);
		mav.addObject("ofv", ofv);
		return mav;
	}

//	주문완료
	@Override
	@RequestMapping(value = "/oft.do", method = { RequestMethod.GET, RequestMethod.POST })
	public String oft(HttpServletRequest request) {
		HttpSession session = request.getSession();
		MemberVO member = (MemberVO) session.getAttribute("member");
		String user_Id = member.getUser_Id();
		Map<String, Object> oftm = new HashMap<>();
//		List<OrderFinishVO> oft = new ArrayList<OrderFinishVO>();
		oftm.put("user_Id", user_Id);
//		oftm.put("oft", oft);
		productService.oft(oftm);
		return "/oft";
	}

//	판매자 판매내역
	@Override
	@RequestMapping(value = "mypaylist.do", method = { RequestMethod.GET, RequestMethod.POST })
	public ModelAndView mypaylist(HttpServletRequest request) {
		HttpSession session = request.getSession();
		MemberVO member = (MemberVO) session.getAttribute("member");
		String user_Id = member.getUser_Id();
		List<ProductVO> pro = new ArrayList<ProductVO>();
		List<OrderFinishVO> ofv = new ArrayList<OrderFinishVO>();
		pro = productService.prolist(user_Id);
		ModelAndView mav = new ModelAndView("/mypaylist");
		mav.addObject("pro", pro);
		mav.addObject("ofv", ofv);
		return mav;
	}

//	상품수정 
	@Override
	@RequestMapping(value = "/state/update.do", method = { RequestMethod.GET, RequestMethod.POST })
	public String stateupdate(HttpServletRequest req) throws Exception {
		String order_Num = (String) req.getParameter("order_Num");
		String order_State = (String) req.getParameter("order_State");
		Map<String, Object> map = new HashMap<>();
		map.put("order_Num", order_Num);
		map.put("order_State", order_State);
		productService.stateupdate(map);
//		ModelAndView mav = new ModelAndView("/redirect:/mypaylist");
//		mav.addObject("map", map);

		return "redirect:/mypaylist.do";
	}

//	상품환불
	@Override
	@RequestMapping(value = "/state/delete.do", method = { RequestMethod.GET, RequestMethod.POST })
	public String statedelete(HttpServletRequest request) throws Exception {
		String order_Num = (String) request.getParameter("order_Num");
		Map<String, Object> dmap = new HashMap<>();
		Map<String, Object> cmap = new HashMap<>();

		List<ProductVO> plist = new ArrayList<ProductVO>();
		List<OrderFinishVO> olist = new ArrayList<OrderFinishVO>();
		cmap.put("plist", plist);
		cmap.put("olist", olist);
		productService.deletecount(cmap);

		dmap.put("order_Num", order_Num);
		productService.statedelete(dmap);
		return "redirect:/mypaylist.do";
	}

//	환불이유폼
	@Override
	@RequestMapping(value = "/refundform.do", method = { RequestMethod.GET, RequestMethod.POST })
	public String refundform(Model mo, HttpServletRequest req) {
		String order_Num = req.getParameter("order_Num");
		mo.addAttribute("order_Num", order_Num);
		return "/product/refundform";
	}

//	환불이유
	@Override
	@RequestMapping(value = "/payrefunds.do", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> payrefunds(@RequestBody Map<String, Object> body, RefundVO refund,
			HttpServletRequest request) {
		int result = 0;
		String order_Num = request.getParameter("order_Num");
		HttpSession session = request.getSession();
		MemberVO member = (MemberVO) session.getAttribute("member");
		String user_Id = (String) member.getUser_Id();
		body.put("user_Id", user_Id);
		body.put("order_Num", order_Num);
		String aa = (String) body.get("refund_Name");
		System.out.println("aaa" + aa);
		result = productService.refunds(body);
		Map<String, Object> response = new HashMap<>();
		response.put("result", result);
		System.out.println(response);
		return response;
	}

//	구매내역	
//	환불내역
	@RequestMapping(value = "/orderlist.do", method = { RequestMethod.GET, RequestMethod.POST })
	public ModelAndView orderlist(HttpServletRequest request, HttpServletResponse response) throws Exception {
		HttpSession session = request.getSession();
		ModelAndView mav = new ModelAndView();
		String viewName = (String) request.getAttribute("viewName");
		MemberVO member = (MemberVO) session.getAttribute("member");
		String user_Id = member.getUser_Id();
		List<OrderFinishVO> myofv = new ArrayList<OrderFinishVO>();
		List<OrderFinishVO> refund = new ArrayList<OrderFinishVO>();
		myofv = productService.myofv(user_Id);
		refund = productService.refund(user_Id);
		mav.addObject("myofv", myofv);
		mav.addObject("refund", refund);
		mav.setViewName(viewName);
		return mav;
	}
}
