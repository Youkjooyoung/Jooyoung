<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"   isELIgnored="false"  %>
	<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %> 
	<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
	
<c:set var="contextPath" value="${pageContext.request.contextPath}" />
<%
  request.setCharacterEncoding("UTF-8");
%>
<c:set var="contextPath" value="${pageContext.request.contextPath }" />
<c:set var="articlesList" value="${articlesMap.articlesList }" />
<c:set var="totArticles" value="${articlesMap.totArticles }" />
<c:set var="section" value="${articlesMap.section }" />
<c:set var="pageNum" value="${articlesMap.pageNum }" />
<c:url var="inteboardlistURL" value="/dealing/inteboardlist"></c:url>

<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <!-- 글꼴 -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" 교차 출처>
  <link href="https: //fonts.googleapis.com/css2? family= Merriweather+Sans:wght@500 & display=swap" rel="stylesheet">
<!-- css -->
<link rel="stylesheet" href="/css/inteboardlist.css">
<!--js-->
<script src="/js/dealingJS/inteboardlist.js"></script>
</head>
<script src="https://code.jquery.com/jquery-3.6.0.js"   integrity="sha256-H+K7U5CnXl1h5ywQfKtSj8PCmoN9aaq30gDh27Xc0jk=" crossorigin="anonymous"></script>
<link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/v/dt/dt-1.11.4/r-2.2.9/datatables.min.css"/>
<script defer type="text/javascript" src="https://cdn.datatables.net/v/dt/dt-1.11.4/r-2.2.9/datatables.min.js"></script>
	<script>
		$(document).ready( function () {
			$('#table_id').DataTable({
				responsive : {deatail:{ type: 'column',
										target : 1}},
				ordering: false,
				language: {
					url: '/js/user/dataTables.ko.json'
				},
				lengthChange: true,
				info : false,
				searching:true,
				displayLength:13,
					});
			} );
	
	</script>

<body>
	
	<form action="${contextPath}/inteboardlist.do" method="get" id="listForm">
		
	<table id="table_id" cellspacing="0">
		<thead>
		<tr>
			<th>글번호</th>
			<th>작성자</th>
			<th>제목</th>
			<th>작성일</th>
			<th>조회수</th>
		</tr>
		</thead>
	<tbody>
		<c:forEach var="board" items="${inteboardlist}" varStatus="boardNum">
			<tr>
				<td>${board.inte_Num}</td>
				<!--<td>${boardNum.count}</td>은 게시글1번을 삭제하면 2번이 1번으로-->
				<td>${board.user_Id}</td>
				<td><a href="/board/read?inte_Num=${board.inte_Num}">
					<c:out value="${board.inte_Title}" /></a></td>
				<td><fmt:formatDate value="${board.inte_Date}" /></td>
				<td>${board.viewCounts}</td>
				
			</tr>
		 </c:forEach>
		</tbody>
	</table>
	<input type="button" class="write-btn" onclick="javascript:fn_addboard('${isLogOn }','${contextPath }/inteboardform.do', '${contextPath }/login.do')" value="글작성">
</form>
</body>
</html>