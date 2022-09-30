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

## 📌 설치

```bash
$ npm install
```

## 📌 환경 변수 설정

```bash
## .env 안에 들어갈 내용
MYSQL_HOST= db 호스트
MYSQL_USER= db 계정
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
