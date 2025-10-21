package com.model2.mvc.service.cart;

import java.util.List;

import com.model2.mvc.service.domain.Cart;

public interface CartService {
	int addCart(Cart cart) throws Exception;

	int updateQty(Cart cart) throws Exception;

	int deleteCart(int cartId) throws Exception;

	List<Cart> getCartList(String userId) throws Exception;
}
