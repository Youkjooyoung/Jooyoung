package com.dd.product.vo;

import java.util.List;

import org.springframework.stereotype.Component;

@Component("cartorderlistVO")
public class CartOrderListVO {

	private List<OrderFinishVO> cartorderlistVO;

	public List<OrderFinishVO> getCartorderlistVO() {
		return cartorderlistVO;
	}

	public void setCartorderlistVO(List<OrderFinishVO> cartorderlistVO) {
		this.cartorderlistVO = cartorderlistVO;
	}
}
