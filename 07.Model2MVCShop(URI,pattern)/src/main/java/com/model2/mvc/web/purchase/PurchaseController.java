package com.model2.mvc.web.purchase;

import java.util.Map;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.model2.mvc.common.Page;
import com.model2.mvc.common.Search;
import com.model2.mvc.service.domain.Product;
import com.model2.mvc.service.domain.Purchase;
import com.model2.mvc.service.domain.User;
import com.model2.mvc.service.product.ProductService;
import com.model2.mvc.service.purchase.PurchaseService;

@Controller
@RequestMapping("/purchase/*")
public class PurchaseController {

	private final PurchaseService purchaseService;
	private final ProductService productService;

	@Value("#{commonProperties['pageUnit'] ?: 5}")
	private int pageUnit;

	@Value("#{commonProperties['pageSize'] ?: 5}")
	private int pageSize;

	public PurchaseController(PurchaseService purchaseService, ProductService productService) {
		this.purchaseService = purchaseService;
		this.productService = productService;
	}

	// 구매등록 화면
//	@RequestMapping(value = "/addPurchaseView.do", method = RequestMethod.GET)
	@RequestMapping(value = "addPurchase", method = RequestMethod.GET)
	public String addPurchaseView(@RequestParam("prodNo") int prodNo, Model model) throws Exception {

		Product product = productService.getProduct(prodNo);
		model.addAttribute("prodNo", prodNo);
		model.addAttribute("p", product);
		return "forward:/purchase/addPurchase.jsp";
	}

	// 구매등록 처리(주문완료 001로 저장)
	@RequestMapping(value = "addPurchase", method = RequestMethod.POST)
	public String addPurchase(@ModelAttribute("purchase") Purchase purchase, HttpSession session, Model model)
			throws Exception {

		User sessionUser = (User) session.getAttribute("user"); // 로그인 세션 키: user
		if (sessionUser != null) {
			purchase.setBuyer(sessionUser);
		}
		if (purchase.getTranCode() == null || purchase.getTranCode().isEmpty()) {
			purchase.setTranCode("001"); // 주문완료
		}

		purchaseService.addPurchase(purchase);

		// 방금 등록한 구매건 다시 조회 후 상세 화면으로 forward
		Purchase saved = purchaseService.getPurchase(purchase.getTranNo());
		model.addAttribute("purchase", saved);
		return "forward:/purchase/getPurchase.jsp";
	}

	// 구매상세
//	@RequestMapping("/getPurchase.do")
	@RequestMapping("getPurchase")
	public String getPurchase(@RequestParam("tranNo") int tranNo, Model model) throws Exception {
		model.addAttribute("purchase", purchaseService.getPurchase(tranNo));
		return "forward:/purchase/getPurchase.jsp";
	}

	// 구매수정 화면
	@RequestMapping("updatePurchase")
	public String updatePurchaseView(@RequestParam("tranNo") int tranNo, Model model) throws Exception {
		model.addAttribute("purchase", purchaseService.getPurchase(tranNo));
		return "forward:/purchase/updatePurchaseView.jsp";
	}

	// 구매수정 처리 (배송 전만 가능)
	@RequestMapping(value = "updatePurchase", method = RequestMethod.POST)
	public String updatePurchase(@ModelAttribute("purchase") Purchase purchase) throws Exception {
		purchaseService.updatePurchase(purchase);
		return "redirect:/purchase/getPurchase?tranNo=" + purchase.getTranNo();
	}

	// 구매취소
	@RequestMapping(value = "cancelPurchase", method = RequestMethod.POST)
	public String cancelPurchase(@RequestParam("tranNo") int tranNo, HttpSession session) throws Exception {
		Purchase purchase = purchaseService.getPurchase(tranNo);

		// 배송중/배송완료는 취소 불가
		if ("002".equals(purchase.getTranCode()) || "003".equals(purchase.getTranCode())) {
			return "forward:/common/error.jsp"; // 혹은 에러메시지
		}

		purchaseService.updateTranCode(tranNo, "004"); // 취소 코드
		return "redirect:/purchase/listPurchase";
	}

	// 구매목록(구매자)
	@RequestMapping("listPurchase")
	public String listPurchase(@ModelAttribute("search") Search search, HttpSession session, Model model)
			throws Exception {

		if (search.getCurrentPage() == 0)
			search.setCurrentPage(1);
		if (search.getPageSize() == 0)
			search.setPageSize(pageSize);

		User user = (User) session.getAttribute("user");
		if (user == null)
			return "redirect:/user/loginView.jsp";

		Map<String, Object> map = purchaseService.getPurchaseList(search, user.getUserId());

		Page resultPage = new Page(search.getCurrentPage(), ((Integer) map.get("totalCount")).intValue(), pageUnit,
				search.getPageSize());

		model.addAttribute("list", map.get("list"));
		model.addAttribute("resultPage", resultPage);
		model.addAttribute("search", search);
		return "forward:/purchase/listPurchase.jsp";
	}

	// 거래상태 변경(공용) - 배송중/배송완료 등으로 변경
	@RequestMapping(value = "updateTranCode", method = RequestMethod.POST)
	public String updateTranCode(@RequestParam("tranNo") int tranNo, @RequestParam("tranCode") String tranCode)
			throws Exception {
		purchaseService.updateTranCode(tranNo, tranCode);
		return "redirect:/purchase/getPurchase?tranNo=" + tranNo;
	}

	// 구매자: 물품 수령(배송중 -> 배송완료)
	@RequestMapping("confirmReceive")
	public String confirmReceive(@RequestParam("tranNo") int tranNo, @RequestParam("prodNo") int prodNo)
			throws Exception {
		purchaseService.updateTranCode(tranNo, "003"); // 배송완료
		purchaseService.updateTranCodeByProd(prodNo, "003");
		return "redirect:/purchase/getPurchase?tranNo=" + tranNo;
	}

	// 거래 상태 변경
	@RequestMapping(value = "updateTranCodeByProd", method = RequestMethod.GET)
	public String updateTranCodeByProd(@RequestParam("prodNo") int prodNo, @RequestParam("tranCode") String tranCode)
			throws Exception {
		purchaseService.updateTranCodeByProd(prodNo, tranCode);
		return "redirect:/product/listManageProduct";
	}

}
