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
	}

	@PostMapping("json/addPurchase")
	public boolean addPurchase(@RequestBody Purchase purchase, HttpSession session) throws Exception {
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
		return purchaseService.getPurchase(tranNo);
	}

	@PostMapping("json/getPurchaseList")
	public Map<String, Object> getPurchaseList(@RequestBody Search search, @RequestParam String buyerId)
			throws Exception {
		if (search.getCurrentPage() == 0)
			search.setCurrentPage(1);
		if (search.getPageSize() == 0)
			search.setPageSize(10);
		return purchaseService.getPurchaseList(search, buyerId);
	}

	@PostMapping("json/getSaleList")
	public Map<String, Object> getSaleList(@RequestBody Search search) throws Exception {
		if (search.getCurrentPage() == 0)
			search.setCurrentPage(1);
		if (search.getPageSize() == 0)
			search.setPageSize(10);
		return purchaseService.getSaleList(search);
	}

	@PostMapping("json/updatePurchase")
	public boolean updatePurchase(@RequestBody Purchase purchase) throws Exception {
		purchaseService.updatePurchase(purchase);
		return true;
	}

	@PostMapping("json/updateTranCode")
	public Map<String, Object> updateTranCode(@RequestParam int tranNo, @RequestParam String tranCode)
			throws Exception {
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
		purchaseService.updateTranCodeByProd(prodNo, tranCode);
		Map<String, Object> res = new HashMap<>();
		res.put("success", true);
		res.put("prodNo", prodNo);
		res.put("tranCode", tranCode);
		return res;
	}

	@GetMapping("json/getLatestTranCodeByProd/{prodNo}")
	public Map<String, Object> getLatestTranCodeByProd(@PathVariable int prodNo) throws Exception {
		String code = purchaseService.getLatestTranCodeByProd(prodNo);
		Map<String, Object> res = new HashMap<>();
		res.put("prodNo", prodNo);
		res.put("tranCode", code);
		return res;
	}

	@PostMapping("json/getLatestTranCodeByProdNos")
	public Map<Integer, String> getLatestTranCodeByProdNos(@RequestBody List<Integer> prodNos) throws Exception {
		return purchaseService.getLatestTranCodeByProdNos(prodNos);
	}

	@PostMapping("{tranNo}/confirm")
	public Map<String, Object> confirm(@PathVariable int tranNo) throws Exception {
		purchaseService.updateTranCode(tranNo, "003");
		Map<String, Object> res = new HashMap<>();
		res.put("updated", 1);
		res.put("tranNo", tranNo);
		return res;
	}
}
