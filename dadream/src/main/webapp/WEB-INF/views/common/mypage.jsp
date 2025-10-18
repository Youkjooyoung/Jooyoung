<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"
    isELIgnored="false" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%
  request.setCharacterEncoding("UTF-8");
%>
<!DOCTYPE html>
<lang="ko">

    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>마이페이지</title>
        <!-- reset css -->
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reset-css@5.0.1/reset.min.css">
        <!-- css -->
        <link rel="stylesheet" href="/css/mypage.css">
        <!-- 글꼴 -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" 교차 출처>
        <link href="https: //fonts.googleapis.com/css2? family= Merriweather+Sans:wght@500 & display=swap" rel="stylesheet">
        <style>
            * {
                font-family: 'Merriweather Sans', sans-serif !important;
            }
    </style>
        <!--JS-->
        <script src="/js/common/mypage.js" defer></script>
        <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
        <!--DataTable-->
        <script src="https://code.jquery.com/jquery-3.6.0.js"   integrity="sha256-H+K7U5CnXl1h5ywQfKtSj8PCmoN9aaq30gDh27Xc0jk=" crossorigin="anonymous"></script>
        <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/v/dt/dt-1.11.4/r-2.2.9/datatables.min.css"/>
        <script defer type="text/javascript" src="https://cdn.datatables.net/v/dt/dt-1.11.4/r-2.2.9/datatables.min.js"></script>
    </head>
    <script>
		$(document).ready( function () {
			$.fn.DataTable.ext.pager.numbers_length = 5;	//페이징처리 버튼 갯수
            
			$('#table_id').DataTable({
				
				responsive : {deatail:{ type: 'column',
										target : 1}},
				ordering: true, 
                order :[[0, 'desc']],
            	url: '/js/user/dataTables.ko.json',
				lengthChange: true,
				info : false,
				searching:true,
				"search":{caseInsensitive:false},	//검색 시 영 대소문자 구별
				displayLength:13,
				scrollCollapse : false,
				"pagingType": "simple_numbers",
				columnDefs:[{targets:0, width: 60},{targets:1,width: 80}
							 ,{targets:2,width:280},{targets:3,width:130}],
                      
    });
} );
	
	</script>


    <body>
        <!-- <h1>${empty user_Pwd ? "안 넘어옴" : "넘어옴"}</h1> -->
        <div class="mypagecontrol">
            <div class="mypage">
                <div id="userinfo_mod">

                    <form>
                        <h2>회원정보 변경</h2><br>
                        <label style="font-weight: 700; ">ID</label><br>
                        <input type="text" style="margin: 10px 0;" id="userId" value="${member.user_Id}" disabled><br>
                        <p>비밀번호</p>
                        <input type="password" value="${members.user_Pwd}" id="infoPwdCheck" name="user_Pwd" disabled>
                        <p>비밀번호 재확인</p>
                        <input type="password" id="infoPwdCheck2" value="${members.user_Pwd}" disabled>
                        <p>이메일</p>
                        <input type="text" id="infoEmailCheck" value="${members.user_Email}" disabled>
                        <p>핸드폰</p>
                        <input type="text" id="infoPhoneCheck" value="${members.user_Phone}" disabled>
                        <p style="margin-bottom: 5px; font-weight: bold;">주소</p>
                        <input type="text" size="50" id="infoAddress2Check" value="${members.user_Address2}" disabled>
                        <br>
                        <br>
                        <p style="margin-bottom: 5px; font-weight: bold;">상세주소</p>
                        <input type="text" size="20" id="infoAddress3Check" value="${members.user_Address3}" disabled>
                        <br><br>
                        <input type="submit" name="mod" id="change" value="변경" >
                        <br><br>
                    </form>
                    <div class="passwordcheck"></div>
                </div>
                <br>
                <h2>내가 등록한 방</h2>
                <div id="myroom">
                    <c:forEach var="myDealing" items="${myDealing}">
                        <div style="display: flex;">
                            <div>
                                <img src="/dealing/${myDealing.user_Id}/${myDealing.dl_Image}" alt="매물사진"
                                    style="width:300px; height: 300px;">
                            </div>
                            <div id="mydl">
                                <p>매물이름 : ${myDealing.dl_Title}</p><br>
                                <P>건물형태 : ${myDealing.dl_Form}</P><br>
                                <P>매매종류 : ${myDealing.dl_Form2}</P><br>
                                <p>방 개수 : ${myDealing.dl_Room}</p><br>
                                <p>매매가격 : ${myDealing.dl_Price}</p><br>
                                <p>조회수 : ${myDealing.dl_Views}</p><br>
                                <div class="modelete">

                                    <form name="modmod" method="post" action="${contextPath}/dealing/modDealing.do">
                                        <input type="hidden" name="modDlUser_Id" value="${myDealing.user_Id}">
                                        <input type="hidden" name="modDl_Num" value="${myDealing.dl_Num}">
                                        <input type="submit" value="수정" style="cursor:pointer; border-radius: 5px;">
                                    </form>
                                    <form method="post" action="${contextPath}/dealing/deleteDealing.do" onsubmit="return deleteSub();">
                                        <input type="hidden" name="delDlUser_Id" value="${myDealing.user_Id}">
                                        <input type="hidden" name="delDl_Num" value="${myDealing.dl_Num}">
                                        <input type="hidden" name="delDl_Image" value="${myDealing.dl_Image}">
                                        <input type="submit" value="삭제" style="cursor:pointer; border-radius: 5px;" >
                                    </form>
                                </div>
                            </div>
                        </div>
                    </c:forEach>
                </div>
                <br>
                <h2>관심목록</h2>
                <div class="myLike">
                    <c:forEach var="jjimList" items="${myJjim}">
                        <c:forEach var="myDealing2" items="${jjimList.dealing}">
                            <div style="display: flex; margin-right: 20px;">
                                <div style="height: 249px;">
                                    <img src="/dealing/${jjimList.user_Id}/${myDealing2.dl_Image}" alt="매물사진"
                                        style="width:200px; height:249px">
                                </div>
                                <div class="jjimContents">
                                    <p style="color: red;">매물이름 : ${myDealing2.dl_Title}</p><br>
                                    <p style="color: blue;">건물형태 : ${myDealing2.dl_Form}</p><br>
                                    <P style="color: purple;">매매종류 : ${myDealing2.dl_Form2}</P><br>
                                    <p style="color: black;">방 개수 : ${myDealing2.dl_Room}</p><br>
                                    <p style="color: green;">매매가격 : ${myDealing2.dl_Price}</p><br>
                                    <p style="color: skyblue;">조회수 : ${myDealing2.dl_Views}</p><br>
                                </div>
                            </div>
                        </c:forEach>
                    </c:forEach>
                </div>
                <hr>
                <br><br>
                <div class="report">
                    <h2>허위매물 신고목록</h2>
                    <br>
                    <table class="table">
                        <tr style="height: 30px; line-height: 30px;">
                            <th>No</th>
                            <th>매물명</th>
                            <th>신고사유</th>
                            <th>신고일</th>
                        </tr>
                        <c:forEach var="myReport" items="${myReport}">
                            <tr style="border-bottom: 1px solid #ccc; height: 40px; line-height: 40px;">
                                <td>${myReport.dl_ReportNum}</td>
                                <td>${myReport.rp_Title}</td>
                                <td>${myReport.rp_Content}</td>
                                <td>${myReport.rp_Date}</td>
                            </tr>
                        </c:forEach>
                    </table>
                </div>
                <br>
                <hr>

                <h2>나의 게시글</h2>
                <div id="myboardlist">
                            <table id="table_id" cellspacing="0">
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>작성자</th>
                                        <th>제목</th>
                                        <th>작성일</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <c:forEach var="myboardList" items="${myboardList}" >
                                        <c:if test="${user_Id == myboardList.user_Id}">
                                            <tr>
                                                <td>${myboardList.inte_Num}</td>
                                        <!--<td>${boardNum.count}</td>은 게시글1번을 삭제하면 2번이 1번으로-->
                                        <td>${myboardList.user_Id}</td>
                                        <td><a href="/board/read?inte_Num=${myboardList.inte_Num}" title="${myboardList.inte_Text}">
                                            <c:out value="${myboardList.inte_Title}" /></a></td>
                                            <td><fmt:formatDate value="${myboardList.inte_Date}" /></td>
                                    </tr>
                                </c:if>
                            </c:forEach>
                        </tbody>
                    </table>
                    
                <button id="quit"type="button" onclick="pwdCheck()" value="회원탈퇴">회원탈퇴</button>
                    </div>
            </div>
        </div>
        <script>
            /*//////////////////////////////회원탈퇴////////////////////////////////////////*/
            var user_Id = "${member.user_Id}"
        console.log(user_Id);

        function pwdCheck() {
        	let pwdCheck = prompt("비밀번호 확인", "비밀번호 를 입력해주세요");
        	console.log(pwdCheck);
        	if (pwdCheck === null && pwdCheck === "") {
        		console.log("다시 시도하십시오.");
        	} else {
        		if (!confirm("정말로 탈퇴하시겠습니까?")) {
        			alert("탈퇴가 취소되었습니다.");
        			return;
        		}
        		$.ajax({
        			url: "pwdCheck.do",
        			type: "post",
        			dataType: "json",
        			data: {
        				pwdCheck,
        				user_Id
        			},
        			success: function(result) {
        				console.log(result.userCheck);
        				if (result.userCheck === 1) {
        					location.href = "/removeMember.do"
        					alert("탈퇴가 완료되었습니다.");
        					return;
        				} else if (result.userCheck !== 1) {
        					alert("비밀번호가 틀립니다.");
        					return;
        				}


        			},
        			error: function() {
        				alert("오류");
        			}

        		});
        		return;
        	}
        }
        </script>
    </body>
    </html>