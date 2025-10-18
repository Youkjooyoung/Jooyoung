package com.model2.mvc.web.purchase;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.model2.mvc.common.Search;
import com.model2.mvc.service.domain.Purchase;
import com.model2.mvc.service.domain.User;
import com.model2.mvc.service.purchase.PurchaseService;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/purchase/*")
public class PurchaseRestController {

	@Autowired
	@Qualifier("purchaseServiceImpl")
	private PurchaseService purchaseService;

	public PurchaseRestController() {
		System.out.println("==> PurchaseRestController 실행됨 : " + this.getClass());
	}

	/** 구매 등록 (세션의 로그인 사용자 자동세팅) */
	@PostMapping("json/addPurchase")
	public boolean addPurchase(@RequestBody Purchase purchase, HttpSession session) throws Exception {
		System.out.println("/purchase/json/addPurchase : POST 호출됨");

		User login = (User) session.getAttribute("user");
		if (login != null && purchase.getBuyer() == null) {
			purchase.setBuyer(login);
		}
		if (purchase.getQty() <= 0)
			purchase.setQty(1);
		if (purchase.getTranCode() == null)
			purchase.setTranCode("001");

		purchaseService.addPurchase(purchase);
		return true;
	}

	/** 구매 상세 */
	@GetMapping("json/getPurchase/{tranNo}")
	public Purchase getPurchase(@PathVariable int tranNo) throws Exception {
		System.out.println("/purchase/json/getPurchase : GET 호출됨");
		return purchaseService.getPurchase(tranNo);
	}

	/** 구매 목록(사용자 기준) */
	@PostMapping("json/getPurchaseList")
	public Map<String, Object> getPurchaseList(@RequestBody Search search, @RequestParam String buyerId)
			throws Exception {
		System.out.println("/purchase/json/getPurchaseList : POST 호출됨");
		if (search.getCurrentPage() == 0)
			search.setCurrentPage(1);
		if (search.getPageSize() == 0)
			search.setPageSize(10);
		return purchaseService.getPurchaseList(search, buyerId);
	}

	/** 판매 목록(관리자 기준) */
	@PostMapping("json/getSaleList")
	public Map<String, Object> getSaleList(@RequestBody Search search) throws Exception {
		System.out.println("/purchase/json/getSaleList : POST 호출됨");
		if (search.getCurrentPage() == 0)
			search.setCurrentPage(1);
		if (search.getPageSize() == 0)
			search.setPageSize(10);
		return purchaseService.getSaleList(search);
	}

	/** 구매 정보 수정 */
	@PostMapping("json/updatePurchase")
	public boolean updatePurchase(@RequestBody Purchase purchase) throws Exception {
		System.out.println("/purchase/json/updatePurchase : POST 호출됨");
		purchaseService.updatePurchase(purchase);
		return true;
	}

	/** 거래상태 코드 변경(거래번호 단건) */
	@PostMapping("json/updateTranCode")
	public Map<String, Object> updateTranCode(@RequestParam int tranNo, @RequestParam String tranCode)
			throws Exception {
		System.out.println("/purchase/json/updateTranCode : POST 호출됨");
		purchaseService.updateTranCode(tranNo, tranCode);
		Map<String, Object> res = new HashMap<>();
		res.put("success", true);
		res.put("tranNo", tranNo);
		res.put("tranCode", tranCode);
		return res;
	}

	/** 거래상태 코드 변경(상품번호 일괄) */
	@PostMapping("json/updateTranCodeByProd")
	public Map<String, Object> updateTranCodeByProd(@RequestParam int prodNo, @RequestParam String tranCode)
			throws Exception {
		System.out.println("/purchase/json/updateTranCodeByProd : POST 호출됨");
		purchaseService.updateTranCodeByProd(prodNo, tranCode);
		Map<String, Object> res = new HashMap<>();
		res.put("success", true);
		res.put("prodNo", prodNo);
		res.put("tranCode", tranCode);
		return res;
	}

	/** 최신 거래상태(단일 상품) */
	@GetMapping("json/getLatestTranCodeByProd/{prodNo}")
	public Map<String, Object> getLatestTranCodeByProd(@PathVariable int prodNo) throws Exception {
		System.out.println("/purchase/json/getLatestTranCodeByProd : GET 호출됨");
		String code = purchaseService.getLatestTranCodeByProd(prodNo);
		Map<String, Object> res = new HashMap<>();
		res.put("prodNo", prodNo);
		res.put("tranCode", code);
		return res;
	}

	/** 최신 거래상태(여러 상품) */
	@PostMapping("json/getLatestTranCodeByProdNos")
	public Map<Integer, String> getLatestTranCodeByProdNos(@RequestBody List<Integer> prodNos) throws Exception {
		System.out.println("/purchase/json/getLatestTranCodeByProdNos : POST 호출됨");
		return purchaseService.getLatestTranCodeByProdNos(prodNos);
	}
}
