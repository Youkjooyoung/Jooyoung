// 뒤로가기
	function backToList(obj) {
		obj.action="${contextPath}/noticelist.do";
		obj.submit();
	}
	
	function fn_remove_noticle(url,notice_Num){
	var form = document.createElement("form");
	form.setAttribute("method", "post");
	form.setAttribute("action", url);
 	var notice_NumInput = document.createElement("input");
 	notice_NumInput.setAttribute("type","hidden");
 	notice_NumInput.setAttribute("name","notice_Num");
 	notice_NumInput.setAttribute("value",notice_Num);
 	form.appendChild(notice_NumInput);
 	document.body.appendChild(form);
 	form.submit();
	alert("삭제하시겠습니까?");
}
	
	function readURL(input) {
		if(input.files && input.files[0]) {
			var reader = new FileReader();
			reader.onload = function (e) {
				$('#preview').attr('src', e.target.result);
			}
			reader.readAsDataURL(input.files[0]);
		}
	}