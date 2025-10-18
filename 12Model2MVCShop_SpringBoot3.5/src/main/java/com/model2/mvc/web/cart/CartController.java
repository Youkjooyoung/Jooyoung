package com.model2.mvc.web.cart;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.model2.mvc.service.cart.CartService;
import com.model2.mvc.service.domain.Cart;
import com.model2.mvc.service.domain.User;

import jakarta.servlet.http.HttpSession;

@Controller
@RequestMapping("/cart/*")
public class CartController {

	@Autowired
	@Qualifier("cartServiceImpl")
	private CartService cartService;

	public CartController() {
		System.out.println(this.getClass());
	}

	// 장바구니 목록(뷰)
	@RequestMapping(value = "listCart", method = { RequestMethod.GET, RequestMethod.POST })
	public String listCart(HttpSession session, Model model) throws Exception {
		System.out.println("/cart/listCart : GET / POST");

		User user = (User) session.getAttribute("user");
		if (user == null) {
			return "redirect:/user/loginView.jsp";
		}

		List<Cart> cartList = cartService.getCartList(user.getUserId());
		model.addAttribute("cartList", cartList);

		// JSP로 forward (JS/Ajax는 CartRestController 사용)
		return "forward:/purchase/cart.jsp";
	}
}
