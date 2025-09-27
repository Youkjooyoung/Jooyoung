package com.model2.mvc.web.purchase;

import java.util.Map;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.SessionAttribute;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

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
	@Autowired
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

	// 구매 등록 화면
	@GetMapping("add")
	public ModelAndView showAddPurchaseForm(@RequestParam int prodNo) throws Exception {
		Product product = productService.getProduct(prodNo);
		ModelAndView mv = new ModelAndView("forward:/purchase/addPurchase.jsp");
		mv.addObject("p", product);
		return mv;
	}

	// 구매 등록 처리
	@PostMapping("add")
	public ModelAndView addPurchase(@ModelAttribute Purchase purchase,
			@SessionAttribute(name = "user", required = false) User sessionUser) throws Exception {
		if (sessionUser != null)
			purchase.setBuyer(sessionUser);
		if (purchase.getTranCode() == null)
			purchase.setTranCode("001"); // 주문완료
		purchaseService.addPurchase(purchase);

		Purchase saved = purchaseService.getPurchase(purchase.getTranNo());
		return new ModelAndView("forward:/purchase/getPurchase.jsp", "purchase", saved);
	}

	// 구매 상세
	@GetMapping("{tranNo}")
	public ModelAndView getPurchase(@PathVariable int tranNo) throws Exception {
		return new ModelAndView("forward:/purchase/getPurchase.jsp", "purchase", purchaseService.getPurchase(tranNo));
	}

	// 구매 수정 화면
	@GetMapping("{tranNo}/edit")
	public ModelAndView showUpdatePurchaseForm(@PathVariable int tranNo) throws Exception {
		return new ModelAndView("forward:/purchase/updatePurchaseView.jsp", "purchase",
				purchaseService.getPurchase(tranNo));
	}

	// 구매 수정 처리
	@PostMapping("update")
	public ModelAndView updatePurchase(@ModelAttribute Purchase purchase, RedirectAttributes redirectAttrs)
			throws Exception {

		Purchase origin = purchaseService.getPurchase(purchase.getTranNo());

		boolean changed = !(Objects.equals(origin.getPaymentOption(), purchase.getPaymentOption())
				&& Objects.equals(origin.getReceiverName(), purchase.getReceiverName())
				&& Objects.equals(origin.getReceiverPhone(), purchase.getReceiverPhone())
				&& Objects.equals(origin.getDivyAddr(), purchase.getDivyAddr())
				&& Objects.equals(origin.getDivyDate(), purchase.getDivyDate())
				&& Objects.equals(origin.getDivyRequest() == null ? "" : origin.getDivyRequest(),
						purchase.getDivyRequest() == null ? "" : purchase.getDivyRequest()));

		if (changed) {
			purchaseService.updatePurchase(purchase);
			redirectAttrs.addFlashAttribute("msg", "구매 정보가 수정되었습니다.");
		} else {
			redirectAttrs.addFlashAttribute("msg", "수정된 정보가 없습니다.");
		}

		return new ModelAndView("redirect:/purchase/" + purchase.getTranNo());
	}

	// 구매 취소
	@PostMapping("{tranNo}/cancel")
	public ModelAndView cancelPurchase(@PathVariable int tranNo) throws Exception {
		Purchase purchase = purchaseService.getPurchase(tranNo);
		if ("002".equals(purchase.getTranCode()) || "003".equals(purchase.getTranCode())) {
			ModelAndView err = new ModelAndView("forward:/common/error.jsp");
			err.addObject("errorMessage", "배송 중 또는 배송 완료된 주문은 취소할 수 없습니다.");
			return err;
		}
		purchaseService.updateTranCode(tranNo, "004");
		return new ModelAndView("redirect:/purchase/list");
	}

	// 구매 내역 리스트
	@GetMapping("list")
	public ModelAndView listPurchase(@ModelAttribute Search search,
			@SessionAttribute(name = "user", required = false) User user) throws Exception {
		if (user == null) {
			return new ModelAndView("redirect:/user/loginView.jsp");
		}

		if (search.getCurrentPage() == 0)
			search.setCurrentPage(1);
		if (search.getPageSize() == 0)
			search.setPageSize(pageSize);

		Map<String, Object> map = purchaseService.getPurchaseList(search, user.getUserId());
		Page resultPage = new Page(search.getCurrentPage(), (Integer) map.get("totalCount"), pageUnit,
				search.getPageSize());

		ModelAndView mv = new ModelAndView("forward:/purchase/listPurchase.jsp");
		mv.addObject("list", map.get("list"));
		mv.addObject("resultPage", resultPage);
		mv.addObject("search", search);
		return mv;
	}

	// 상태 변경 (공용)
	@PostMapping("{tranNo}/status")
	public ModelAndView updateTranCode(@PathVariable int tranNo, @RequestParam String tranCode) throws Exception {
		purchaseService.updateTranCode(tranNo, tranCode);
		return new ModelAndView("redirect:/purchase/" + tranNo);
	}

	// 구매자 수령 확인
	@PostMapping("{tranNo}/confirm")
	public ModelAndView confirmReceive(@PathVariable int tranNo) throws Exception {
		purchaseService.updateTranCode(tranNo, "003");
		return new ModelAndView("redirect:/purchase/" + tranNo);
	}

	// 관리자 상품별 상태 변경
	@PostMapping("product/{prodNo}/status")
	public ModelAndView updateTranCodeByProd(@PathVariable int prodNo, @RequestParam String tranCode) throws Exception {
		purchaseService.updateTranCodeByProd(prodNo, tranCode);
		return new ModelAndView("redirect:/product/listProduct?menu=manage");
	}

	// 관리자 주문취소확인 후 재판매
	@PostMapping("product/{prodNo}/ack-cancel")
	public ModelAndView acknowledgeCancel(@PathVariable int prodNo) throws Exception {
		purchaseService.updateTranCodeByProd(prodNo, "005");
		return new ModelAndView("redirect:/product/listProduct?menu=manage");
	}
}
