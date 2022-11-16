<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"  isELIgnored="false"
 %>
<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8">

  <style>
    
    li {
      color: black;
      
    }
    #container {
      width: 100%;
    }

    #header {
      width: 100%;
      margin-bottom: 50px;
    }

    #flex {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    #img {
      position: fixed;
      top: 20%;
      left: 1%;
    }

    #side {
      position: fixed;
      top: 20%;
      right: 18%;
    }

    #footer {
      width: 100%;
    }
  </style>
  <title>
    <tiles:insertAttribute name="title" />
  </title>
</head>

<body>
  <div id="body">
    <div id="container">
      <div id="header">
        <tiles:insertAttribute name="header" />
      </div>
      <div id="flex">
        <div id="img">
          <tiles:insertAttribute name="img" />
        </div>
        <div id="content">
          <tiles:insertAttribute name="body" />
        </div>
      </div>
      <div id="side">
        <tiles:insertAttribute name="side" />
      </div>
      <div id="footer">
        <tiles:insertAttribute name="footer" />
      </div>
    </div>
  </div>
</body>

</html>