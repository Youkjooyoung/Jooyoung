/* 텍스트추가*/ 
var cnt = 1;

function fn_addtext() {
	$("#d_text").append("<br>" +
		"<input type='text' id='product_Option1' name='product_Option1' size='32'  placeholder='상품 옵션을 입력하세요.' />"
	);
	cnt++;
}
var cnt = 1;

function fn_addtext2() {
	$("#d_text2").append("<br>" +
		"<input type='text' id='product_Option2' name='product_Option2' size='32'  placeholder='상품 추가 옵션을 입력하세요.' />"
	);
	cnt++;
}


// 썸네일 코드 
document.addEventListener('DOMContentLoaded', () => {
	document.querySelector("#product_Image").addEventListener("change", async e => {
		const preview = document.querySelector("#preview");
		document.querySelector(".imgh1").innerHTML = "사진이 등록 되었습니다.";
		let reader = new FileReader();
		reader.onloadend = finished => {
			preview.setAttribute('src', finished.target.result);
			preview.classList.remove("xbox");
			console.log(finished.target.result);
		}
		reader.readAsDataURL(e.target.files.item(0));
	})


	let check = (e) => {
		let product_Image = document.querySelector("#product_Image");
		let product_Name = document.querySelector("#product_Name");
		let product_Price = document.querySelector("#product_Price");
		let product_Option1 = document.querySelector("#product_Option1");
		let product_Option2 = document.querySelector("#product_Option2");
		let product_TotalCount = document.querySelector("#product_TotalCount");
		let summernote = document.querySelector("#summernote");
		let FORMTAG = document.querySelector(".product_form");
		if (product_Image.value.trim() === '') {
			alert("이미지를 넣어주세요");
			product_Image.focus();
			return;
		} else if (product_Name.value.trim() === '') {
			alert("상품명 을 입력해주세요");
			product_Name.focus();
			return;
		} else if (product_Price.value.trim() === '') {
			alert("가격을 입력해주세요");
			product_Price.focus();
			return;
		} else if (product_TotalCount.value.trim() === '') {
			alert("재고량을 입력해주세요");
			product_TotalCount.focus();
			return;
		} else if (summernote.value.trim() === '') {
			alert("상세설명 을 입력해주세요");
			summernote.focus();
			return;
		}
		if (!confirm("상품등록을 하시겠습니까?")) {
			e.preventDefault();
			return;
		}
		FORMTAG.submit();
	}




	// // 등록 버튼 누를시 
	document.querySelector("#productsubmit").addEventListener("click", async (e) => {
		e.preventDefault();
		check(e);

	})
});




// 썸머노트
(function() {


	$("#summernote").summernote("code", {
		height: 300, // 에디터 높이
		minHeight: 300, // 최소 높이
		maxHeight: null, // 최대 높이(null 제한없음)
		focus: false, // 에디터 로딩후 포커스를 맞출지 여부
		lang: "ko-KR", // 한글 설정
		toolbar: [
			['fontname', ['fontname']], // 글꼴 설정
			['fontsize', ['fontsize']], // 글자 크기 설정
			['style', ['bold', 'italic', 'underline', 'strikethrough',
				'clear'
			]], // 굵기, 기울임꼴, 밑줄,취소 선, 서식지우기
			['color', ['forecolor', 'color']], // 글자색
			['table', ['table']], // 표만들기
			['para', ['ul', 'ol', 'paragraph']], // 글머리 기호, 번호매기기, 문단정렬
			['height', ['height']], // 줄간격
			['insert', ['picture', 'link', 'video']], // 그림첨부, 링크만들기, 동영상첨부
			['view', ['fullscreen', 'codeview', 'help']] // 코드보기, 확대해서보기, 도움말
		],
		// 추가한 글꼴
		fontNames: ['Arial', 'Arial Black', '맑은 고딕', '궁서',
			'굴림체', '굴림', '돋음체', '바탕체'
		],
		// 추가한 폰트사이즈
		fontSizes: ['8', '9', '10', '11', '12', '14', '16', '18', '20', '22', '24',
			'28', '30',
			'36', '50', '72'
		]
	});


})();
document.querySelector("#productsubmit").addEventListener("click", () => {
	event.preventDefault();
	check();

});