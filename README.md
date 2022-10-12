<div align=center>
<img src="https://capsule-render.vercel.app/api?type=waving&color=auto&height=250&section=header&text=🧩SNS%20게시글%20API%20서버🧩&fontSize=45" />
  </br>
  <b id=content>SNS 게시글 API 서버</b>
  </br></br>
  <h3>📚 STACKS</h3>
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=NestJS&logoColor=white">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=TypeScript&logoColor=white">
  <img src="https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=Jest&logoColor=white">
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=MySQL&logoColor=white">
  <img src="https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=Sequelize&logoColor=white">
  <img src="https://img.shields.io/badge/.ENV-ECD53F?style=for-the-badge&logo=.ENV&logoColor=white">
</div>

## 📌 설치환경

- Ubuntu 22.04.1 LTS
- MySQL v8.0.30
- Node.js v16.17.1 (lts version)
- npm v8.15.0

## 📌 설치

```bash
$ npm install
```

## 📌 환경 변수 설정

```bash
## .env 안에 들어갈 내용
MYSQL_HOST= db 호스트
MYSQL_USERNAME= db 계정
MYSQL_PASSWORD= db 패스워드
MYSQL_DATABASE= db 이름
MYSQL_PORT= db 포트 번호
SECRET= jwt 시크릿 키
```

## 📌 앱 실행

```bash
# development
$ npm run start
```

## 📌 테스트

```bash
# e2e tests
$ npm run test:e2e
```

<img src="https://user-images.githubusercontent.com/92367032/195327860-b11cc578-1b72-48e8-88ac-09850934069f.png"/>
<br/>

## 📌 요구사항

### A. 유저관리

**유저 회원가입**

```
➡️ 이메일을 ID로 사용합니다.
```

**유저 로그인 및 인증**

```
➡️ JTW 토큰을 발급받으며, 이를 추후 사용자 인증으로 사용합니다.
```

- 로그아웃은 프론트엔드에서 처리.

### B. 게시글

#### 게시글 생성

```
➡️ 제목, 내용, 해시태그 등을 입력하여 생성합니다.
```

```
➡️ 제목, 내용, 해시태그는 필수 입력사항이며, 작성자 정보는 request body에 존재하지 않고, 해당 API 를 요청한 인증정보에서 추출하여 등록 합니다.

(= API 단에서 토큰에서 얻은 사용자 정보를 게시글 생성때 작성자로 넣어사용.)
```

```
➡️ 해시태그는 #로 시작되고 , 로 구분되는 텍스트가 입력됩니다.
ex) { “hashtags”: “#맛집,#서울,#브런치 카페,#주말”, …}
```

#### 게시글 수정

```
➡️ 작성자만 수정할 수 있습니다.
```

#### 게시글 삭제

```
➡️ 작성자만 삭제할 수 있습니다.
```

```
➡️ 작성자는 삭제된 게시글을 다시 복구할 수 있습니다.
```

#### 게시글 상세보기

```
➡️ 모든 사용자는 모든 게시물에 보기권한이 있습니다.
```

```
➡️ 작성자를 포함한 사용자는 본 게시글에 좋아요를 누를 수 있습니다.
좋아요된 게시물에 다시 좋아요를 누르면 취소됩니다.
```

```
➡️ 작성자 포함한 사용자가 게시글을 상세보기 하면 조회수가 1 증가합니다. (횟수 제한 없음)
```

#### 게시글 목록

```
➡️ 모든 사용자는 모든 게시물에 보기권한이 있습니다.
```

```
➡️ 게시글 목록에는 제목, 작성자, 해시태그, 작성일, 좋아요 수, 조회수 가 포함됩니다.
```

- **아래 기능은 쿼리 파라미터로 구현. ex) ?search=..&orderBy=..** (예시이며 해당 변수는 직접 설정)
- 아래 4가지 동작은 각각 동작 할 뿐만 아니라, 동시에 적용될 수 있어야 합니다.

```
➡️ Ordering (= Sorting, 정렬)

사용자는 게시글 목록을 원하는 값으로 정렬할 수 있습니다.
(default: 작성일,  / 작성일, 좋아요 수, 조회수 중 1개 만 선택가능)

오름차 순, 내림차 순을 선택할 수 있습니다.
```

```
➡️ Searching (= 검색)

사용자는 입력한 키워드로 해당 키워드를 포함한 게시물을 조회할 수 있습니다.

# Like 검색, 해당 키워드가 문자열 중 포함 된 데이터 검색
검색 방법 1.  some-url?search=후기 >>  “후기" 가 제목에 포함된 게시글 목록.

[ex. 후기 검색 시 > 00 방문후기 입니다. (검색 됨)]
```

```
➡️ Filtering (= 필터링)

사용자는 지정한 키워드로 해당 키워드를 포함한 게시물을 필터링할 수 있습니다.

예시 1) some-url?hastags=서울 >> “서울" 해시태그를 가진 게시글 목록.
예시 2) some-url?hastags=서울,맛집 >> “서울" 과 “맛집” 해시태그를 모두 가진 게시글 목록.

[ex. “서울” 검색 시 > #서울(검색됨) / #서울맛집 (검색안됨)  / #서울,#맛집(검색됨)]
[ex. “서울,맛집” 검색 시 > #서울(검색안됨) / #서울맛집 (검색안됨)  / #서울,#맛집(검색됨)]
```

```
➡️ Pagination (= 페이지 기능)

사용자는 1 페이지 당 게시글 수를 조정할 수 있습니다. (default: 10건)
```

- 위 기능들은 각각이 아닌 서로 조합하여 사용할 수 있어야합니다.

## 📌 DB 모델링

![sns](https://user-images.githubusercontent.com/92367032/193233335-e4561980-1870-40af-a6b8-ea5c8db223b1.png)

## 📌 API 문서

https://iris-feta-eb2.notion.site/6072d6b25ca341c495c59f516374e05b?v=7979a1842b02439ea9c855e19787bc89

## 📌 Commit Convention

- init : 초기화
- feat : 새로운 기능 추가
- fix : 버그 수정
- docs : 문서 수정
- style : 코드 포맷팅, 세미콜론 누락, 코드 변경이 없는 경우, linting
- refactor : 코드 리팩터링
- test : 테스트 코드, 리팩터링 테스트 코드 추가
- chore : 빌드 업무 수정, 패키지 매니저 수정, 그 외 자잘한 수정에 대한 커밋

## 📌 Todo list

- 좋아요 기능 구현 예정
- 게시글 목록을 정렬(orderBy)로 조회할 때, 요구사항에 맞게 재작업 예정
