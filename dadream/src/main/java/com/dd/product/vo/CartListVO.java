package com.dd.product.vo;

import java.util.List;

import org.springframework.stereotype.Component;

@Component("cartListVO")
public class CartListVO {
	private List<OrderVO> cartListVO;

	public CartListVO() {
	}

	public List<OrderVO> getCartListVO() {
		return cartListVO;
	}

	public void setCartListVO(List<OrderVO> cartListVO) {
		this.cartListVO = cartListVO;
	}
}
