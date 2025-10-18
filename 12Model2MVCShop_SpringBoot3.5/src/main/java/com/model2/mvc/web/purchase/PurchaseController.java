package com.model2.mvc.web.purchase;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.model2.mvc.common.Page;
import com.model2.mvc.common.Search;
import com.model2.mvc.service.domain.Product;
import com.model2.mvc.service.domain.ProductImage;
import com.model2.mvc.service.domain.Purchase;
import com.model2.mvc.service.domain.User;
import com.model2.mvc.service.product.ProductService;
import com.model2.mvc.service.purchase.PurchaseService;

import jakarta.servlet.http.HttpSession;

@Controller
@RequestMapping("/purchase/*")
public class PurchaseController {

	@Autowired
	@Qualifier("purchaseServiceImpl")
	private PurchaseService purchaseService;

	@Autowired
	@Qualifier("productServiceImpl")
	private ProductService productService;

	public PurchaseController() {
		System.out.println(this.getClass());
	}

	@Value("${pageUnit}")
	private int pageUnit;

	@Value("${pageSize}")
	private int pageSize;
	
	@GetMapping("add")
	public String addRedirect(@RequestParam("prodNo") int prodNo,
			@RequestParam(value = "qty", defaultValue = "1") int qty) {
		return "redirect:/purchase/addPurchase?prodNo=" + prodNo + "&qty=" + qty;
	}

	// ===== 구매 등록 화면 =====
	@GetMapping("addPurchase")
	public String addPurchase(@RequestParam("prodNo") int prodNo,
			@RequestParam(value = "qty", defaultValue = "1") int qty,
			@RequestParam(value = "embed", defaultValue = "false") boolean embed,
			@RequestHeader(value = "X-Requested-With", required = false) String xrw, Model model) throws Exception {

		System.out.println("/purchase/addPurchase : GET");

		Product product = productService.getProduct(prodNo);
		List<ProductImage> productImages = productService.getProductImages(prodNo);

		model.addAttribute("product", product);
		model.addAttribute("productImages", productImages);
		model.addAttribute("qty", Math.max(1, qty));

		boolean isFragment = embed || "XMLHttpRequest".equalsIgnoreCase(xrw);

		if (isFragment) {
			return "forward:/purchase/addPurchase.jsp";
		}

		model.addAttribute("pageCss", "/css/addPurchase.css");
		model.addAttribute("pageJs", "/javascript/addPurchase.js");
		model.addAttribute("entry",
				"/purchase/addPurchase?prodNo=" + prodNo + "&qty=" + qty + "&embed=1 .container:first");

		return "forward:/index.jsp";
	}

	// ===== 구매 등록 처리 =====
	@PostMapping("addPurchase")
	public String addPurchase(@ModelAttribute("purchase") Purchase purchase,
			@RequestParam(value = "prodNo", required = false) Integer prodNo,
			@RequestParam(value = "qty", defaultValue = "1") int qty, HttpSession session) throws Exception {

		System.out.println("/purchase/addPurchase : POST");

		User login = (User) session.getAttribute("user");
		if (login != null) {
			purchase.setBuyer(login);
		}

		if (purchase.getPurchaseProd() == null && prodNo != null) {
			Product p = new Product();
			p.setProdNo(prodNo);
			purchase.setPurchaseProd(p);
		}

		purchase.setQty(qty <= 0 ? 1 : qty);
		if (purchase.getTranCode() == null) {
			purchase.setTranCode("001"); // 주문완료
		}

		purchaseService.addPurchase(purchase);
		return "redirect:/purchase/getPurchase?tranNo=" + purchase.getTranNo();
	}

	// ===== 구매 상세 =====
	@RequestMapping(value = "getPurchase", method = RequestMethod.GET)
	public String getPurchase(@RequestParam("tranNo") int tranNo, Model model) throws Exception {
		System.out.println("/purchase/getPurchase : GET");

		Purchase purchase = purchaseService.getPurchase(tranNo);
		int prodNo = purchase.getPurchaseProd().getProdNo();
		List<ProductImage> productImages = productService.getProductImages(prodNo);

		model.addAttribute("purchase", purchase);
		model.addAttribute("productImages", productImages);

		return "forward:/purchase/getPurchase.jsp";
	}

	// ===== 구매 수정 화면 =====
	@RequestMapping(value = "updatePurchase", method = RequestMethod.GET)
	public String updatePurchase(@RequestParam("tranNo") int tranNo, Model model) throws Exception {
		System.out.println("/purchase/updatePurchase : GET");

		model.addAttribute("purchase", purchaseService.getPurchase(tranNo));
		return "forward:/purchase/updatePurchaseView.jsp";
	}

	// ===== 구매 수정 처리 =====
	@RequestMapping(value = "updatePurchase", method = RequestMethod.POST)
	public String updatePurchase(@ModelAttribute("purchase") Purchase purchase) throws Exception {
		System.out.println("/purchase/updatePurchase : POST");

		purchaseService.updatePurchase(purchase);
		return "redirect:/purchase/getPurchase?tranNo=" + purchase.getTranNo();
	}

	// ===== 구매 취소 =====
	@RequestMapping(value = "cancelPurchase", method = RequestMethod.POST)
	public String cancelPurchase(@RequestParam("tranNo") int tranNo,
			@RequestParam(value = "reason", required = false) String reason) throws Exception {
		System.out.println("/purchase/cancelPurchase : POST");

		// 상태 검증은 서비스에서 처리(정책변경 용이)
		purchaseService.cancelPurchaseWithReason(tranNo, reason == null ? "" : reason.trim());
		return "redirect:/purchase/listPurchase";
	}

	// ===== 구매 목록(사용자) =====
	@RequestMapping(value = "listPurchase")
	public String listPurchase(@ModelAttribute("search") Search search, HttpSession session, Model model)
			throws Exception {
		System.out.println("/purchase/listPurchase : GET / POST");

		User login = (User) session.getAttribute("user");
		if (login == null) {
			return "redirect:/user/loginView.jsp";
		}

		if (search.getCurrentPage() == 0)
			search.setCurrentPage(1);
		if (search.getPageSize() == 0)
			search.setPageSize(pageSize);

		Map<String, Object> map = purchaseService.getPurchaseList(search, login.getUserId());

		Page resultPage = new Page(search.getCurrentPage(), ((Integer) map.get("totalCount")).intValue(), pageUnit,
				search.getPageSize());

		model.addAttribute("list", map.get("list"));
		model.addAttribute("resultPage", resultPage);
		model.addAttribute("search", search);

		return "forward:/purchase/listPurchase.jsp";
	}

	// ===== 거래상태 코드 변경(거래번호 기준, 공용) =====
	@RequestMapping(value = "updateTranCode", method = RequestMethod.POST)
	public String updateTranCode(@RequestParam("tranNo") int tranNo, @RequestParam("tranCode") String tranCode)
			throws Exception {
		System.out.println("/purchase/updateTranCode : POST");

		purchaseService.updateTranCode(tranNo, tranCode);
		return "redirect:/purchase/getPurchase?tranNo=" + tranNo;
	}

	// ===== 구매자 수령확인 =====
	@RequestMapping(value = "confirmReceive", method = RequestMethod.POST)
	public String confirmReceive(@RequestParam("tranNo") int tranNo) throws Exception {
		System.out.println("/purchase/confirmReceive : POST");

		purchaseService.updateTranCode(tranNo, "003"); // 배송완료
		return "redirect:/purchase/getPurchase?tranNo=" + tranNo;
	}

	// ===== 관리자: 상품별 상태 일괄변경 =====
	@RequestMapping(value = "updateTranCodeByProd", method = RequestMethod.POST)
	public String updateTranCodeByProd(@RequestParam("prodNo") int prodNo, @RequestParam("tranCode") String tranCode)
			throws Exception {
		System.out.println("/purchase/updateTranCodeByProd : POST");

		purchaseService.updateTranCodeByProd(prodNo, tranCode);
		return "redirect:/product/listProduct?menu=manage";
	}

	// ===== 관리자: 취소요청 승인(단건) =====
	@RequestMapping(value = "ackCancelByTran", method = RequestMethod.POST)
	public String acknowledgeCancelByTran(@RequestParam("tranNo") int tranNo) throws Exception {
		System.out.println("/purchase/ackCancelByTran : POST");

		purchaseService.updateTranCode(tranNo, "005"); // 취소확인
		return "redirect:/product/listProduct?menu=manage";
	}

	// ===== 관리자: 상품별 주문내역 팝업 =====
	@RequestMapping(value = "historyByProduct", method = RequestMethod.GET)
	public String getHistoryByProduct(@RequestParam("prodNo") int prodNo, Model model) throws Exception {
		System.out.println("/purchase/historyByProduct : GET");

		List<Purchase> list = purchaseService.getPurchaseHistoryByProduct(prodNo);
		model.addAttribute("prodNo", prodNo);
		model.addAttribute("list", list);

		return "forward:/purchase/historyByProduct.jsp";
	}
}
