package com.model2.mvc.web.user;

import java.net.URLEncoder;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

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

import com.model2.mvc.common.Page;
import com.model2.mvc.common.Search;
import com.model2.mvc.service.domain.User;
import com.model2.mvc.service.google.GoogleOAuthService;
import com.model2.mvc.service.kakao.KakaoOAuthService;
import com.model2.mvc.service.kakao.KakaoService;
import com.model2.mvc.service.user.UserService;

@Controller
@RequestMapping("/user/*")
public class UserController {

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
	@Qualifier("kakaoService")
	private KakaoService kakaoService;

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
			String kakaoLogoutUrl = "https://kauth.kakao.com/oauth/logout" 
																	+ "?client_id=" + kakaoClientId
																	+ "&logout_redirect_uri=" 
																	+ URLEncoder.encode(kakaoLogoutRedirectUri, "UTF-8");
			
			return "redirect:" + kakaoLogoutUrl;
		}
		return "redirect:/index.jsp";
	}

	/** 카카오 로그인 콜백 */
	@GetMapping("/kakao/callback")
	public String kakaoCallback(@RequestParam("code") String code, HttpSession session) throws Exception {
		String accessToken = kakaoOAuthService.getAccessToken(code);
		User kakaoUser = kakaoOAuthService.getUserInfo(accessToken);

		User dbUser = userService.getUserByKakaoId(kakaoUser.getKakaoId());
		if (dbUser == null) {
			String genId = "kakao_" + kakaoUser.getKakaoId();
			kakaoUser.setUserId(genId);
			kakaoUser.setPassword("SOCIAL");
			kakaoUser.setRole("user");
			userService.addUser(kakaoUser);
			dbUser = kakaoUser;
		} else {
			boolean patch = false;
			if ((dbUser.getEmail() == null || dbUser.getEmail().isEmpty()) && kakaoUser.getEmail() != null) {
				dbUser.setEmail(kakaoUser.getEmail());
				patch = true;
			}
			if ((dbUser.getUserName() == null || dbUser.getUserName().isEmpty()) && kakaoUser.getUserName() != null) {
				dbUser.setUserName(kakaoUser.getUserName());
				patch = true;
			}
			if ((dbUser.getProfileImg() == null || dbUser.getProfileImg().isEmpty())
					&& kakaoUser.getProfileImg() != null) {
				dbUser.setProfileImg(kakaoUser.getProfileImg());
				patch = true;
			}
			if (patch)
				userService.updateUser(dbUser);
		}

		String displayId = (dbUser.getEmail() != null && !dbUser.getEmail().isEmpty()) ? dbUser.getEmail()
				: (dbUser.getUserName() != null && !dbUser.getUserName().isEmpty()) ? dbUser.getUserName()
						: dbUser.getKakaoId();

		session.setAttribute("user", dbUser);
		session.setAttribute("loginType", "kakao");
		session.setAttribute("kakaoAccessToken", accessToken);
		session.setAttribute("displayId", displayId);
		session.setMaxInactiveInterval(60 * 60);

		if (!userService.isProfileComplete(dbUser)) {
			return "redirect:/user/onboardView.jsp";
		}
		return "redirect:/index.jsp";
	}

	/** 구글 로그인 버튼 */
	@GetMapping("/google/login")
	public String googleLogin() {
		String url = "https://accounts.google.com/o/oauth2/v2/auth" 
									+ "?client_id=" + googleClientId + "&redirect_uri="
									+ googleRedirectUri 
									+ "&response_type=code" 
									+ "&scope=openid%20email%20profile"
									+ "&prompt=select_account";
		
		return "redirect:" + url;
	}

	/** 구글 로그인 콜백 */
	@GetMapping("/google/callback")
	public String googleCallback(@RequestParam("code") String code, HttpSession session) throws Exception {
		String accessToken = googleOAuthService.getAccessToken(code);
		User googleUser = googleOAuthService.getUserInfo(accessToken);

		User dbUser = userService.getUserByGoogleId(googleUser.getGoogleId());
		if (dbUser == null) {
			String genId = "google_" + googleUser.getGoogleId();
			googleUser.setUserId(genId);
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
			if ((dbUser.getUserName() == null || dbUser.getUserName().isEmpty()) && googleUser.getUserName() != null) {
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

		String displayId = (dbUser.getEmail() != null && !dbUser.getEmail().isEmpty()) ? dbUser.getEmail()
				: (dbUser.getUserName() != null && !dbUser.getUserName().isEmpty()) ? dbUser.getUserName()
						: dbUser.getGoogleId();

		session.setAttribute("user", dbUser);
		session.setAttribute("loginType", "google");
		session.setAttribute("displayId", displayId);
		session.setMaxInactiveInterval(60 * 60);

		if (!userService.isProfileComplete(dbUser)) {
			return "redirect:/user/onboardView.jsp";
		}
		return "redirect:/index.jsp";
	}
}
