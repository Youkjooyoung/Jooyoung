/*function readURL(input) {
	 	if (input.files && input.files[0]) {
	 	var reader = new FileReader();
	 	reader.onload = function (e) {
		 $('#preview').attr('src', e.target.result);	
		 }
		 reader.readAsDataURL(input.files[0]);
		 }
	 } 
	 function backToList(obj){
	 	 obj.action="${contextPath}/inteboardlist.do";
		 obj.submit();
	 }
	 var cnt = 1;
	function fn_addFile(){
		$("#d_file").append("<br>" + "<input type='file' name='file" + cnt +"' />");
		cnt++;
	}
	function _onSubmit(){
		if(!confirm("수정하시겠습니까?")){
			return false;
		}
	}
	function fn_modify_article(obj){
	obj.action="${contextPath}/board/update_action";
	obj.submit();
	}*/
	function readURL(input) {
	 	if (input.files && input.files[0]) {
	 	var reader = new FileReader();
	 	reader.onload = function (e) {
		 $('#preview').attr('src', e.target.result);	
		 }
		 reader.readAsDataURL(input.files[0]);
		 }
	 } 
	 function backToList(obj){
	 	 obj.action="${contextPath}/inteboardlist.do";
		 obj.submit();
	 }
	 var cnt = 1;
	function fn_addFile(){
		$("#d_file").append("<br>" + "<input type='file' name='file" + cnt +"' />");
		cnt++;
	}
	function _onSubmit(){
			if (!confirm("수정하시겠습니까?")) {
				return false;
			}
		}
	//////////////////////////////////////// 썸네일 코드 //////////////////////////////////
document.addEventListener('DOMContentLoaded', () => {
	document.querySelector("#inteboard_Image").addEventListener("change", async e => {
		const preview = document.querySelector("#preview");
		document.querySelector(".imgh2").innerHTML = "성공적으로 등록했습니다!";
		let reader = new FileReader();
		reader.onloadend = finished => {
			preview.setAttribute('src', finished.target.result);
			console.log(finished.target.result);
		}
		reader.readAsDataURL(e.target.files.item(0));
	})

});
	
	
	