
/*텍스트추가*/ 

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
	document.querySelector(".note-editable").innerHTML = "${pro.product_Content}";

	//상품옵션1
	let Option1 = "${pro.product_Option1}";

	let op1Result = Option1.split(",");
	if (op1Result.length !== 0) {

		for (let i = 0; i < op1Result.length; i++) {
			fn_addtext();
			let optAll1 = document.querySelectorAll("#product_Option1");
			optAll1[i].value = op1Result[i];
		}
	}
	// 상품옵션2
	let Option2 = "${pro.product_Option2}";

	let op2Result = Option2.split(",");
	if (op2Result.length !== 0) {
		console.log("0이 아님");
		for (let i = 0; i < op2Result.length; i++) {
			fn_addtext2();
			let optAll2 = document.querySelectorAll("#product_Option2");
			optAll2[i].value = op2Result[i];
		}
	}


	//

	document.querySelector("#product_Image").addEventListener("change", async e => {
		const preview = document.querySelector("#preview");
		document.querySelector(".imgh1").innerHTML = "사진이 등록 되었습니다.";
		let reader = new FileReader();
		reader.onloadend = finished => {
			preview.setAttribute('src', finished.target.result);
			console.log(finished.target.result);
		}
		reader.readAsDataURL(e.target.files.item(0));
	})

	// // 등록 버튼 누를시 
	document.querySelector("#productsubmit").addEventListener("click", async (e) => {
		if (!confirm("상품등록을 하시겠습니까?")) {
			e.preventDefault();
			return;
		}


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
