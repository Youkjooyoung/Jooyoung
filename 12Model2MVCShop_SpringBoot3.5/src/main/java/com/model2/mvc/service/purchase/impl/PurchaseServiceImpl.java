package com.model2.mvc.service.purchase.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.model2.mvc.common.Search;
import com.model2.mvc.service.domain.Purchase;
import com.model2.mvc.service.product.ProductDao;
import com.model2.mvc.service.purchase.PurchaseDao;
import com.model2.mvc.service.purchase.PurchaseService;

@Service("purchaseServiceImpl")
public class PurchaseServiceImpl implements PurchaseService {

	private final PurchaseDao purchaseDao; // @Mapper 주입
	private final ProductDao productDao; // 재고 증감에 필요

	public PurchaseServiceImpl(PurchaseDao purchaseDao, ProductDao productDao) {
		this.purchaseDao = purchaseDao;
		this.productDao = productDao;
		System.out.println("==> PurchaseServiceImpl init : " + getClass());
	}

	// ===================== C =====================
	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addPurchase(Purchase purchase) throws Exception {
		int qty = purchase.getQty() <= 0 ? 1 : purchase.getQty();
		int prodNo = purchase.getPurchaseProd().getProdNo();

		int updated = productDao.decreaseStock(prodNo, qty);
		System.out
				.println("[PurchaseService] decreaseStock :: prodNo=" + prodNo + ", qty=" + qty + ", rows=" + updated);
		if (updated == 0) {
			throw new IllegalStateException("해당 수량만큼 재고가 부족합니다.");
		}

		purchaseDao.addPurchase(purchase);
		System.out.println("[PurchaseService] addPurchase :: tranNo=" + purchase.getTranNo());
	}

	// ===================== R =====================
	@Override
	public Purchase getPurchase(int tranNo) throws Exception {
		return purchaseDao.getPurchase(tranNo);
	}

	@Override
	public Map<String, Object> getPurchaseList(Search search, String buyerId) throws Exception {
		Map<String, Object> param = new HashMap<>();
		param.put("search", search);
		param.put("buyerId", buyerId);

		List<Purchase> list = purchaseDao.getPurchaseList(param);
		int totalCount = purchaseDao.getTotalCountPurchase(param);

		Map<String, Object> out = new HashMap<>();
		out.put("list", list);
		out.put("totalCount", totalCount);
		return out;
	}

	@Override
	public Map<String, Object> getSaleList(Search search) throws Exception {
		List<Purchase> list = purchaseDao.getSaleList(search);
		int totalCount = purchaseDao.getTotalCountSale(search);

		Map<String, Object> out = new HashMap<>();
		out.put("list", list);
		out.put("totalCount", totalCount);
		return out;
	}

	// ===================== U =====================
	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updatePurchase(Purchase purchase) throws Exception {
		int rows = purchaseDao.updatePurchase(purchase);
		System.out.println("[PurchaseService] updatePurchase :: tranNo=" + purchase.getTranNo() + ", rows=" + rows);
		return rows;
	}

	// ===================== 상태코드 =====================
	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateTranCode(int tranNo, String tranCode) throws Exception {
		Map<String, Object> param = new HashMap<>();
		param.put("tranNo", tranNo);
		param.put("tranCode", tranCode);
		purchaseDao.updateTranCode(param);
		System.out.println("[PurchaseService] updateTranCode :: tranNo=" + tranNo + ", tranCode=" + tranCode);

		// 취소확정(005) → 재고 복구
		if ("005".equals(tranCode)) {
			Purchase p = purchaseDao.getPurchase(tranNo);
			int prodNo = p.getPurchaseProd().getProdNo();
			int qty = p.getQty();
			int rows = productDao.increaseStock(prodNo, qty);
			System.out
					.println("[PurchaseService] restoreStock :: prodNo=" + prodNo + ", qty=" + qty + ", rows=" + rows);
		}
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateTranCodeByProd(int prodNo, String tranCode) throws Exception {
		Map<String, Object> param = new HashMap<>();
		param.put("prodNo", prodNo);
		param.put("tranCode", tranCode);
		purchaseDao.updateTranCodeByProd(param);
		System.out.println("[PurchaseService] updateTranCodeByProd :: prodNo=" + prodNo + ", tranCode=" + tranCode);
	}

	// ===================== 조회 유틸 =====================
	@Override
	public String getLatestTranCodeByProd(int prodNo) throws Exception {
		return purchaseDao.getLatestTranCodeByProd(prodNo);
	}

	@Override
	public Map<Integer, String> getLatestTranCodeByProdNos(List<Integer> prodNos) throws Exception {
		List<Map<String, Object>> list = purchaseDao.getLatestTranCodeByProdNos(prodNos);
		Map<Integer, String> out = new HashMap<>();
		if (list != null) {
			for (Map<String, Object> row : list) {
				Integer prodNo = ((Number) row.get("prodNo")).intValue();
				String code = (String) row.get("tranCode");
				out.put(prodNo, code);
			}
		}
		return out;
	}

	@Override
	public Map<Integer, Map<String, Object>> getLatestPurchaseInfoByProdNos(List<Integer> prodNos) throws Exception {
		return purchaseDao.getLatestPurchaseInfoByProdNos(prodNos);
	}

	@Override
	public List<Purchase> getPurchaseHistoryByProduct(int prodNo) throws Exception {
		return purchaseDao.getPurchaseHistoryByProduct(prodNo);
	}

	@Override
	public Map<Integer, String> getLatestActiveTranCodeByProdNos(List<Integer> prodNos) throws Exception {
		List<Map<String, Object>> list = purchaseDao.getLatestActiveTranCodeByProdNos(prodNos);
		Map<Integer, String> out = new HashMap<>();
		if (list != null) {
			for (Map<String, Object> row : list) {
				Integer prodNo = ((Number) row.get("prodNo")).intValue();
				String code = (String) row.get("tranCode");
				out.put(prodNo, code);
			}
		}
		System.out.println("[PurchaseService] activeTranCode count=" + out.size());
		return out;
	}

	// ===================== 취소(사유 기록) =====================
	@Override
	@Transactional(rollbackFor = Exception.class)
	public void cancelPurchaseWithReason(int tranNo, String reason) throws Exception {
		Map<String, Object> param = new HashMap<>();
		param.put("tranNo", tranNo);
		param.put("tranCode", "004"); // 취소요청
		purchaseDao.updateTranCode(param);
		purchaseDao.updateCancelInfo(tranNo, reason == null ? "" : reason.trim());
		System.out.println("[PurchaseService] cancelPurchaseWithReason :: tranNo=" + tranNo + ", reason=" + reason);
	}
}
