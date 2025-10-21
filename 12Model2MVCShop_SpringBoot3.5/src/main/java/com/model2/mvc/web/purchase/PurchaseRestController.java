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
@RequestMapping("/purchase")
public class PurchaseRestController {

	@Autowired
	@Qualifier("purchaseServiceImpl")
	private PurchaseService purchaseService;

	public PurchaseRestController() {
		System.out.println("==> PurchaseRestController 실행됨 : " + this.getClass());
	}

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

	@GetMapping("json/getPurchase/{tranNo}")
	public Purchase getPurchase(@PathVariable int tranNo) throws Exception {
		System.out.println("/purchase/json/getPurchase : GET 호출됨");
		return purchaseService.getPurchase(tranNo);
	}

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

	@PostMapping("json/getSaleList")
	public Map<String, Object> getSaleList(@RequestBody Search search) throws Exception {
		System.out.println("/purchase/json/getSaleList : POST 호출됨");
		if (search.getCurrentPage() == 0)
			search.setCurrentPage(1);
		if (search.getPageSize() == 0)
			search.setPageSize(10);
		return purchaseService.getSaleList(search);
	}

	@PostMapping("json/updatePurchase")
	public boolean updatePurchase(@RequestBody Purchase purchase) throws Exception {
		System.out.println("/purchase/json/updatePurchase : POST 호출됨");
		purchaseService.updatePurchase(purchase);
		return true;
	}

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

	@GetMapping("json/getLatestTranCodeByProd/{prodNo}")
	public Map<String, Object> getLatestTranCodeByProd(@PathVariable int prodNo) throws Exception {
		System.out.println("/purchase/json/getLatestTranCodeByProd : GET 호출됨");
		String code = purchaseService.getLatestTranCodeByProd(prodNo);
		Map<String, Object> res = new HashMap<>();
		res.put("prodNo", prodNo);
		res.put("tranCode", code);
		return res;
	}

	@PostMapping("json/getLatestTranCodeByProdNos")
	public Map<Integer, String> getLatestTranCodeByProdNos(@RequestBody List<Integer> prodNos) throws Exception {
		System.out.println("/purchase/json/getLatestTranCodeByProdNos : POST 호출됨");
		return purchaseService.getLatestTranCodeByProdNos(prodNos);
	}

	@PostMapping("{tranNo}/confirm")
	public Map<String, Object> confirm(@PathVariable int tranNo) throws Exception {
		System.out.println("/purchase/{tranNo}/confirm : POST 호출됨");
		purchaseService.updateTranCode(tranNo, "003");
		Map<String, Object> res = new HashMap<>();
		res.put("updated", 1);
		res.put("tranNo", tranNo);
		return res;
	}
}
