<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"   isELIgnored="false"  %>
	<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %> 
	<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
	
<c:set var="contextPath" value="${pageContext.request.contextPath}" />
<%
  request.setCharacterEncoding("UTF-8");
%>
<c:set var="contextPath" value="${pageContext.request.contextPath }" />
<c:set var="noticlesList" value="${noticlesMap.noticlesList }" />
<c:set var="totArticles" value="${articlesMap.totArticles }" />
<c:set var="section" value="${articlesMap.section }" />
<c:set var="pageNum" value="${articlesMap.pageNum }" /> 
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>공지사항 리스트</title>
  <!-- 글꼴 -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" 교차 출처>
  <link href="https: //fonts.googleapis.com/css2? family= Merriweather+Sans:wght@500 & display=swap" rel="stylesheet">
  <!-- css -->
  <link rel="stylesheet" href="/css/noticelist.css">
  <script src="/js/dealingJS/noticelist.js"></script>
</head>
<script  src="https://code.jquery.com/jquery-3.6.0.js" integrity="sha256-H+K7U5CnXl1h5ywQfKtSj8PCmoN9aaq30gDh27Xc0jk=" crossorigin="anonymous"></script>
<script  type="text/javascript" src="https://cdn.datatables.net/v/dt/dt-1.11.4/r-2.2.9/datatables.min.js"></script>
<body>
	<div class="nt_header">
		<img src="../image/promote.png">
		<div id="">
			<h1>공지사항</h1>
			<h3>부동산과 가구에 관한 공지사항 게시판 입니다.<br>
			공지사항을 통해서 다양한 공지를 확인해주세요!!!</h3>

		</div>
	</div>
	<form action="${contextPath}/noticeform.do" method="get" id="noticeForm">
	<table id="noticeTable">
		<tr>
			<th  id="Category">카테고리</th>
			<th  id="notice_Num">글번호</th>
			<th  id="writer">작성자</th>
			<th  id="notice_Title">제목</th>
			<th  id="RegDate">작성일</th>
			<th  id="view">조회수</th>
		</tr>
			
		<tbody>
			<c:forEach var="i" items="${notic}">
				<tr id="foreach_tr">
					<td id="Cate_td">${i.notice_Category}</td>
					<td><c:out value="${i.notice_Num}"/></a></td>
					<td>관리자</td>
					<td id="Title_td"><a href="/notice/read?notice_Num=${i.notice_Num}" id="a_none"><c:out value="${i.notice_Title}"/></a></td>
					<td><fmt:formatDate value="${i.notice_Date}" pattern="yyyy-MM-dd"/></td>
					<td>${i.viewCnt}</td>
				</tr>
			</c:forEach>
		</tbody>
	</table>	
</form>
</body>
</html>