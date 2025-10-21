package com.model2.mvc.web.cart;

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
@RequestMapping("/cart/json")
public class CartRestController {

	@Autowired
	@Qualifier("cartServiceImpl")
	private CartService cartService;

	public CartRestController() {
		System.out.println("==> CartRestController : " + this.getClass());
	}

	@PostMapping("addCart")
	public boolean addCart(@RequestBody Cart cart, HttpSession session) throws Exception {
		User u = (User) session.getAttribute("user");
		if (u == null)
			return false;
		cart.setUserId(u.getUserId());
		int r = cartService.addCart(cart);
		System.out.println("addCart=" + r);
		return r > 0;
	}

	@GetMapping("getCartList")
	public List<Cart> getCartList(HttpSession session) throws Exception {
		User u = (User) session.getAttribute("user");
		if (u == null)
			return java.util.Collections.emptyList();
		return cartService.getCartList(u.getUserId());
	}

	@PostMapping("updateCart")
	public boolean updateCart(@RequestBody Cart cart) throws Exception {
		int r = cartService.updateQty(cart);
		System.out.println("updateQty=" + r);
		return r > 0;
	}

	@PostMapping("deleteCart")
	public Map<String, Object> deleteCart(@RequestParam int cartId) throws Exception {
		int r = cartService.deleteCart(cartId);
		System.out.println("deleteCart=" + r);
		return Map.of("success", r > 0, "cartId", cartId);
	}
}
