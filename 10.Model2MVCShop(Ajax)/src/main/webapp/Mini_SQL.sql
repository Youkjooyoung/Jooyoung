------------------------------------------------------------
-- 1) DROP (자식 → 부모 → 시퀀스)
------------------------------------------------------------
DROP TABLE PRODUCT_IMAGE CASCADE CONSTRAINTS PURGE;
DROP TABLE TRANSACTION CASCADE CONSTRAINTS PURGE;
DROP TABLE PRODUCT CASCADE CONSTRAINTS PURGE;
DROP TABLE USERS CASCADE CONSTRAINTS PURGE;

DROP SEQUENCE PRODUCT_IMG_SEQ;
DROP SEQUENCE SEQ_TRANSACTION_TRAN_NO;
DROP SEQUENCE SEQ_PRODUCT_PROD_NO;

------------------------------------------------------------
-- 2) SEQUENCE (상품 / 거래)
------------------------------------------------------------
CREATE SEQUENCE SEQ_PRODUCT_PROD_NO
  INCREMENT BY 1 START WITH 10000 NOCACHE NOCYCLE;

CREATE SEQUENCE SEQ_TRANSACTION_TRAN_NO
  INCREMENT BY 1 START WITH 10000 NOCACHE NOCYCLE;

------------------------------------------------------------
-- 3) CREATE TABLES (부모 → 자식)
------------------------------------------------------------
CREATE TABLE USERS ( 
    USER_ID      VARCHAR2(50 CHAR)  NOT NULL,
    USER_NAME    VARCHAR2(50 CHAR)  NOT NULL,
    PASSWORD     VARCHAR2(100 CHAR) NOT NULL,
    ROLE         VARCHAR2(5 CHAR)   DEFAULT 'user',
    SSN          VARCHAR2(13 CHAR),
    CELL_PHONE   VARCHAR2(14 CHAR),
    ADDR         VARCHAR2(100 CHAR),
    EMAIL        VARCHAR2(50 CHAR),
    REG_DATE     DATE,
    ZIPCODE      VARCHAR2(10 CHAR),
    ADDR_DETAIL  VARCHAR2(200 CHAR),
    KAKAO_ID     VARCHAR2(50 CHAR),
    GOOGLE_ID    VARCHAR2(50 CHAR),
    PROFILE_IMG  VARCHAR2(200 CHAR),
    CONSTRAINT PK_USERS PRIMARY KEY(USER_ID)
);

CREATE TABLE PRODUCT ( 
    PROD_NO          NUMBER           NOT NULL,
    PROD_NAME        VARCHAR2(100 CHAR) NOT NULL,
    PROD_DETAIL      VARCHAR2(200 CHAR),
    MANUFACTURE_DAY  VARCHAR2(8 CHAR),
    PRICE            NUMBER(10),
    IMAGE_FILE       VARCHAR2(100 CHAR),
    REG_DATE         DATE,
    VIEW_COUNT       NUMBER DEFAULT 0,
    STOCK_QTY        NUMBER DEFAULT 0 NOT NULL,
    CONSTRAINT PK_PRODUCT PRIMARY KEY(PROD_NO)
);

CREATE TABLE TRANSACTION ( 
    TRAN_NO           NUMBER          NOT NULL,
    PROD_NO           NUMBER          NOT NULL,
    BUYER_ID          VARCHAR2(50 CHAR) NOT NULL,
    PAYMENT_OPTION    CHAR(3 CHAR),
    RECEIVER_NAME     VARCHAR2(20 CHAR),
    RECEIVER_PHONE    VARCHAR2(14 CHAR),
    DIVY_ADDR         VARCHAR2(100 CHAR),
    DLVY_REQUEST      VARCHAR2(100 CHAR),
    TRAN_STATUS_CODE  CHAR(3 CHAR),
    ORDER_DATE        DATE,
    DLVY_DATE         DATE,
    CANCEL_DATE       DATE,
    CANCEL_REASON     VARCHAR2(1000 CHAR),
    ZIPCODE           VARCHAR2(10 CHAR),
    ADDR_DETAIL       VARCHAR2(200 CHAR),
    QTY               NUMBER DEFAULT 1 NOT NULL,
    CONSTRAINT PK_TRANSACTION PRIMARY KEY(TRAN_NO),
    CONSTRAINT FK_TRAN_PRODUCT FOREIGN KEY (PROD_NO)
        REFERENCES PRODUCT(PROD_NO),
    CONSTRAINT FK_TRAN_USER FOREIGN KEY (BUYER_ID)
        REFERENCES USERS(USER_ID)
);

------------------------------------------------------------
-- 4) 기본 관리자 및 사용자 샘플 데이터
------------------------------------------------------------
INSERT INTO USERS (USER_ID, USER_NAME, PASSWORD, ROLE, ADDR, EMAIL, REG_DATE) 
VALUES ('admin', 'admin', '1234', 'admin', '서울시 서초구', 'admin@mvc.com',
        TO_DATE('2012/01/14 10:48:43', 'YYYY/MM/DD HH24:MI:SS')); 

INSERT INTO USERS (USER_ID, USER_NAME, PASSWORD, ROLE, EMAIL, REG_DATE) 
VALUES ('manager', 'manager', '1234', 'admin', 'manager@mvc.com',
        TO_DATE('2012/01/14 10:48:43', 'YYYY/MM/DD HH24:MI:SS'));          

-- 일반 사용자 19명
BEGIN
  FOR i IN 1..19 LOOP
    INSERT INTO USERS (USER_ID, USER_NAME, PASSWORD, ROLE, REG_DATE)
    VALUES ('user' || LPAD(i, 2, '0'), 'SCOTT', TO_CHAR(i) || TO_CHAR(i), 'user', SYSDATE);
  END LOOP;
END;
/
COMMIT;

------------------------------------------------------------
-- 5) 상품 샘플 데이터 (기본 8개)
------------------------------------------------------------
INSERT INTO PRODUCT VALUES (SEQ_PRODUCT_PROD_NO.NEXTVAL,'vaio vgn FS70B','소니 바이오 노트북 신동품','20120514',2000000, 'AHlbAAAAtBqyWAAA.jpg', TO_DATE('2012/12/14 11:27:27','YYYY/MM/DD HH24:MI:SS'),0,10);
INSERT INTO PRODUCT VALUES (SEQ_PRODUCT_PROD_NO.NEXTVAL,'자전거','자전거 좋아요~','20120514',10000, 'AHlbAAAAvetFNwAA.jpg', TO_DATE('2012/11/14 10:48:43','YYYY/MM/DD HH24:MI:SS'),0,10);
INSERT INTO PRODUCT VALUES (SEQ_PRODUCT_PROD_NO.NEXTVAL,'보르도','최고 디자인 신품','20120201',1170000, 'AHlbAAAAvewfegAB.jpg', TO_DATE('2012/10/14 10:49:39','YYYY/MM/DD HH24:MI:SS'),0,10);
INSERT INTO PRODUCT VALUES (SEQ_PRODUCT_PROD_NO.NEXTVAL,'보드세트','한시즌 밖에 안썼습니다.','20120217',200000, 'AHlbAAAAve1WwgAC.jpg', TO_DATE('2012/11/14 10:50:58','YYYY/MM/DD HH24:MI:SS'),0,10);
INSERT INTO PRODUCT VALUES (SEQ_PRODUCT_PROD_NO.NEXTVAL,'인라인','좋아욥','20120819',20000, 'AHlbAAAAve37LwAD.jpg', TO_DATE('2012/11/14 10:51:40','YYYY/MM/DD HH24:MI:SS'),0,10);
INSERT INTO PRODUCT VALUES (SEQ_PRODUCT_PROD_NO.NEXTVAL,'삼성센스 2G','sens 메모리 2Giga','20121121',800000, 'AHlbAAAAtBqyWAAA.jpg', TO_DATE('2012/11/14 18:46:58','YYYY/MM/DD HH24:MI:SS'),0,10);
INSERT INTO PRODUCT VALUES (SEQ_PRODUCT_PROD_NO.NEXTVAL,'연꽃','정원을 가꿔보세요','20121022',232300, 'AHlbAAAAtDPSiQAA.jpg', TO_DATE('2012/11/15 17:39:01','YYYY/MM/DD HH24:MI:SS'),0,10);
INSERT INTO PRODUCT VALUES (SEQ_PRODUCT_PROD_NO.NEXTVAL,'삼성센스','노트북','20120212',600000, 'AHlbAAAAug1vsgAA.jpg', TO_DATE('2012/11/12 13:04:31','YYYY/MM/DD HH24:MI:SS'),0,10);
COMMIT;

------------------------------------------------------------
-- 6) 추가 가상 상품 100개
------------------------------------------------------------
BEGIN
  FOR i IN 1..100 LOOP
    INSERT INTO PRODUCT (
        PROD_NO, PROD_NAME, PROD_DETAIL, MANUFACTURE_DAY,
        PRICE, IMAGE_FILE, REG_DATE, VIEW_COUNT, STOCK_QTY
    ) VALUES (
        SEQ_PRODUCT_PROD_NO.NEXTVAL,
        '상품' || i,
        '상품 설명입니다 ' || i,
        TO_CHAR(ADD_MONTHS(DATE '2025-01-01', MOD(i, 12)), 'YYYYMMDD'),
        10000 + (i * 1000),
        'prod' || i || '.jpg',
        SYSDATE - MOD(i, 30),
        0, 10
    );
  END LOOP;
END;
/
COMMIT;

------------------------------------------------------------
-- 7) PRODUCT_IMAGE 테이블 & 시퀀스
------------------------------------------------------------
CREATE TABLE PRODUCT_IMAGE (
    IMG_ID      NUMBER          NOT NULL,
    PROD_NO     NUMBER          NOT NULL,
    FILE_NAME   VARCHAR2(255 CHAR),
    REG_DATE    DATE DEFAULT SYSDATE,
    CONSTRAINT PK_PRODUCT_IMAGE PRIMARY KEY (IMG_ID),
    CONSTRAINT FK_PRODUCT_IMAGE_PRODUCT FOREIGN KEY (PROD_NO)
        REFERENCES PRODUCT(PROD_NO) ON DELETE CASCADE
);

CREATE SEQUENCE PRODUCT_IMG_SEQ
  START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;

------------------------------------------------------------
-- 8) 인덱스 및 제약조건
------------------------------------------------------------
-- 거래 상태/상품별 조회
CREATE INDEX IDX_TRX_PROD_STATUS ON TRANSACTION (PROD_NO, TRAN_STATUS_CODE);

-- 사용자 이메일/전화번호 유니크
CREATE UNIQUE INDEX UX_USERS_EMAIL ON USERS(LOWER(email));
CREATE UNIQUE INDEX UX_USERS_PHONE ON USERS(cell_phone);

------------------------------------------------------------
-- 9) 마무리
------------------------------------------------------------
PURGE RECYCLEBIN;

ALTER TABLE PRODUCT
  ADD CONSTRAINT CK_PRODUCT_STOCK_POSITIVE CHECK (STOCK_QTY >= 0);

COMMIT;
