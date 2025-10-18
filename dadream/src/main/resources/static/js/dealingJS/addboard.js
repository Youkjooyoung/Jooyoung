

function readURL(input) {
	if (input.files && input.files[0]) {
		var reader = new FileReader();
		reader.onload = function(e) {
			$('#preview').attr('src', e.target.result);
		}
		reader.readAsDataURL(input.files[0]);
	}
}

var cnt = 1;
function fn_addFile() {
	$("#d_file").append("<br>" + "<input type='file' name='file" + cnt + "' />");
	cnt++;
}


// if($("#board_writer").val() == ""){
//   	alert("작성자를 입력해주세요");
// 	$("#board_writer").focus();
// 	return false;
//   }
function _onSubmit() {

	if ($("#inte_Title").val() == "") {
		alert("제목을 입력해주세요");
		$("#inte_Title").focus();
		return false;
	}

	if ($("#inte_Text").val() == "") {
		alert("내용을 입력해주세요");
		$("#inte_Text").focus();
		return false;
	}

	if (!confirm("등록하시겠습니까?")) {
		return false;
	}
}

// 썸네일 코드 
document.addEventListener('DOMContentLoaded', () => {
	document.querySelector("#inteboard_Image").addEventListener("change", async e => {
		const preview = document.querySelector("#preview");
		document.querySelector(".imgh2").innerHTML = "!!";
		let reader = new FileReader();
		reader.onloadend = finished => {
			preview.setAttribute('src', finished.target.result);
			console.log(finished.target.result);
		}
		reader.readAsDataURL(e.target.files.item(0));
	})

	// // 등록 버튼 누를시 
	// document.querySelector("#productsubmit").addEventListener("click", async () => {



	// })
});

	 ////이미지 업로드전 엑박 표시 제거 할 대체 이미지

