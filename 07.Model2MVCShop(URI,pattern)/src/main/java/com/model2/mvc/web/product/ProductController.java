package com.model2.mvc.web.product;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import com.model2.mvc.common.Page;
import com.model2.mvc.common.Search;
import com.model2.mvc.service.domain.Product;
import com.model2.mvc.service.domain.ProductImage;
import com.model2.mvc.service.product.ProductService;
import com.model2.mvc.service.purchase.PurchaseService;

//==> 상품관리 Controller
@Controller
@RequestMapping("/product/*")
public class ProductController {

	/// Field
	@Autowired
	@Qualifier("productServiceImpl")
	private ProductService productService;
	private PurchaseService purchaseService;

	@Autowired
	public ProductController(ProductService productService, PurchaseService purchaseService) {
		this.productService = productService;
		this.purchaseService = purchaseService;
	}

	@Value("#{commonProperties['pageUnit']}")
	int pageUnit;

	@Value("#{commonProperties['pageSize']}")
	int pageSize;

	// 판매등록으로 단순 Navigation
//	@RequestMapping("/addProductView.do")
	@RequestMapping(value = "addProduct", method = RequestMethod.GET)
	public String addProductView() throws Exception {

		System.out.println("/addProductView : GET");

		return "redirect:/product/addProductView.jsp";
	}

	// 판매등록
//	@RequestMapping("/addProduct.do")
	@RequestMapping(value = "addProduct", method = RequestMethod.POST)
	public String addProduct(@ModelAttribute("product") Product product,
			@RequestParam(value = "uploadFiles", required = false) MultipartFile[] uploadFiles,
			HttpServletRequest request) throws Exception {

		// 상품 기본 정보 먼저 저장
		if (product.getManuDate() != null && product.getManuDate().contains("-")) {
			product.setManuDate(product.getManuDate().replaceAll("-", ""));
		}
		productService.addProduct(product);

		// 파일 업로드 경로
		String uploadPath = request.getSession().getServletContext().getRealPath("/images/uploadFiles/");
		File dir = new File(uploadPath);
		if (!dir.exists()) {
			dir.mkdirs();
		}

		// 여러 개 파일 저장
		if (uploadFiles != null) {
			for (MultipartFile file : uploadFiles) {
				if (!file.isEmpty()) {
					String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
					File dest = new File(uploadPath, fileName);
					file.transferTo(dest);

					// DB에 개별 파일 저장 (상품이미지 테이블 활용)
					ProductImage image = new ProductImage();
					image.setProdNo(product.getProdNo()); // addProduct() 후 생성된 prodNo
					image.setFileName(fileName);
					productService.addProductImage(image);
				}
			}
		}
		System.out.println("업로드된 파일 개수 = " + uploadFiles.length);

		return "redirect:/product/listProduct?menu=manage";
	}

	// 상품조회 & 최근본 상품
//	@RequestMapping("/getProduct.do")
	@RequestMapping(value = "getProduct", method = RequestMethod.GET)
	public String getProduct(@RequestParam("prodNo") int prodNo, HttpSession session, Model model) throws Exception {
		// 1. 상품 조회
		Product product = productService.getProduct(prodNo);
		String latestCode = purchaseService.getLatestTranCodeByProd(prodNo);
		List<ProductImage> productImages = productService.getProductImages(prodNo);
		model.addAttribute("product", product);
		model.addAttribute("productImages", productImages);
		model.addAttribute("latestCode", latestCode);

		// 2. 최근 본 상품 세션에 저장
		List<Product> recentList = (List<Product>) session.getAttribute("recentList");
		if (recentList == null) {
			recentList = new ArrayList<>();
		}

		// 중복 제거
		recentList.removeIf(p -> p.getProdNo() == product.getProdNo());

		// 맨 앞에 추가
		recentList.add(0, product);

		// 최대 5개 유지
		if (recentList.size() > 5) {
			recentList = recentList.subList(0, 5);
		}

		session.setAttribute("recentList", recentList);

		return "forward:/product/getProduct.jsp";
	}

	// 상품정보수정화면으로 단순 Navigation

	@RequestMapping(value = "updateProduct", method = RequestMethod.GET)
	public String updateProductView(@RequestParam("prodNo") int prodNo, Model model) throws Exception {
		// 기본 상품정보 조회
		Product product = productService.getProduct(prodNo);

		// 기존 이미지 리스트 조회
		List<ProductImage> productImages = productService.getProductImages(prodNo);

		model.addAttribute("product", product);
		model.addAttribute("productImages", productImages);

		// 수정 화면으로 포워드
		return "forward:/product/updateProduct.jsp";
	}

//	@RequestMapping("/updateProductView.do")
	@RequestMapping(value = "updateProduct", method = RequestMethod.POST)
	public String updateProduct(@ModelAttribute("product") Product product,
			@RequestParam(value = "uploadFiles", required = false) MultipartFile[] uploadFiles,
			@RequestParam(value = "deleteImageIds", required = false) List<Integer> deleteImageIds,
			HttpServletRequest request, HttpSession session) throws Exception {

		System.out.println("/updateProduct: POST");
		System.out.println("삭제 대상 이미지 IDs : " + deleteImageIds);
		
		// 1. 삭제 처리
		if (deleteImageIds != null) {
			for (Integer imgId : deleteImageIds) {
				productService.deleteProductImage(imgId);
			}
		}

		// 2. 새 이미지 업로드 처리
		if (uploadFiles != null) {
			String uploadPath = request.getSession().getServletContext().getRealPath("/images/uploadFiles/");
			File dir = new File(uploadPath);
			if (!dir.exists())
				dir.mkdirs();

			for (MultipartFile file : uploadFiles) {
				if (!file.isEmpty()) {
					String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
					file.transferTo(new File(uploadPath, fileName));

					ProductImage image = new ProductImage();
					image.setProdNo(product.getProdNo());
					image.setFileName(fileName);
					productService.addProductImage(image);
				}
			}
		}

		if (product.getManuDate() != null && product.getManuDate().contains("-")) {
			product.setManuDate(product.getManuDate().replaceAll("-", ""));
		}

		productService.updateProduct(product);

		return "redirect:/product/getProduct?prodNo=" + product.getProdNo();
	}

	// 상품 삭제
	@RequestMapping("/product/deleteProduct")
	public String deleteProduct(@RequestParam("prodNo") int prodNo) throws Exception {
		productService.deleteProduct(prodNo);
		return "redirect:/product/listProduct?menu=manage";
	}

	// 상품 목록 조회
//	@RequestMapping("/listProduct.do")
	@RequestMapping(value = "listProduct")
	public String listProduct(@RequestParam(value = "menu", required = false) String menu,
			@ModelAttribute("search") Search search, HttpSession session, Model model) throws Exception {

		if (search.getCurrentPage() == 0)
			search.setCurrentPage(1);
		if (search.getPageSize() == 0)
			search.setPageSize(pageSize);

		Map<String, Object> map = productService.getProductList(search);
		List<Product> list = (List<Product>) map.get("list");

		// 상태 뿌리기용 : prodNo -> 최신 tranCode
		List<Integer> prodNos = list.stream().map(Product::getProdNo).collect(Collectors.toList());
		Map<Integer, String> latestCodeMap = prodNos.isEmpty() ? new HashMap<>()
				: purchaseService.getLatestTranCodeByProdNos(prodNos);

		Integer totalCountObj = (Integer) map.get("totalCount");
		int totalCount = (totalCountObj != null) ? totalCountObj.intValue() : 0;

		Page resultPage = new Page(search.getCurrentPage(), totalCount, pageUnit, search.getPageSize());

		model.addAttribute("list", list);
		model.addAttribute("resultPage", resultPage);
		model.addAttribute("search", search);
		model.addAttribute("latestCodeMap", latestCodeMap);

		// menu 파라미터에 따라 다른 JSP로 이동
		if ("manage".equals(menu)) {
			return "forward:/product/listManageProduct.jsp";
		} else {
			return "forward:/product/listProduct.jsp";
		}
	}

}