 // 1000단위로 . 찍기
                const number = num =>
                    num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");



                // 계산하는 함수 총 개수 총 금액
                const price = () => {

                    let tr = [...document.querySelectorAll("#carttable > tbody > tr")];
                    let total = tr.reduce((acc, curr) => {
                        let currcount = +curr.querySelector("#productCount").value;
                        let currprice = +curr.querySelector("#productprice").innerText;
                        acc.count += currcount;
                        acc.price += (currprice * currcount);
                        return acc;
                    }, {
                        count: 0,
                        price: 0
                    });
                    document.querySelector("#productnum").innerHTML = number(total.count);
                    document.querySelector("#totalprice").innerHTML = number(total.price);
                    document.querySelector("#totalpriceplus").innerHTML = number(total.price + 2500);

                }
                document.addEventListener("DOMContentLoaded", () => {
                    price();
                    
                      // 삭제 버튼 
                    document.querySelector("#carttable").addEventListener("click", async e => {
                        if (e.target.tagName.toLowerCase() !== "button") {
                            // e.target instanceof HTMLButtonElement
                            return;
                        }
                        if (!confirm("정말로 삭제하시겠습니까?")) {
                            return;
                        }
                        let num = e.target.value;
                        // console.log(num);
                        console.log(e.target);
                        let cartdelete = await fetch("/cartdelete.do", {
                            method: "POST",
                            headers: {
                                "content-type": "application/json"
                            },
                            body: JSON.stringify(num)
                        })
                        if (cartdelete.status = 200) {
                            let data = await cartdelete.json();
                            console.log(data);
                            if (data.result === 0) {
                                alert("다시 시도해주세요");
                                location.reload();
                                return;
                            } else {
                                alert("삭제가 완료되었습니다");
                                location.reload();
                                return;
                            }

                        } else {
                            alert("서버 문제");
                        }
                    })
                })