package com.dd.product.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Repository;

import com.dd.dealing.vo.BoardVO;
import com.dd.dealing.vo.JjimVO;
import com.dd.product.vo.CartListVO;
import com.dd.product.vo.CartOrderListVO;
import com.dd.product.vo.CartVO;
import com.dd.product.vo.OrderFinishVO;
import com.dd.product.vo.OrderVO;
import com.dd.product.vo.ProductVO;
import com.dd.product.vo.ReviewReplyVO;
import com.dd.product.vo.ReviewVO;

@Mapper
@Repository("productDAO")
public interface ProductDAO {
//	메뉴 정보 보기
	public List<ProductVO> productView() throws Exception;

//	메뉴 인테리어 게시판 보기
	public List<BoardVO> inteView() throws Exception;

//	상품등록
	public int insertProduct(Map<String, Object> productMap) throws DataAccessException;

//	상품 패치
	public void proPatch(Map<String, Object> proModMap) throws DataAccessException;

	// 상품목록
	public List<ProductVO> selectAllProductsList(String product_Name) throws DataAccessException;

//	상품번호로 상품찾기
	public ProductVO productinfo(int product_Nums) throws Exception;

//	  상품번호 
	public int productnum(String product_Num) throws DataAccessException;

//	상품관리
	public List<ProductVO> proMyList(String user_Id) throws Exception;

//	상품 수정
	public ProductVO proMod(ProductVO map) throws Exception;

//	상품 삭제
	public int proDelete(int pro) throws DataAccessException;

//	상품 조회수 올리기
	public void viewCount(int product_Nums) throws Exception;

//	찜목록 불러오기
	public List<JjimVO> proDl(String user_Id) throws DataAccessException;

//	리뷰리스트
	public List<ReviewVO> reviewList(int product_Nums) throws Exception;

//	리뷰 댓글
	public void reviewReply(ReviewReplyVO reply) throws Exception;

//	리뷰 댓글 리스트
	public List<ReviewReplyVO> revReply() throws Exception;

//	리뷰 대댓글 작성
	public void daedatgle(ReviewReplyVO reply) throws Exception;

//	리뷰 최고 제일 높은 부모 
	public int parentMax() throws Exception;

	// 댓글 토탈리스트
//	댓글 토탈 리스트
	public List<ReviewReplyVO> totalReply() throws Exception;

//	리뷰등록
	public int reviewpost(Map<String, Object> body) throws DataAccessException;

//	장바구니
	public int cart(Map<String, Object> body) throws DataAccessException;

//	장바구니 리스트
	public List<CartVO> cartlist(String user_Id) throws DataAccessException;

//	장바구니 삭제 
	public int cartdelete(int body) throws DataAccessException;

//	데이터목록 삭제
	public void deletecartorder(String user_Id) throws DataAccessException;

//	장바구니 목록 구매 db 연동
	public void insertCartOrder(CartListVO cartlist) throws DataAccessException;

//	장바구니 결제 리스트
	public List<OrderVO> ordercartlist(String user_Id) throws DataAccessException;

//	장바구니 결제 db
	public void carteach(CartOrderListVO cartorderlistVO) throws DataAccessException;

//	product_TotalCount - 장바구니
	public void cocount(CartOrderListVO cartorderlistVO) throws DataAccessException;

//	product_TotalCount -
	public int ocount(Map<String, Object> body) throws DataAccessException;

//	결제창
	public int order(Map<String, Object> body) throws DataAccessException;

//	결제 db 연동
	public List<OrderVO> orderlist(String user_Id) throws DataAccessException;

//	결제 정보 받기
	public int orders(Map<String, Object> body) throws DataAccessException;

//	토스창
	public List<OrderFinishVO> orderfinishs(String user_Id) throws DataAccessException;

//	결제완료
	public void oft(Map<String, Object> oftm) throws DataAccessException;

//	판매내역
	public List<ProductVO> prolist(String user_Id) throws DataAccessException;

//	판매수정
	public void stateupdate(Map<String, Object> map) throws Exception;

//	판매환불
	public void statedelete(Map<String, Object> dmap) throws DataAccessException;

//	총 상품개수 +
	public void deletecount(Map<String, Object> cmap) throws DataAccessException;

//	환불이유
	public int refunds(Map<String, Object> body) throws DataAccessException;

//	구매내역 환붑내역
	public List<OrderFinishVO> myofv(String user_Id) throws DataAccessException;

	public List<OrderFinishVO> refund(String user_Id) throws DataAccessException;
}
