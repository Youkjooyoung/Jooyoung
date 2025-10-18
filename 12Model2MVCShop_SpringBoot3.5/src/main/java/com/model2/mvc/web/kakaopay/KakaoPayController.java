package com.model2.mvc.web.kakaopay;

import java.net.URLDecoder;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.model2.mvc.service.domain.Product;
import com.model2.mvc.service.domain.Purchase;
import com.model2.mvc.service.domain.User;
import com.model2.mvc.service.kakaopay.KakaoPayService;
import com.model2.mvc.service.kakaopay.impl.KakaoPayServiceImpl;
import com.model2.mvc.service.purchase.PurchaseService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@Controller
public class KakaoPayController {

	@Autowired
	private KakaoPayService kakaoPayService;

	@Autowired
	@Qualifier("purchaseServiceImpl")
	private PurchaseService purchaseService;

	// 테스트 페이지
	@GetMapping("/purchase/purchaseKakaoTest")
	public String purchaseKakaoTestPage() {
		return "/purchase/purchaseKakaoTest";
	}

	// [Ready] 결제 준비 : 결제 정보 + 배송/연락처까지 캐시에 저장
	@PostMapping(value = "/purchase/kakao/ready", produces = "application/json; charset=UTF-8")
	@ResponseBody
	public Map<String, Object> readyKakaoPay(@RequestParam String itemName, @RequestParam int totalAmount,
			@RequestParam int quantity, @RequestParam int prodNo, HttpServletRequest request, HttpSession session)
			throws Exception {

		User user = (User) session.getAttribute("user");
		if (user == null) {
			throw new IllegalStateException("로그인이 필요합니다.");
		}

		String origin = ServletUriComponentsBuilder.fromCurrentContextPath().build().toUriString();
		String rid = UUID.randomUUID().toString();

		Map<String, Object> param = new HashMap<>();
		param.put("itemName", itemName);
		param.put("totalAmount", totalAmount);
		param.put("quantity", quantity);
		param.put("userId", user.getUserId());
		param.put("prodNo", prodNo);
		param.put("rid", rid);

		// ✅ 배송/연락처도 함께 저장(성공 콜백에서 Purchase 세팅에 사용)
		param.put("receiverName", request.getParameter("receiverName"));
		param.put("receiverPhone", request.getParameter("receiverPhone")); // 하이픈은 성공 콜백에서 제거
		param.put("zipcode", request.getParameter("zipcode"));
		param.put("divyAddr", request.getParameter("divyAddr"));
		param.put("addrDetail", request.getParameter("addrDetail"));
		param.put("divyDate", request.getParameter("divyDate"));
		param.put("divyRequest", request.getParameter("divyRequest"));

		// 콜백 URL
		param.put("approvalUrl", origin + "/purchase/kakao/success?rid=" + rid);
		param.put("cancelUrl", origin + "/purchase/kakao/cancel?rid=" + rid);
		param.put("failUrl", origin + "/purchase/kakao/fail?rid=" + rid);

		Map<String, Object> res = kakaoPayService.readyPayment(param);

		// 카카오가 success에 tid를 쿼리스트링으로 주지 않는 경우 대비
		session.setAttribute("kakao_tid", res.get("tid"));
		KakaoPayServiceImpl.bindRidToTid(rid, (String) res.get("tid"));

		return res;
	}

	// [Success] 승인 + DB 저장
	@GetMapping("/purchase/kakao/success")
	public ModelAndView kakaoPaySuccess(@RequestParam("pg_token") String pgToken,
			@RequestParam(value = "tid", required = false) String tid,
			@RequestParam(value = "rid", required = false) String rid, HttpSession session, HttpServletRequest req,
			HttpServletResponse resp) throws Exception {

		System.out.println("[KAKAO SUCCESS] in, rid=" + rid + ", tid(qs)=" + tid);

		// 1️⃣ TID 복구 (기존 로직 동일)
		if (tid == null && rid != null) {
			tid = KakaoPayServiceImpl.resolveTidByRid(rid);
		}
		if (tid == null) {
			Object sTid = session.getAttribute("kakao_tid");
			if (sTid != null)
				tid = String.valueOf(sTid);
		}
		if (tid == null && req.getCookies() != null) {
			for (Cookie c : req.getCookies()) {
				if ("kp_tid".equals(c.getName())) {
					tid = URLDecoder.decode(c.getValue(), "UTF-8");
					break;
				}
			}
		}

		// 2️⃣ 캐시 복원
		Map<String, Object> cached = KakaoPayServiceImpl.getCachedPayInfo(tid);
		if (cached == null && rid != null)
			cached = KakaoPayServiceImpl.getCachedByRid(rid);

		User user = (User) session.getAttribute("user");
		if (cached == null && user == null) {
			ModelAndView err = new ModelAndView("/purchase/kakaoFail.jsp");
			err.addObject("message", "승인정보 복구 실패 (세션/캐시 만료)");
			return err;
		}

		// 3️⃣ 결제 승인 요청
		Map<String, Object> param = new HashMap<>();
		param.put("tid", tid);
		param.put("userId", (cached != null) ? cached.get("userId") : (user != null ? user.getUserId() : null));
		param.put("pg_token", pgToken);
		Map<String, Object> approve = kakaoPayService.approvePayment(param);
		System.out.println("[KAKAO APPROVE] " + approve);

		// 4️⃣ DB 저장 (기존 동일)
		Purchase purchase = new Purchase();
		if (user != null) {
			purchase.setBuyer(user);
		} else {
			User u = new User();
			u.setUserId(String.valueOf(param.get("userId")));
			purchase.setBuyer(u);
		}

		Product p = new Product();
		p.setProdNo(Integer.parseInt(String.valueOf(cached.get("prodNo"))));
		purchase.setPurchaseProd(p);
		purchase.setQty(Integer.parseInt(String.valueOf(cached.get("quantity"))));
		purchase.setPaymentOption("KAKAO");
		purchase.setTranCode("001");

		int total = 0;
		Object amount = approve.get("amount");
		if (amount instanceof Map && ((Map<?, ?>) amount).get("total") != null) {
			total = ((Number) ((Map<?, ?>) amount).get("total")).intValue();
		} else {
			total = Integer.parseInt(String.valueOf(cached.get("totalAmount")));
		}
		purchase.setPaymentAmount(total);

		purchase.setReceiverName(trimOrNull((String) cached.get("receiverName")));
		String phone = (String) cached.get("receiverPhone");
		if (phone != null)
			phone = phone.replaceAll("\\D", "");
		purchase.setReceiverPhone(trimOrNull(phone));
		purchase.setZipcode(trimOrNull((String) cached.get("zipcode")));
		purchase.setDivyAddr(trimOrNull((String) cached.get("divyAddr")));
		purchase.setAddrDetail(trimOrNull((String) cached.get("addrDetail")));
		purchase.setDivyDate(trimOrNull((String) cached.get("divyDate")));
		purchase.setDivyRequest(trimOrNull((String) cached.get("divyRequest")));

		purchaseService.addPurchase(purchase);
		System.out.println("✅ DB 저장 완료 : tranNo=" + purchase.getTranNo());

		// 5️⃣ 캐시/쿠키 정리
		KakaoPayServiceImpl.removeCachedPayInfo(tid);
		KakaoPayServiceImpl.removeRid(rid);
		session.removeAttribute("kakao_tid");
		Cookie del = new Cookie("kp_tid", "");
		del.setMaxAge(0);
		del.setPath("/");
		resp.addCookie(del);

		// ✅ 바로 JSP로 이동 (redirect 아님!)
		ModelAndView mav = new ModelAndView("/purchase/kakaoSuccess.jsp");
		mav.addObject("info", approve);
		return mav;
	}

	private static String trimOrNull(String s) {
		if (s == null)
			return null;
		String t = s.trim();
		return t.isEmpty() ? null : t;
	}
}
