window.onload = function(){
	
document.querySelector("#rep").addEventListener("click", async () => {
            let dl_Num = +document.querySelector("#dl_Num").value;
            let rp_Title = document.querySelector("#rp_Title").value;
            let rp_Content = document.querySelector("#rp_Content").value;

            if (!confirm("신고하시겠습니까?")) {
            	window.close();
                return;
            }
            let req = await fetch("/report.do", {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    dl_Num: dl_Num,
                    rp_Title: rp_Title,
                    rp_Content: rp_Content
                })
            })
            if(req.status = 200 ){
                let result = await req.json();
                if(result.result === 1){
                    alert("신고가 완료되었습니다.")
                    window.close();
                    return;
                }else{
                    alert("다시 시도 하세요");
                    return;
                }
            }else{
                alert("서버 오류");
                return;
            }
        });
};