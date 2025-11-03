# frontend/Dockerfile

# 빌드 단계
FROM node:20 as builder
WORKDIR /app
COPY ./ /app
RUN npm install && npm run build

# 실행 단계
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
