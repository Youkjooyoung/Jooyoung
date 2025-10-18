package com.model2.mvc.service.cart;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.model2.mvc.service.domain.Cart;

@Mapper
public interface CartDao {
	void addCart(Cart cart) throws Exception;

	void updateQty(Cart cart) throws Exception;

	void deleteCart(int cartId) throws Exception;

	Cart getCart(int cartId) throws Exception;

	List<Cart> getCartList(String userId) throws Exception;
}