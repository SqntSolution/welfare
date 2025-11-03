# 1단계: gradlew 빌드
FROM eclipse-temurin:17-jdk-alpine AS builder

WORKDIR /app

# 1 Wrapper 관련 파일 먼저 복사 (캐싱 유지)
COPY gradlew settings.gradle.kts build.gradle.kts ./
COPY gradle ./gradle

# 2️ gradle wrapper 실행 권한 부여
RUN chmod +x ./gradlew

# profile 인자 전달
ARG PROFILE=test

# 3️ 의존성 캐시 (src 없이 먼저 실행 → 캐싱 효과 극대화)
RUN ./gradlew dependencies --no-daemon || return 0

# 4️ 그 다음 소스 코드 복사
COPY src ./src

# 5️ JAR 빌드
RUN ./gradlew bootJar --no-daemon -Pprofile=$PROFILE

# 2단계: 실행용 이미지
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app

COPY --from=builder /app/build/libs/*.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]