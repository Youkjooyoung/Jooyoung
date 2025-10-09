package com.model2.mvc.web.purchase;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.model2.mvc.common.Page;
import com.model2.mvc.common.Search;
import com.model2.mvc.service.domain.Purchase;
import com.model2.mvc.service.purchase.PurchaseService;

@RestController
@RequestMapping("/api/purchases")
public class PurchaseRestController {

	private final PurchaseService purchaseService;

	public PurchaseRestController(PurchaseService purchaseService) {
		this.purchaseService = purchaseService;
	}

	// 구매등록
	@PostMapping("json/add")
	@ResponseStatus(HttpStatus.CREATED)
	@ResponseBody
	public Purchase addPurchaseJson(@RequestBody Purchase purchase) throws Exception {
	    if (purchase.getQty() <= 0)
	        purchase.setQty(1);
	    purchaseService.addPurchase(purchase);

	    System.out.println("✅ [JSON등록] TranNo=" + purchase.getTranNo());
	    return purchase;
	}

	// 상세보기
	@GetMapping("/{tranNo}")
	public Purchase getPurchase(@PathVariable int tranNo) throws Exception {
		return purchaseService.getPurchase(tranNo);
	}

	// 구매내역조회(사용자)
	@GetMapping
	public Map<String, Object> getPurchaseList(Search search, @RequestParam String buyerId,
			@RequestParam(defaultValue = "10") int pageUnit) throws Exception {
		if (search.getCurrentPage() <= 0)
			search.setCurrentPage(1);
		if (search.getPageSize() <= 0)
			search.setPageSize(10);
		Map<String, Object> map = purchaseService.getPurchaseList(search, buyerId);
		int total = (int) map.getOrDefault("totalCount", 0);
		map.put("page", new Page(search.getCurrentPage(), total, pageUnit, search.getPageSize()));
		return map;
	}

	// 판매내역조회(관리자)
	@GetMapping("/sales")
	public Map<String, Object> getSaleList(Search search, @RequestParam(defaultValue = "10") int pageUnit)
			throws Exception {
		if (search.getCurrentPage() == 0)
			search.setCurrentPage(1);
		if (search.getPageSize() == 0)
			search.setPageSize(10);

		Map<String, Object> result = purchaseService.getSaleList(search);
		int totalCount = (int) result.getOrDefault("totalCount", 0);
		result.put("resultPage", new Page(search.getCurrentPage(), totalCount, pageUnit, search.getPageSize()));
		return result;
	}

	// 구매정보수정
	@PutMapping("/{tranNo}")
	public Purchase updatePurchase(@PathVariable int tranNo, @RequestBody Purchase purchase) throws Exception {
		purchase.setTranNo(tranNo);
		purchaseService.updatePurchase(purchase);
		return purchase;
	}

	// 거래상태코드변경(거래번호)
	@PatchMapping("/{tranNo}/tranCode")
	public Map<String, Object> updateTranCode(@PathVariable int tranNo, @RequestParam String tranCode)
			throws Exception {
		purchaseService.updateTranCode(tranNo, tranCode);
		Map<String, Object> body = new HashMap<>();
		body.put("tranNo", tranNo);
		body.put("tranCode", tranCode);
		body.put("result", "success");
		return body;
	}

	// 거래상태코드변경(상품번호)
	@PatchMapping("/products/{prodNo}/tranCode")
	public Map<String, Object> updateTranCodeByProd(@PathVariable int prodNo, @RequestParam String tranCode)
			throws Exception {
		purchaseService.updateTranCodeByProd(prodNo, tranCode);
		Map<String, Object> body = new HashMap<>();
		body.put("prodNo", prodNo);
		body.put("tranCode", tranCode);
		body.put("result", "success");
		return body;
	}

	// 최신거래상태조회(상품번호)
	@GetMapping("/products/{prodNo}/latestTranCode")
	public Map<String, Object> getLatestTranCodeByProd(@PathVariable int prodNo) throws Exception {
		String code = purchaseService.getLatestTranCodeByProd(prodNo);
		Map<String, Object> body = new HashMap<>();
		body.put("prodNo", prodNo);
		body.put("tranCode", code);
		return body;
	}

	// 최신거래상태조회(여러상품)
	@PostMapping("/products/latestTranCodes")
	public Map<Integer, String> getLatestTranCodeByProdNos(@RequestBody List<Integer> prodNos) throws Exception {
		if (CollectionUtils.isEmpty(prodNos)) {
			throw new IllegalArgumentException("prodNos가 비어 있습니다.");
		}
		return purchaseService.getLatestTranCodeByProdNos(prodNos);
	}

	// 잘못된 요청 에러
	@ExceptionHandler(IllegalArgumentException.class)
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	public Map<String, Object> handleBadRequest(IllegalArgumentException e) {
		Map<String, Object> err = new HashMap<>();
		err.put("result", "fail");
		err.put("message", e.getMessage());
		return err;
	}

	// 서버 에러
	@ExceptionHandler(Exception.class)
	@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
	public Map<String, Object> handleServerError(Exception e) {
		Map<String, Object> err = new HashMap<>();
		err.put("result", "error");
		err.put("message", "서버 오류가 발생했습니다.");
		return err;
	}
}
