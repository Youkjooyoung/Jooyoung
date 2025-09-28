package com.model2.mvc.service.purchase;

import java.util.List;
import java.util.Map;

import com.model2.mvc.common.Search;
import com.model2.mvc.service.domain.Purchase;

public interface PurchaseDao {

	// 구매 등록
	void addPurchase(Purchase purchase) throws Exception;

	// 구매 조회
	Purchase getPurchase(int tranNo) throws Exception;

	// 구매 내역 목록 조회 (구매자 시점) - buyerId
	List<Purchase> getPurchaseList(Map<String, Object> param) throws Exception;

	// 구매 내역 전체 건수 조회 - 페이징 처리를 위해 구매자의 총 구매 수 COUNT
	int getTotalCountPurchase(Map<String, Object> param) throws Exception;

	// 판매 내역 목록 조회 (관리자 시점)
	List<Purchase> getSaleList(Search search) throws Exception;

	// 판매 내역 전체 건수 조회 - 관리자 화면 페이징을 위해 전체 판매 건수 COUNT
	int getTotalCountSale(Search search) throws Exception;

	// 구매 정보 수정
	int updatePurchase(Purchase purchase) throws Exception;

	// 거래 상태코드 변경
	void updateTranCode(Map<String, Object> param) throws Exception;

	// 거래 상태코드 변경 (상품번호 기준) - 특정 상품(prodNo)에 걸린 최신 거래 상태를 일괄 UPDATE - 관리자 판매목록
	// 화면에서사용
	void updateTranCodeByProd(Map<String, Object> param) throws Exception;

	// 단일 상품의 최신 거래 상태 조회 - 특정 상품(prodNo)의 가장 최근 거래 상태 코드 반환
	String getLatestTranCodeByProd(int prodNo) throws Exception;

	// 여러 상품의 최신 거래 상태 조회 - 리스트 화면에서 상품별 상태 표시 용도
	List<Map<String, Object>> getLatestTranCodeByProdNos(List<Integer> prodNos) throws Exception;

	// 여러 상품 번호(prodNos)에 대해 "가장 최근 구매정보"를 조회하여
	Map<Integer, Map<String, Object>> getLatestPurchaseInfoByProdNos(List<Integer> prodNos) throws Exception;

	// 특정 상품(prodNo)의 구매 이력 전체를 조회
	List<Purchase> getPurchaseHistoryByProduct(int prodNo) throws Exception;

	// 여러 상품 번호(prodNos)에 대해 "가장 최근 거래상태코드
	List<Map<String, Object>> getLatestActiveTranCodeByProdNos(List<Integer> prodNos) throws Exception;

}
