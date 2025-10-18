 let proDelete = document.querySelector("#proDelete");
            let proDeletes =document.querySelectorAll("#proDelete");
            for(let i = 0; i<proDeletes.length; i++){
                let proNum = +document.querySelectorAll("#proDelete")[i].value;
                console.log(proNum);
                
                
                proDeletes[i].addEventListener("click", async (e) => {
                console.log(typeof(proNum));
                if(!confirm("상품을 삭제 하시겠습니까?")){
                    return;
                }
                let res = await fetch("/proDelete.do", {
                    method: "POST",
                    headers: {
                        "content-type": "application/json"
                    },
                    body: JSON.stringify(
                        proNum
                    )                    
                })
                if(res.status === 200){
                    let check = await res.json();
                    if(check.result===1){
                        alert("삭제 완료");
                        location.reload();
                        return;
                    }else{
                        alert("다시 시도해주세요");
                        return;
                    }
                }
                alert("서버 오류");

            })
        }