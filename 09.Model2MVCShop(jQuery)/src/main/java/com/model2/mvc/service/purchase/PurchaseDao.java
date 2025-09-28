package com.model2.mvc.service.purchase;

import java.util.List;
import java.util.Map;

import com.model2.mvc.common.Search;
import com.model2.mvc.service.domain.Purchase;

public interface PurchaseDao {

	/**
	 * 새로운 구매 등록 - 사용자가 상품을 구매할 때 Purchase 객체를 INSERT
	 */
	void addPurchase(Purchase purchase) throws Exception;

	/**
	 * 단일 구매 상세 조회 - tranNo(거래번호) 기준으로 Purchase 정보 1건 조회
	 */
	Purchase getPurchase(int tranNo) throws Exception;

	/**
	 * 구매 내역 목록 조회 (구매자 시점) - buyerId, 검색조건, 페이징 정보(Map)에 따라 해당 사용자의 구매 목록 SELECT
	 */
	List<Purchase> getPurchaseList(Map<String, Object> param) throws Exception;

	/**
	 * 구매 내역 전체 건수 조회 - 페이징 처리를 위해 구매자의 총 구매 수 COUNT
	 */
	int getTotalCountPurchase(Map<String, Object> param) throws Exception;

	/**
	 * 판매 내역 목록 조회 (관리자 시점) - 모든 구매 내역을 조회하여 판매 현황을 리스트로 반환
	 */
	List<Purchase> getSaleList(Search search) throws Exception;

	/**
	 * 판매 내역 전체 건수 조회 - 관리자 화면 페이징을 위해 전체 판매 건수 COUNT
	 */
	int getTotalCountSale(Search search) throws Exception;

	/**
	 * 구매 정보 수정 - 배송지, 수령인, 요청사항 등 구매 상세정보 UPDATE
	 */
	int updatePurchase(Purchase purchase) throws Exception;

	/**
	 * 거래 상태코드 변경 (거래번호 기준) - 주문완료 → 배송중 → 배송완료 → 취소 등 tranNo 단위로 상태 UPDATE
	 */
	void updateTranCode(Map<String, Object> param) throws Exception;

	/**
	 * 거래 상태코드 변경 (상품번호 기준) - 특정 상품(prodNo)에 걸린 최신 거래 상태를 일괄 UPDATE - 관리자 판매목록 화면에서
	 * 사용
	 */
	void updateTranCodeByProd(Map<String, Object> param) throws Exception;

	/**
	 * 단일 상품의 최신 거래 상태 조회 - 특정 상품(prodNo)의 가장 최근 거래 상태 코드 반환
	 */
	String getLatestTranCodeByProd(int prodNo) throws Exception;

	/**
	 * 여러 상품의 최신 거래 상태 조회 - 리스트 화면에서 상품별 상태 표시 용도 - Map<Integer, String> 대신
	 * List<Map> 구조로 결과 반환
	 */
	List<Map<String, Object>> getLatestTranCodeByProdNos(List<Integer> prodNos) throws Exception;

	Map<Integer, Map<String, Object>> getLatestPurchaseInfoByProdNos(List<Integer> prodNos) throws Exception;

	List<Purchase> getPurchaseHistoryByProduct(int prodNo) throws Exception;

	List<Map<String, Object>> getLatestActiveTranCodeByProdNos(List<Integer> prodNos) throws Exception;

}
