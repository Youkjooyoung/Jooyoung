package com.model2.mvc.web.user;

import java.net.URLEncoder;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import com.model2.mvc.common.Page;
import com.model2.mvc.common.Search;
import com.model2.mvc.service.domain.User;
import com.model2.mvc.service.google.GoogleOAuthService;
import com.model2.mvc.service.kakao.KakaoOAuthService;
import com.model2.mvc.service.user.UserService;

import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@Controller
@RequestMapping("/user/*")
public class UserController {

	@PostConstruct
	public void checkGoogleProps() {
		System.out.println("==== [Google Props Check] ====");
		System.out.println("clientId  : " + googleClientId);
		System.out.println("redirect  : " + googleRedirectUri);
	}

	@Autowired
	@Qualifier("userServiceImpl")
	private UserService userService;

	@Autowired
	@Qualifier("googleOAuthService")
	private GoogleOAuthService googleOAuthService;

	@Value("#{commonProperties['google.clientId']}")
	private String googleClientId;

	@Value("#{commonProperties['google.redirectUri']}")
	private String googleRedirectUri;
	@Autowired
	@Qualifier("kakaoOAuthService")
	private KakaoOAuthService kakaoOAuthService;

	@Value("#{commonProperties['kakao.clientId']}")
	private String kakaoClientId;

	@Value("#{commonProperties['kakao.logoutRedirectUri']}")
	private String kakaoLogoutRedirectUri;

	@Value("#{commonProperties['pageUnit']}")
	private int pageUnit;

	@Value("#{commonProperties['pageSize']}")
	private int pageSize;

	public UserController() {
		System.out.println(this.getClass());
	}

	/** 회원가입 화면 */
	@RequestMapping(value = "addUser", method = RequestMethod.GET)
	public String addUser() throws Exception {
		return "redirect:/user/addUserView.jsp";
	}

	/** 회원 상세조회 화면 */
	@RequestMapping(value = "getUser", method = RequestMethod.GET)
	public String getUser(@RequestParam("userId") String userId, Model model) throws Exception {
		User user = userService.getUser(userId);
		model.addAttribute("user", user);
		return "forward:/user/getUser.jsp";
	}

	/** 회원 수정 화면 */
	@RequestMapping(value = "updateUser", method = RequestMethod.GET)
	public String updateUser(@RequestParam("userId") String userId, Model model) throws Exception {
		User user = userService.getUser(userId);
		model.addAttribute("user", user);
		return "forward:/user/updateUser.jsp";
	}

	/** 로그인 화면 */
	@RequestMapping(value = "login", method = RequestMethod.GET)
	public String login() throws Exception {
		return "redirect:/user/loginView.jsp";
	}

	/** 회원 리스트 화면 */
	@RequestMapping(value = "listUser")
	public String listUser(@ModelAttribute("search") Search search, Model model, HttpServletRequest request)
			throws Exception {
		if (search.getCurrentPage() == 0) {
			search.setCurrentPage(1);
		}
		search.setPageSize(pageSize);

		Map<String, Object> map = userService.getUserList(search);

		Page resultPage = new Page(search.getCurrentPage(), ((Integer) map.get("totalCount")).intValue(), pageUnit,
				pageSize);

		model.addAttribute("list", map.get("list"));
		model.addAttribute("resultPage", resultPage);
		model.addAttribute("search", search);

		return "forward:/user/listUser.jsp";
	}

	/** 로그아웃 (카카오만 API 호출, 구글은 세션 무효화만) */
	@RequestMapping(value = "logout", method = { RequestMethod.GET, RequestMethod.POST })
	public String logout(HttpSession session) throws Exception {
		String loginType = (String) session.getAttribute("loginType");
		session.invalidate();

		if ("kakao".equals(loginType)) {
			String kakaoLogoutUrl = "https://kauth.kakao.com/oauth/logout" + "?client_id=" + kakaoClientId
					+ "&logout_redirect_uri=" + URLEncoder.encode(kakaoLogoutRedirectUri, "UTF-8");

			return "redirect:" + kakaoLogoutUrl;
		}
		return "redirect:/index.jsp";
	}

	@GetMapping("kakao/callback")
	public ModelAndView kakaoCallback(@RequestParam("code") String code, HttpSession session) {

		ModelAndView mav = new ModelAndView();

		try {
			String accessToken = kakaoOAuthService.getAccessToken(code);
			User kakaoUser = kakaoOAuthService.getUserInfo(accessToken);

			User dbUser = userService.getUserByKakaoId(kakaoUser.getKakaoId());
			if (dbUser == null) {
				kakaoUser.setUserId("kakao_" + kakaoUser.getKakaoId());
				kakaoUser.setPassword("SOCIAL");
				kakaoUser.setRole("user");
				userService.addUser(kakaoUser);
				dbUser = kakaoUser;
			}

			session.setAttribute("user", dbUser);
			session.setAttribute("loginType", "kakao");
			session.setMaxInactiveInterval(60 * 60);

			boolean needOnboard = !userService.isProfileComplete(dbUser);
			if (needOnboard) {
				mav.setViewName("redirect:/user/onboardView.jsp");
			} else {
				mav.setViewName("redirect:/index.jsp");
			}

		} catch (Exception e) {
			e.printStackTrace();
			mav.setViewName("common/error.jsp");
			mav.addObject("exception", e);
			mav.addObject("message", e.getMessage());
		}

		return mav;
	}

	@GetMapping("google/callback")
	public String googleCallback(@RequestParam("code") String code, HttpSession session) {
		try {
			String accessToken = googleOAuthService.getAccessToken(code);
			User googleUser = googleOAuthService.getUserInfo(accessToken);

			User dbUser = userService.getUserByGoogleId(googleUser.getGoogleId());
			if (dbUser == null) {
				googleUser.setUserId("google_" + googleUser.getGoogleId());
				googleUser.setPassword("SOCIAL");
				googleUser.setRole("user");
				userService.addUser(googleUser);
				dbUser = googleUser;
			} else {
				boolean patch = false;
				if ((dbUser.getEmail() == null || dbUser.getEmail().isEmpty()) && googleUser.getEmail() != null) {
					dbUser.setEmail(googleUser.getEmail());
					patch = true;
				}
				if ((dbUser.getUserName() == null || dbUser.getUserName().isEmpty())
						&& googleUser.getUserName() != null) {
					dbUser.setUserName(googleUser.getUserName());
					patch = true;
				}
				if ((dbUser.getProfileImg() == null || dbUser.getProfileImg().isEmpty())
						&& googleUser.getProfileImg() != null) {
					dbUser.setProfileImg(googleUser.getProfileImg());
					patch = true;
				}
				if (patch)
					userService.updateUser(dbUser);
			}

			session.setAttribute("user", dbUser);
			session.setAttribute("loginType", "google");
			session.setMaxInactiveInterval(60 * 60);

			return !userService.isProfileComplete(dbUser) ? "redirect:/user/onboardView.jsp" : "redirect:/index.jsp";
		} catch (Exception e) {
			e.printStackTrace();
			return "redirect:/common/error.jsp";
		}
	}
}
