/*----------------------------뒤로가기----------------------------*/ 
	function backToList(obj) {
		obj.action="/inteboardlist.do";
		obj.submit();
	}

/*----------------------------삭제하기----------------------------*/
	
	function fn_remove_article(url,inte_Num){
	var form = document.createElement("form");
	form.setAttribute("method", "post");
	form.setAttribute("action", url);
 	if(confirm("삭제하시면 복구가 불가능합니다. 삭제하시겠습니까?")){
	}else{
		alert("취소되었습니다.");
		return false;
	}
 	var inte_NumInput = document.createElement("input");
 	inte_NumInput.setAttribute("type","hidden");
 	inte_NumInput.setAttribute("name","inte_Num");
 	inte_NumInput.setAttribute("value",inte_Num);
 	form.appendChild(inte_NumInput);
 	document.body.appendChild(form);
 	form.submit();
 	
}

/*----------------------------수정하기----------------------------*/

function fn_update_article(url,inte_Num){
	var form = document.createElement("form");
	form.setAttribute("method", "post");
	form.setAttribute("action", url);
 	var inte_NumInput = document.createElement("input");
 	inte_NumInput.setAttribute("type","hidden");
 	inte_NumInput.setAttribute("name","inte_Num");
 	inte_NumInput.setAttribute("value",inte_Num);
 	form.appendChild(inte_NumInput);
 	document.body.appendChild(form);
 	form.submit();
	
}
/*----------------------------이미지 읽기----------------------------*/
	function readURL(input) {
		if(input.files && input.files[0]) {
			var reader = new FileReader();
			reader.onload = function (e) {
				$('#preview').attr('src', e.target.result);
			}
			reader.readAsDataURL(input.files[0]);
		}
	}