------------------------------------------------------------
-- 1) DROP (자식 → 부모 → 시퀀스)
------------------------------------------------------------
-- 자식(이미지) 먼저
DROP TABLE PRODUCT_IMAGE CASCADE CONSTRAINTS PURGE;

-- 자식(거래)
DROP TABLE TRANSACTION;

-- 부모들
DROP TABLE PRODUCT;
DROP TABLE USERS;

-- 시퀀스
DROP SEQUENCE PRODUCT_IMG_SEQ;
DROP SEQUENCE SEQ_TRANSACTION_TRAN_NO;
DROP SEQUENCE SEQ_PRODUCT_PROD_NO;


------------------------------------------------------------
-- 2) SEQUENCE (상품/거래) - INSERT 전에만 존재하면 됨
------------------------------------------------------------
CREATE SEQUENCE SEQ_PRODUCT_PROD_NO     INCREMENT BY 1 START WITH 10000;
CREATE SEQUENCE SEQ_TRANSACTION_TRAN_NO INCREMENT BY 1 START WITH 10000;


------------------------------------------------------------
-- 3) CREATE TABLES (부모 → 자식(FK))
------------------------------------------------------------
CREATE TABLE USERS ( 
    USER_ID      VARCHAR2(20)  NOT NULL,
    USER_NAME    VARCHAR2(50)  NOT NULL,
    PASSWORD     VARCHAR2(10)  NOT NULL,
    ROLE         VARCHAR2(5)   DEFAULT 'user',
    SSN          VARCHAR2(13),
    CELL_PHONE   VARCHAR2(14),
    ADDR         VARCHAR2(100),
    EMAIL        VARCHAR2(50),
    REG_DATE     DATE,
    PRIMARY KEY(USER_ID)
);

CREATE TABLE PRODUCT ( 
    PROD_NO          NUMBER          NOT NULL,
    PROD_NAME        VARCHAR2(100)   NOT NULL,
    PROD_DETAIL      VARCHAR2(200),
    MANUFACTURE_DAY  VARCHAR2(8),
    PRICE            NUMBER(10),
    IMAGE_FILE       VARCHAR2(100),
    REG_DATE         DATE,
    PRIMARY KEY(PROD_NO)
);

CREATE TABLE TRANSACTION ( 
    TRAN_NO           NUMBER       NOT NULL,
    PROD_NO           NUMBER(16)   NOT NULL REFERENCES PRODUCT(PROD_NO),
    BUYER_ID          VARCHAR2(20) NOT NULL REFERENCES USERS(USER_ID),
    PAYMENT_OPTION    CHAR(3),
    RECEIVER_NAME     VARCHAR2(20),
    RECEIVER_PHONE    VARCHAR2(14),
    DEMAILADDR        VARCHAR2(100),
    DLVY_REQUEST      VARCHAR2(100),
    TRAN_STATUS_CODE  CHAR(3),
    ORDER_DATA        DATE,
    DLVY_DATE         DATE,
    PRIMARY KEY(TRAN_NO)
);


------------------------------------------------------------
-- 4) 샘플 데이터 INSERT (사용자/상품)
------------------------------------------------------------
INSERT INTO USERS ( USER_ID, USER_NAME, PASSWORD, ROLE, SSN, CELL_PHONE, ADDR, EMAIL, REG_DATE ) 
VALUES ( 'admin', 'admin', '1234', 'admin', NULL, NULL, '서울시 서초구', 'admin@mvc.com', to_date('2012/01/14 10:48:43', 'YYYY/MM/DD HH24:MI:SS')); 

INSERT INTO USERS ( USER_ID, USER_NAME, PASSWORD, ROLE, SSN, CELL_PHONE, ADDR, EMAIL, REG_DATE ) 
VALUES ( 'manager', 'manager', '1234', 'admin', NULL, NULL, NULL, 'manager@mvc.com', to_date('2012/01/14 10:48:43', 'YYYY/MM/DD HH24:MI:SS'));          

INSERT INTO USERS VALUES ( 'user01', 'SCOTT', '1111', 'user', NULL, NULL, NULL, NULL, sysdate); 
INSERT INTO USERS VALUES ( 'user02', 'SCOTT', '2222', 'user', NULL, NULL, NULL, NULL, sysdate); 
INSERT INTO USERS VALUES ( 'user03', 'SCOTT', '3333', 'user', NULL, NULL, NULL, NULL, sysdate); 
INSERT INTO USERS VALUES ( 'user04', 'SCOTT', '4444', 'user', NULL, NULL, NULL, NULL, sysdate); 
INSERT INTO USERS VALUES ( 'user05', 'SCOTT', '5555', 'user', NULL, NULL, NULL, NULL, sysdate); 
INSERT INTO USERS VALUES ( 'user06', 'SCOTT', '6666', 'user', NULL, NULL, NULL, NULL, sysdate); 
INSERT INTO USERS VALUES ( 'user07', 'SCOTT', '7777', 'user', NULL, NULL, NULL, NULL, sysdate); 
INSERT INTO USERS VALUES ( 'user08', 'SCOTT', '8888', 'user', NULL, NULL, NULL, NULL, sysdate); 
INSERT INTO USERS VALUES ( 'user09', 'SCOTT', '9999', 'user', NULL, NULL, NULL, NULL, sysdate); 
INSERT INTO USERS VALUES ( 'user10', 'SCOTT', '1010', 'user', NULL, NULL, NULL, NULL, sysdate); 
INSERT INTO USERS VALUES ( 'user11', 'SCOTT', '1111', 'user', NULL, NULL, NULL, NULL, sysdate);
INSERT INTO USERS VALUES ( 'user12', 'SCOTT', '1212', 'user', NULL, NULL, NULL, NULL, sysdate);
INSERT INTO USERS VALUES ( 'user13', 'SCOTT', '1313', 'user', NULL, NULL, NULL, NULL, sysdate);
INSERT INTO USERS VALUES ( 'user14', 'SCOTT', '1414', 'user', NULL, NULL, NULL, NULL, sysdate);
INSERT INTO USERS VALUES ( 'user15', 'SCOTT', '1515', 'user', NULL, NULL, NULL, NULL, sysdate);
INSERT INTO USERS VALUES ( 'user16', 'SCOTT', '1616', 'user', NULL, NULL, NULL, NULL, sysdate);
INSERT INTO USERS VALUES ( 'user17', 'SCOTT', '1717', 'user', NULL, NULL, NULL, NULL, sysdate);
INSERT INTO USERS VALUES ( 'user18', 'SCOTT', '1818', 'user', NULL, NULL, NULL, NULL, sysdate);
INSERT INTO USERS VALUES ( 'user19', 'SCOTT', '1919', 'user', NULL, NULL, NULL, NULL, sysdate);

INSERT INTO PRODUCT VALUES (SEQ_PRODUCT_PROD_NO.NEXTVAL,'vaio vgn FS70B','소니 바이오 노트북 신동품','20120514',2000000, 'AHlbAAAAtBqyWAAA.jpg',to_date('2012/12/14 11:27:27', 'YYYY/MM/DD HH24:MI:SS'));
INSERT INTO PRODUCT VALUES (SEQ_PRODUCT_PROD_NO.NEXTVAL,'자전거','자전거 좋아요~','20120514',10000, 'AHlbAAAAvetFNwAA.jpg',to_date('2012/11/14 10:48:43', 'YYYY/MM/DD HH24:MI:SS'));
INSERT INTO PRODUCT VALUES (SEQ_PRODUCT_PROD_NO.NEXTVAL,'보르도','최고 디자인 신품','20120201',1170000, 'AHlbAAAAvewfegAB.jpg',to_date('2012/10/14 10:49:39', 'YYYY/MM/DD HH24:MI:SS'));
INSERT INTO PRODUCT VALUES (SEQ_PRODUCT_PROD_NO.NEXTVAL,'보드세트','한시즌 밖에 안썼습니다. 눈물을 머금고 내놓음 ㅠ.ㅠ','20120217', 200000, 'AHlbAAAAve1WwgAC.jpg',to_date('2012/11/14 10:50:58', 'YYYY/MM/DD HH24:MI:SS'));
INSERT INTO PRODUCT VALUES (SEQ_PRODUCT_PROD_NO.NEXTVAL,'인라인','좋아욥','20120819', 20000, 'AHlbAAAAve37LwAD.jpg',to_date('2012/11/14 10:51:40', 'YYYY/MM/DD HH24:MI:SS'));
INSERT INTO PRODUCT VALUES (SEQ_PRODUCT_PROD_NO.NEXTVAL,'삼성센스 2G','sens 메모리 2Giga','20121121',800000, 'AHlbAAAAtBqyWAAA.jpg',to_date('2012/11/14 18:46:58', 'YYYY/MM/DD HH24:MI:SS'));
INSERT INTO PRODUCT VALUES (SEQ_PRODUCT_PROD_NO.NEXTVAL,'연꽃','정원을 가꿔보세요','20121022',232300, 'AHlbAAAAtDPSiQAA.jpg',to_date('2012/11/15 17:39:01', 'YYYY/MM/DD HH24:MI:SS'));
INSERT INTO PRODUCT VALUES (SEQ_PRODUCT_PROD_NO.NEXTVAL,'삼성센스','노트북','20120212',600000, 'AHlbAAAAug1vsgAA.jpg',to_date('2012/11/12 13:04:31', 'YYYY/MM/DD HH24:MI:SS'));

COMMIT;


------------------------------------------------------------
-- 5) 조회수 컬럼 추가 (원본 스크립트 위치 유지)
------------------------------------------------------------
ALTER TABLE PRODUCT ADD VIEW_COUNT NUMBER DEFAULT 0;


------------------------------------------------------------
-- 6) 이미지 테이블 & 시퀀스 (부모 PRODUCT 생성 후)
------------------------------------------------------------
-- (이미 위에서 DROP 했으므로 바로 CREATE)
CREATE TABLE PRODUCT_IMAGE (
    IMG_ID      NUMBER          NOT NULL,                -- 이미지 PK
    PROD_NO     NUMBER          NOT NULL,                -- 상품 번호(FK)
    FILE_NAME   VARCHAR2(255),                           -- 업로드 파일명
    REG_DATE    DATE DEFAULT SYSDATE,                    -- 등록일자
    CONSTRAINT PK_PRODUCT_IMAGE PRIMARY KEY (IMG_ID),
    CONSTRAINT FK_PRODUCT_IMAGE_PRODUCT FOREIGN KEY (PROD_NO)
        REFERENCES PRODUCT (PROD_NO) ON DELETE CASCADE
);

-- 이미지용 시퀀스
CREATE SEQUENCE PRODUCT_IMG_SEQ
    START WITH 1
    INCREMENT BY 1
    NOCACHE
    NOCYCLE;


PURGE RECYCLEBIN;

ALTER TABLE TRANSACTION ADD CANCEL_DATE DATE;