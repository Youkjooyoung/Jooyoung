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

        <div class="input-group">


        </div>


        <ul class="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" id="navbarDropdown" href="#" role="button" data-bs-toggle="dropdown"
                    aria-expanded="false"><i class="fas fa-user fa-fw"></i></a>
                <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                    <li><a class="dropdown-item" href="#!">Settings</a></li>
                    <li><a class="dropdown-item" href="#!">Activity Log</a></li>
                    <li>
                        <hr class="dropdown-divider" />
                    </li>
                    <li><a class="dropdown-item" href="#!">Logout</a></li>
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
                <div class="container-fluid px-4">
                    <h1 class="mt-4">대시보드</h1>
                    <ol class="breadcrumb mb-4">
                        <li class="breadcrumb-item active">Dashboard</li>
                    </ol>

                    <h3>매출 현황</h3>
                    <div class="row">
                        <div class="col-xl-6">
                            <div class="card mb-4">
                                <div class="card-header">
                                    <i class="fas fa-chart-area me-1"></i>
                                    이번달 가구 매출액
                                </div>
                                <div class="card-body"><canvas id="myAreaChart" width="100%" height="40"></canvas></div>
                            </div>
                        </div>
                        <div class="col-xl-6">
                            <div class="card mb-4">
                                <div class="card-header">
                                    <i class="fas fa-chart-bar me-1"></i>
                                    부동산 공실 채택(건당 100,000￦)
                                </div>
                                <div class="card-body"><canvas id="myBarChart" width="100%" height="40"></canvas></div>
                            </div>
                        </div>
                    </div>
                    <!-- 가구 테이블 -->
                    <div class="card mb-4">
                        <div class="card-header">
                            <i class="fas fa-table me-1"></i>
                            가구 매출
                        </div>
                        <div class="card-body">
                            <table id="datatablesSimple">
                                <thead>
                                    <div style="margin-bottom: 40px;">
                                    </div>
                                    <tr>
                                        <th>구매자</th>
                                        <th>주문번호</th>
                                        <th>판매자</th>
                                        <th>배송주소</th>
                                        <th>상품</th>
                                        <th>구매개수</th>
                                        <th>가격</th>
                                        <th>구매날짜</th>
                                        <th>주문상태</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <c:forEach var="pl" items="${proList}">
                                        <tr>
                                            <td>${pl.user_Id}</td>
                                            <td>${pl.order_Num}</td>
                                            <td>${pl.order_GetName}</td>
                                            <td>${pl.order_Address2}</td>
                                            <td><a href="/productview.do?product_Num=${pl.product_Num}">${pl.product_Name}</a></td>
                                            <td>${pl.product_Count}</td>
                                            <td>${pl.product_TotalPrice}</td>
                                            <td>${pl.order_Date}</td>
                                            <td>${pl.order_State}</td>
                                        </tr>
                                    </c:forEach>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <!-- 부동산 테이블 -->
                    <!-- <div class="card mb-4">
                        <div class="card-header">
                            <i class="fas fa-table me-1"></i>
                            부동산 매출
                        </div>
                        <div class="card-body">
                           <table id="datatablesSimple">
                            <thead>
                                <div style="margin-bottom: 40px;">
                                </div>
                                <tr>
                                    <th>매물번호</th>
                                    <th>구매자</th>
                                    <th>주문번호</th>
                                    <th>구매날짜</th>
                                </tr>
                            </thead>
                            <tbody>
                                <c:forEach var="dl" items="${dlList}">
                                    <tr>
                                        <td>${dl.user_Id}</td>
                                        <td>${dl.order_Num}</td>
                                        <td><a href="${contextPath}/dealingview.do?dl_Num=${dl.dl_Num}">${dl.dl_Num}</a></td>
                                        <td>${dl.do_Date}</td>
                                    </tr>
                                </c:forEach>
                            </tbody>
                        </table> 
                        </div>
                    </div> -->
                </div>
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
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" crossorigin="anonymous">
    </script>
    <script src="/js/admin/scripts.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.8.0/Chart.min.js" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/simple-datatables@latest" crossorigin="anonymous"></script>
    <script src="/js/admin/datatables-simple-demo.js"></script>
    <script>
        /////////////////* 가구 차트 */////////////////
        // Set new default font family and font color to mimic Bootstrap's default styling
        Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
        Chart.defaults.global.defaultFontColor = '#292b2c';

        const date = new Date();
        const month = date.getMonth() +1;
        const test = date.getDate();
        <!--
        var proSum = ${proChart}; //가구꺼
        var dlSum = ${dlChart}; //부동산꺼
        -->
        let chartSum = [0, 0, 0, 0, 0, 0, 0];
        for(let i=0; i<proSum.length; i++) {
            chartSum.splice(6-i, 1, proSum[i]);
        }
        
        // Area Chart Example
        var ctx = document.getElementById("myAreaChart");
        var myLineChart = new Chart(ctx, {
            type: 'line',
            data: {
            labels: [month + "월" + (test-6) + "일", month + "월" + (test-5) + "일", month + "월" + (test-4) + "일", month + "월" + (test-3) + "일", month + "월" + (test-2) + "일", month + "월" + (test-1) + "일", month + "월" + test + "일"],
            datasets: [{
            label: "Sessions",
            lineTension: 0.3,
            backgroundColor: "rgba(2,117,216,0.2)",
            borderColor: "rgba(2,117,216,1)",
            pointRadius: 5,
            pointBackgroundColor: "rgba(2,117,216,1)",
            pointBorderColor: "rgba(255,255,255,0.8)",
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(2,117,216,1)",
            pointHitRadius: 50,
            pointBorderWidth: 2,
            data: chartSum,
            }],
        },
        options: {
            scales: {
            xAxes: [{
                time: {
                unit: 'date'
                },
                gridLines: {
                display: false
                },
                ticks: {
                maxTicksLimit: 7
                }
            }],
            yAxes: [{
                ticks: {
                min: 0,
                max: 6000000,
                maxTicksLimit: 5
                },
                gridLines: {
                color: "rgba(0, 0, 0, .125)",
                }
            }],
            },
            legend: {
            display: false
            }
        }
    });

    /////////////////* 부동산 차트 */////////////////
    // Set new default font family and font color to mimic Bootstrap's default styling

    // Bar Chart Example

    let chartSum2 = [0, 0, 0, 0, 0, 0, 0];
        for(let i=0; i<dlSum.length; i++) {
            chartSum2.splice(6-i, 1, dlSum[i]);
        }

    var ctx2 = document.getElementById("myBarChart");
    var myLineChart2 = new Chart(ctx2, {
    type: 'bar',
    data: {
    labels: [month + "월" + (test-6) + "일", month + "월" + (test-5) + "일", month + "월" + (test-4) + "일", month + "월" + (test-3) + "일", month + "월" + (test-2) + "일", month + "월" + (test-1) + "일", month + "월" + test + "일"],
    datasets: [{
      label: "Revenue",
      backgroundColor: "rgba(2,117,216,1)",
      borderColor: "rgba(2,117,216,1)",
      data: chartSum2,
    }],
  },
  options: {
    scales: {
      xAxes: [{
        time: {
          unit: 'month'
        },
        gridLines: {
          display: false
        },
        ticks: {
          maxTicksLimit: 7
        }
      }],
      yAxes: [{
        ticks: {
          min: 0,
          max: 1000000,
          maxTicksLimit: 5
        },
        gridLines: {
          display: true
        }
      }],
    },
    legend: {
      display: false
    }
  }
});
    </script>
</body>
</html>