package com.model2.mvc.web.cart;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.model2.mvc.service.cart.CartService;
import com.model2.mvc.service.domain.Cart;
import com.model2.mvc.service.domain.User;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/cart/*")
public class CartRestController {

	@Autowired
	@Qualifier("cartServiceImpl")
	private CartService cartService;

	public CartRestController() {
		System.out.println("==> CartRestController 실행됨 : " + this.getClass());
	}

	/**
	 * 장바구니 상품 추가
	 * 
	 * @param cart    장바구니 정보(JSON)
	 * @param session 현재 로그인 사용자 세션
	 * @return 성공 여부
	 */
	@PostMapping("json/addCart")
	public boolean addCart(@RequestBody Cart cart, HttpSession session) throws Exception {
		System.out.println("/cart/json/addCart : POST 호출됨");

		User u = (User) session.getAttribute("user");
		if (u != null) {
			cart.setUserId(u.getUserId());
		}

		cartService.addCart(cart);
		return true;
	}

	/**
	 * 장바구니 목록 조회
	 * 
	 * @param session 로그인된 사용자 세션
	 * @return 해당 사용자의 장바구니 목록
	 */
	@GetMapping("json/getCartList")
	public List<Cart> getCartList(HttpSession session) throws Exception {
		System.out.println("/cart/json/getCartList : GET 호출됨");

		User u = (User) session.getAttribute("user");
		if (u == null) {
			return java.util.Collections.emptyList();
		}
		return cartService.getCartList(u.getUserId());
	}

	/**
	 * 장바구니 수량 수정
	 * 
	 * @param cart 수정할 장바구니 정보
	 * @return 성공 여부
	 */
	@PostMapping("json/updateCart")
	public boolean updateCart(@RequestBody Cart cart) throws Exception {
		System.out.println("/cart/json/updateCart : POST 호출됨");

		cartService.updateQty(cart);
		return true;
	}

	/**
	 * 장바구니 항목 삭제
	 * 
	 * @param cartId 삭제할 장바구니 ID
	 * @return 삭제 결과 Map(success=true)
	 */
	@PostMapping("json/deleteCart")
	public Map<String, Object> deleteCart(@RequestParam int cartId) throws Exception {
		System.out.println("/cart/json/deleteCart : POST 호출됨");

		cartService.deleteCart(cartId);
		Map<String, Object> res = new HashMap<>();
		res.put("success", true);
		res.put("cartId", cartId);
		return res;
	}
}
