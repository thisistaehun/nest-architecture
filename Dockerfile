## ----------
## Step 1
## ----------


FROM node:18.18 AS builder


## 작업할 Working Directory를 설정합니다.
WORKDIR /proj

## 프로젝트의 모든 파일을 WORKDIR(/proj)로 복사합니다(.dockerignore 항목 제외)
COPY . .

## Nest.js project의 종속성을 설치하고 빌드합니다.
RUN yarn install
RUN yarn build

## ----------
## Step 2
## ----------

FROM node:18.18

## 작업할 Working Directory를 설정합니다.
WORKDIR /proj

## Step 1의 builder에서 build된 nestjs 프로젝트를 파일을 가져옵니다.
COPY --from=builder /proj ./

## Puppeteer 종속성 설치
RUN apt-get update \
    && apt-get install -y wget gnupg \
    && apt-get install -y chromium \
    && rm -rf /var/lib/apt/lists/*

ARG ENVIRONMENT
ENV ENVIRONMENT=${ENVIRONMENT}

## application 실행
CMD yarn start:$ENVIRONMENT
