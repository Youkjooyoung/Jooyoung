package com.model2.mvc.service.cart;

import java.util.List;

import com.model2.mvc.service.domain.Cart;

public interface CartService {
	void addCart(Cart cart) throws Exception;

	void updateQty(Cart cart) throws Exception;

	void deleteCart(int cartId) throws Exception;

	List<Cart> getCartList(String userId) throws Exception;
}
