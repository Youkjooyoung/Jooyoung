package com.model2.mvc.web.cart;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.model2.mvc.service.cart.CartService;
import com.model2.mvc.service.domain.Cart;
import com.model2.mvc.service.domain.User;

import jakarta.servlet.http.HttpSession;

@Controller
@RequestMapping("/cart")
public class CartController {

	@Autowired
	@Qualifier("cartServiceImpl")
	private CartService cartService;

	public CartController() {
	}

	@GetMapping({ "", "/", "listCart" })
	public String listCart(@RequestParam(value = "embed", defaultValue = "false") boolean embed,
			@RequestHeader(value = "X-Requested-With", required = false) String xrw, HttpSession session, Model model)
			throws Exception {
		User user = (User) session.getAttribute("user");
		if (user == null)
			return "redirect:/user/loginView.jsp";

		List<Cart> cartList = cartService.getCartList(user.getUserId());
		model.addAttribute("cartList", cartList);

		boolean fragment = embed || "XMLHttpRequest".equalsIgnoreCase(xrw);
		if (fragment)
			return "forward:/purchase/cart.jsp";

		model.addAttribute("pageCss", "/css/cart.css");
		model.addAttribute("pageJs", "/javascript/cart.js");
		model.addAttribute("entry", "/cart?embed=1 .nv-panel:first");
		return "forward:/index.jsp";
	}

	@GetMapping("add")
	public String add(@RequestParam int prodNo, @RequestParam(defaultValue = "1") int qty, HttpSession session)
			throws Exception {
		User user = (User) session.getAttribute("user");
		if (user == null)
			return "redirect:/user/loginView.jsp";
		Cart c = new Cart();
		c.setUserId(user.getUserId());
		c.setProdNo(prodNo);
		c.setQty(qty <= 0 ? 1 : qty);
		int r = cartService.addCart(c);
		return "redirect:/cart";
	}
}
