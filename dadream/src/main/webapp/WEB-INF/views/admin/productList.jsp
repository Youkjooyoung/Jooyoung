<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"
    isELIgnored="false" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:set var="contextPath" value="${pageContext.request.contextPath}" />
<%
  request.setCharacterEncoding("UTF-8");
%>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    <meta name="description" content="" />
    <meta name="author" content="" />
    <title>다드림 관리자페이지</title>
    <link href="https://cdn.jsdelivr.net/npm/simple-datatables@latest/dist/style.css" rel="stylesheet" />
    <link href="/css/admin/styles.css" rel="stylesheet" />
    <script src="https://use.fontawesome.com/releases/v6.1.0/js/all.js" crossorigin="anonymous"></script>
    <script>
        document.addEventListener("DOMContentLoaded",()=>{

            <c:choose>
            <c:when test="${member.user_Id == null}">
            alert("로그인 후 작성 가능합니다.");
            location.href="/login.do";           
            </c:when>
            <c:when test="${member.user_Level != 100}">
            alert("관리자 권한이 아닙니다.")
            location.href="/";
            </c:when>
            </c:choose>
        })        

    </script>
</head>

<body class="sb-nav-fixed">
    <nav class="sb-topnav navbar navbar-expand navbar-dark bg-dark">
        <!-- Navbar Brand-->
        <a class="navbar-brand ps-3" href="${contextPath}/admin/admin.do">다드림 Admin</a>
        <!-- Sidebar Toggle-->
        <button class="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0" id="sidebarToggle" href="#!"><i
                class="fas fa-bars"></i></button>
        <!-- Navbar Search-->
        <!-- <form class="d-none d-md-inline-block form-inline ms-auto me-0 me-md-3 my-2 my-md-0"> -->
        <div class="input-group">
            <!-- <input class="form-control" type="text" placeholder="Search for..." aria-label="Search for..." aria-describedby="btnNavbarSearch" /> -->
            <!-- <button class="btn btn-primary" id="btnNavbarSearch" type="button"><i class="fas fa-search"></i></button> -->
        </div>
        <!-- </form> -->
        <!-- Navbar-->
        <ul class="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" id="navbarDropdown" href="#" role="button" data-bs-toggle="dropdown"
                    aria-expanded="false"><i class="fas fa-user fa-fw"></i></a>
                <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                    <li><a class="dropdown-item" href="/">부동산</a></li>
                    <li><a class="dropdown-item" href="/productmain.do">가구</a></li>
                    <li>
                        <hr class="dropdown-divider" />
                    </li>
                    <li><a class="dropdown-item" href="/logout.do">Logout</a></li>
                </ul>
            </li>
        </ul>
    </nav>
    <div id="layoutSidenav">
        <div id="layoutSidenav_nav">
            <nav class="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
                <div class="sb-sidenav-menu">
                    <div class="nav">
                        <div class="sb-sidenav-menu-heading">Core</div>
                        <a class="nav-link" href="${contextPath}/admin/admin.do">
                            <div class="sb-nav-link-icon"><i class="fas fa-tachometer-alt"></i></div>
                            매출관리
                        </a>

                        <nav class="sb-sidenav-menu-nested nav accordion" id="sidenavAccordionPages">

                            <a class="nav-link collapsed" href="#" data-bs-toggle="collapse"
                                data-bs-target="#pagesCollapseProduct" aria-expanded="false"
                                aria-controls="pagesCollapseProduct">
                                상품관리
                                <div class="sb-sidenav-collapse-arrow"><i class="fas fa-angle-down"></i></div>
                            </a>
                            <div class="collapse" id="pagesCollapseProduct" aria-labelledby="headingOne"
                                data-bs-parent="#sidenavAccordionPages">
                                <nav class="sb-sidenav-menu-nested nav">
                                    <form action="/admin/pro.do" method="POST">
                                        <p id="proList" class="nav-link">상품조회</p>
                                    </form>
                                    <a class="nav-link" href="#">상품리뷰관리</a>
                                </nav>
                            </div>
                            <script>
                                document.addEventListener("DOMContentLoaded", () => {
                                    document.querySelector("#proList").addEventListener("click", (e) => {
                                        e.target.parentElement.submit();
                                    })
                                    document.querySelector("#proMem").addEventListener("click", (e) => {
                                        e.target.submit();
                                    })
                                })
                            </script>
                            <a class="nav-link collapsed" href="#" data-bs-toggle="collapse"
                                data-bs-target="#pagesCollapseDealing" aria-expanded="false"
                                aria-controls="pagesCollapseDealing">
                                매물관리
                                <div class="sb-sidenav-collapse-arrow"><i class="fas fa-angle-down"></i></div>
                            </a>
                            <div class="collapse" id="pagesCollapseDealing" aria-labelledby="headingOne"
                                data-bs-parent="#sidenavAccordionPages">
                                <nav class="sb-sidenav-menu-nested nav">
                                    <a class="nav-link" href="${contextPath}/admin/dealingsList.do">매물목록</a>
                                </nav>
                            </div>
                            <a class="nav-link collapsed" href="#" data-bs-toggle="collapse"
                                data-bs-target="#pagesCollapseMember" aria-expanded="false"
                                aria-controls="pagesCollapseMember">
                                회원관리
                                <div class="sb-sidenav-collapse-arrow"><i class="fas fa-angle-down"></i></div>
                            </a>
                            <div class="collapse" id="pagesCollapseMember" aria-labelledby="headingOne"
                                data-bs-parent="#sidenavAccordionPages">
                                <nav class="sb-sidenav-menu-nested nav">
                                    <form id="proMem" class="nav-link" method="POST" action="/admin/member.do">회원조회
                                    </form>
                                </nav>
                            </div>
                            <a class="nav-link collapsed" href="#" data-bs-toggle="collapse"
                                data-bs-target="#pagesCollapseReport" aria-expanded="false"
                                aria-controls="pagesCollapseReport">
                                신고관리
                                <div class="sb-sidenav-collapse-arrow"><i class="fas fa-angle-down"></i></div>
                            </a>
                            <div class="collapse" id="pagesCollapseReport" aria-labelledby="headingOne"
                                data-bs-parent="#sidenavAccordionPages">
                                <nav class="sb-sidenav-menu-nested nav">
                                    <a class="nav-link" href="${contextPath}/admin/reportList.do">신고내역</a>
                                </nav>
                            </div>

                            <a class="nav-link" href="/admin/noticeList.do">공지관리</a>
                        </nav>

                    </div>
                </div>
                <div class="sb-sidenav-footer">
                    <div class="small">Logged in as:</div>
                    Start Bootstrap
                </div>
            </nav>
        </div>
        <div id="layoutSidenav_content">
            <main class="NoticeList">
                <h1>상품관리</h1>
                <ol class="breadcrumb mb-4">
                    <li class="breadcrumb-item active">Product Management</li>
                </ol>
                <h3>상품내역</h3>
                <div class="card mb-12" style="margin: 100px 20px 0 20px;">
                    <div class="card-header">
                        <i class="fas fa-table me-1"></i>
                            상품 목록
                    </div>
                    <div class="card-body">
                    <table id="datatablesSimple">
                        <thead>
                            <tr>
                                <th>상품번호</th>
                                <th>유저 아이디</th>
                                <th>상품명</th>
                                <th>등록일</th>
                                <th>상품조회수</th>
                                <th>삭제</th>
                            </tr>
                        </thead>

                        <tbody id="proT">
                            <c:forEach var="i" items="${proselect}">
                                <tr>
                                    <td>${i.product_Num}</td>
                                    <td>${i.user_Id}</td>
                                    <td id="proName"><a
                                            href="/productview.do?product_Num=${i.product_Num}">${i.product_Name}</a>
                                    </td>
                                    <td>${i.product_Date}</td>
                                    <td>${i.product_Views}</td>
                                    <td><button id="proDelete" type="button" onclick="del('${i.product_Num}')"
                                            value="${i.product_Num}">삭제</button></td>
                                </tr>

                            </c:forEach>
                        </tbody>
                    </table>
                </div>
                </div>
                <script>
                    let del = async (proNum) => {
                        console.log(typeof (proNum));
                        console.log();
                        if (!confirm("상품을 삭제 하시겠습니까?")) {
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
                        if (res.status === 200) {
                            let check = await res.json();
                            if (check.result === 1) {
                                alert("삭제 완료");
                                location.reload();
                                return;
                            } else {
                                alert("다시 시도해주세요");
                                return;
                            }
                        } else {
                            alert("서버 오류");
                        }

                    }
                </script>
            </main>

            <footer class="py-4 bg-light mt-auto">
                <div class="container-fluid px-4">
                    <div class="d-flex align-items-center justify-content-between small">
                        <div class="text-muted">Copyright &copy; Your Website 2022</div>
                        <div>
                            <a href="#">Privacy Policy</a>
                            &middot;
                            <a href="#">Terms &amp; Conditions</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    </div>
    <script>

    </script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" crossorigin="anonymous">
    </script>
    <script src="/js/admin/scripts.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.8.0/Chart.min.js" crossorigin="anonymous"></script>
    <script src="/js/admin/chart-area-demo.js"></script>
    <script src="/js/admin/chart-bar-demo.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/simple-datatables@latest" crossorigin="anonymous"></script>
    <script src="/js/admin/datatables-simple-demo.js"></script>
</body>

</html>