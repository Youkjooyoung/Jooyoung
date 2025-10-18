package com.model2.mvc.service.purchase.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import com.model2.mvc.common.Search;
import com.model2.mvc.service.domain.Purchase;
import com.model2.mvc.service.product.ProductDao;
import com.model2.mvc.service.purchase.PurchaseDao;
import com.model2.mvc.service.purchase.PurchaseService;

@Service("purchaseServiceImpl")
public class PurchaseServiceImpl implements PurchaseService {

	/// Field
	@Autowired
	@Qualifier("purchaseDaoImpl")
	private PurchaseDao purchaseDao;

	@Autowired
	@Qualifier("productDaoImpl")
	private ProductDao productDao;

	/// Constructor
	public PurchaseServiceImpl() {
		System.out.println(this.getClass());
	}

	// ======================================================
	// ✅ 구매 등록 (addPurchase)
	// ======================================================
	@org.springframework.transaction.annotation.Transactional(rollbackFor = Exception.class)
	public void addPurchase(Purchase purchase) throws Exception {
		int qty = purchase.getQty() <= 0 ? 1 : purchase.getQty();
		int prodNo = purchase.getPurchaseProd().getProdNo();

		int updated = productDao.decreaseStock(prodNo, qty);
		System.out.println("[addPurchase] prodNo=" + prodNo + ", qty=" + qty + ", decStockRows=" + updated);

		if (updated == 0) {
			throw new IllegalStateException("해당 수량만큼 재고가 부족합니다.");
		}

		purchaseDao.addPurchase(purchase);
		System.out.println("[addPurchase] tranNo=" + purchase.getTranNo() + " 저장완료");
	}

	// ======================================================
	// ✅ 구매 상세 조회 (getPurchase)
	// ======================================================
	public Purchase getPurchase(int tranNo) throws Exception {
		return purchaseDao.getPurchase(tranNo);
	}

	// ======================================================
	// ✅ 구매 정보 수정 (updatePurchase)
	// ======================================================
	public int updatePurchase(Purchase purchase) throws Exception {
		int rows = purchaseDao.updatePurchase(purchase);
		System.out.println("[updatePurchase] tranNo=" + purchase.getTranNo() + ", rows=" + rows);
		return rows;
	}

	// ======================================================
	// ✅ 구매 내역 조회 (사용자용)
	// ======================================================
	public Map<String, Object> getPurchaseList(Search search, String buyerId) throws Exception {
		Map<String, Object> param = new HashMap<>();
		param.put("search", search);
		param.put("buyerId", buyerId);

		List<Purchase> list = purchaseDao.getPurchaseList(param);
		int totalCount = purchaseDao.getTotalCountPurchase(param);

		Map<String, Object> map = new HashMap<>();
		map.put("list", list);
		map.put("totalCount", totalCount);
		return map;
	}

	// ======================================================
	// ✅ 판매 내역 조회 (관리자용)
	// ======================================================
	public Map<String, Object> getSaleList(Search search) throws Exception {
		List<Purchase> list = purchaseDao.getSaleList(search);
		int totalCount = purchaseDao.getTotalCountSale(search);

		Map<String, Object> map = new HashMap<>();
		map.put("list", list);
		map.put("totalCount", totalCount);
		return map;
	}

	// ======================================================
	// ✅ 거래 상태코드 변경 (tranNo 기준)
	// ======================================================
	@org.springframework.transaction.annotation.Transactional(rollbackFor = Exception.class)
	public void updateTranCode(int tranNo, String tranCode) throws Exception {
		Map<String, Object> param = new HashMap<>();
		param.put("tranNo", tranNo);
		param.put("tranCode", tranCode);
		purchaseDao.updateTranCode(param);

		System.out.println("[updateTranCode] tranNo=" + tranNo + ", tranCode=" + tranCode);

		// 거래 취소(005) 시 재고 복원
		if ("005".equals(tranCode)) {
			Purchase p = purchaseDao.getPurchase(tranNo);
			int prodNo = p.getPurchaseProd().getProdNo();
			int qty = p.getQty();
			int rows = productDao.increaseStock(prodNo, qty);
			System.out.println("[restoreStock] prodNo=" + prodNo + ", qty=" + qty + ", rows=" + rows);
		}
	}

	// ======================================================
	// ✅ 거래 상태코드 변경 (prodNo 기준)
	// ======================================================
	public void updateTranCodeByProd(int prodNo, String tranCode) throws Exception {
		Map<String, Object> param = new HashMap<>();
		param.put("prodNo", prodNo);
		param.put("tranCode", tranCode);
		purchaseDao.updateTranCodeByProd(param);

		System.out.println("[updateTranCodeByProd] prodNo=" + prodNo + ", tranCode=" + tranCode);
	}

	// ======================================================
	// ✅ 구매 취소 + 사유 등록
	// ======================================================
	public void cancelPurchaseWithReason(int tranNo, String reason) throws Exception {
		Map<String, Object> param = new HashMap<>();
		param.put("tranNo", tranNo);
		param.put("tranCode", "004");
		purchaseDao.updateTranCode(param);
		purchaseDao.updateCancelInfo(tranNo, reason);

		System.out.println("[cancelPurchaseWithReason] tranNo=" + tranNo + ", reason=" + reason);
	}

	// ======================================================
	// ✅ 최신 거래 상태코드 조회 (여러 상품)
	// ======================================================
	public Map<Integer, String> getLatestTranCodeByProdNos(List<Integer> prodNos) throws Exception {
		List<Map<String, Object>> list = purchaseDao.getLatestTranCodeByProdNos(prodNos);
		Map<Integer, String> result = new HashMap<>();

		if (list != null) {
			for (Map<String, Object> row : list) {
				Integer prodNo = ((Number) row.get("prodNo")).intValue();
				String tranCode = (String) row.get("tranCode");
				result.put(prodNo, tranCode);
			}
		}
		return result;
	}

	// ======================================================
	// ✅ 특정 상품의 구매 이력 조회
	// ======================================================
	public List<Purchase> getPurchaseHistoryByProduct(int prodNo) throws Exception {
		return purchaseDao.getPurchaseHistoryByProduct(prodNo);
	}

	// ======================================================
	// ✅ 최신 구매정보 조회 (여러 상품)
	// ======================================================
	public Map<Integer, Map<String, Object>> getLatestPurchaseInfoByProdNos(List<Integer> prodNos) throws Exception {
		return purchaseDao.getLatestPurchaseInfoByProdNos(prodNos);
	}

	// ======================================================
	// ✅ 최신 거래 상태코드 조회 (단일 상품)
	// ======================================================
	public String getLatestTranCodeByProd(int prodNo) throws Exception {
		return purchaseDao.getLatestTranCodeByProd(prodNo);
	}

	// ======================================================
	// ✅ 활성 거래 상태코드 조회 (여러 상품)
	// ======================================================
	public Map<Integer, String> getLatestActiveTranCodeByProdNos(List<Integer> prodNos) throws Exception {
		List<Map<String, Object>> list = purchaseDao.getLatestActiveTranCodeByProdNos(prodNos);
		Map<Integer, String> result = new HashMap<>();

		if (list != null) {
			for (Map<String, Object> row : list) {
				Integer prodNo = ((Number) row.get("prodNo")).intValue();
				String tranCode = (String) row.get("tranCode");
				result.put(prodNo, tranCode);
			}
		}

		System.out.println("[getLatestActiveTranCodeByProdNos] count=" + result.size());
		return result;
	}
	
}
