package com.model2.mvc.service.cart.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.model2.mvc.service.cart.CartDao;
import com.model2.mvc.service.cart.CartService;
import com.model2.mvc.service.domain.Cart;

@Service("cartServiceImpl")
public class CartServiceImpl implements CartService {

	@Autowired
	private CartDao cartDao;

	@Override
	public void addCart(Cart cart) throws Exception {
		cartDao.addCart(cart);
		System.out.println("[CartService] addCart : " + cart.getProdNo());
	}

	@Override
	public void updateQty(Cart cart) throws Exception {
		cartDao.updateQty(cart);
	}

	@Override
	public void deleteCart(int cartId) throws Exception {
		cartDao.deleteCart(cartId);
	}

	@Override
	public List<Cart> getCartList(String userId) throws Exception {
		return cartDao.getCartList(userId);
	}
}
