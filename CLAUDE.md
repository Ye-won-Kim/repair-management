# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

카센터(자동차 수리점) 수리 이력 관리 웹앱. 빌드 도구나 서버 없이 **정적 HTML 파일 하나**와 **Google Apps Script 백엔드**로 동작한다.

## Files

- `카센터관리.html` — 프론트엔드 전체 (HTML + CSS + JS 단일 파일)
- Apps Script 코드는 Google 서버에서 관리되며, 이 저장소에는 없음. 변경 사항은 사용자가 직접 Google Apps Script 에디터에 붙여넣고 재배포함

## Architecture

### 프론트엔드 (`카센터관리.html`)

- 프레임워크 없음. 순수 JS로 작성
- `records` 배열을 인메모리 캐시로 사용. 앱 로드 시 API에서 한 번 fetch하고, 이후 저장/수정/삭제 시 로컬 배열도 동기 업데이트해 페이지 재로드 없이 렌더링
- `editMode` 플래그 하나로 등록 폼과 수정 폼을 겸용
- 탭 전환은 `.section` div를 show/hide하는 방식

### 백엔드 (Google Apps Script)

- Web App으로 배포된 단일 `doGet(e)` 함수
- `e.parameter.action` 값으로 분기: `list` / `save` / `update` / `delete`
- `list` action은 시트 1행을 헤더로 읽어 JSON으로 반환 → 컬럼 순서가 바뀌어도 헤더 이름 기준으로 매핑됨
- `save` / `update`는 컬럼 순서가 고정이므로 Apps Script와 시트 헤더 순서가 반드시 일치해야 함

### API 연결

```
const API = 'https://script.google.com/macros/s/{DEPLOYMENT_ID}/exec';
```

Apps Script를 수정하면 반드시 **새 버전으로 재배포**해야 반영됨.

## Google Sheets 컬럼 구조

| A | B | C | D | E | F | G | H | I | J | K |
|---|---|---|---|---|---|---|---|---|---|---|
| id | plate | model | name | phone | date | price | content | note | revisit | paymethod |

- `id`: `Date.now()` 기반 고유값
- `revisit`: 재방문까지의 일수 (30 / 60 / 90 / 180 / 365), 없으면 빈 문자열
- `paymethod`: `현금` 또는 `카드`
- 컬럼 추가 시 **맨 끝에 추가**해야 기존 데이터가 깨지지 않음

## Apps Script 수정 가이드

사용자가 직접 Google Apps Script 에디터에서 수정하므로, 코드 변경이 필요할 때는 **전체 스크립트를 수정된 형태로 제공**한다.

`save` / `update` action의 배열 값 순서와 `getRange(row, 1, 1, N)`의 N은 항상 컬럼 수와 일치해야 한다. 현재 N = 11.

## 개인 선호도

- 설명은 한국어로 해줘
- 코드 주석은 한국어로 작성
- 변경사항을 설명할 때 before/after 형식 사용

## 코드 스타일

- 함수형 접근 선호 (가능한 경우)
- 명시적 타입 어노테이션 선호
- 에러 메시지는 사용자가 이해할 수 있도록 구체적으로