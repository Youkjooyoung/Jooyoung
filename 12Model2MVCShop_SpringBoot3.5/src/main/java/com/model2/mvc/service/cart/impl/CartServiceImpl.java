package com.model2.mvc.service.cart.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.model2.mvc.service.cart.CartDao;
import com.model2.mvc.service.cart.CartService;
import com.model2.mvc.service.domain.Cart;

@Service("cartServiceImpl")
@Transactional
public class CartServiceImpl implements CartService {

	@Autowired
	private CartDao cartDao;

	@Override
	public int addCart(Cart cart) throws Exception {
		int r = cartDao.addCart(cart);
		return r;
	}

	@Override
	public int updateQty(Cart cart) throws Exception {
		int r = cartDao.updateQty(cart);
		return r;
	}

	@Override
	public int deleteCart(int cartId) throws Exception {
		int r = cartDao.deleteCart(cartId);
		return r;
	}

	@Override
	@Transactional(readOnly = true)
	public List<Cart> getCartList(String userId) throws Exception {
		List<Cart> list = cartDao.getCartList(userId);

		return list;
	}
}
