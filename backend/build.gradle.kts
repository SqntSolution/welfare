import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
	val kotlinVersion = "1.9.20"  // "1.9.20"
	id("org.springframework.boot") version "3.1.5"
	id("io.spring.dependency-management") version "1.1.3"
	kotlin("jvm") version kotlinVersion
	kotlin("plugin.spring") version kotlinVersion
	kotlin("plugin.jpa") version kotlinVersion
//	id("org.jetbrains.kotlin.plugin.spring") version "1.9.20"
	kotlin("kapt") version kotlinVersion
	kotlin("plugin.noarg") version kotlinVersion
	application
}

group = "tf"
version = "1.0.0-SNAPSHOT"

val queryDslVersion = "5.0.0"

val theProfile =  if (project.hasProperty("profile")) {
	project.property("profile").toString()
} else {
	"local"
}

java {
	sourceCompatibility = JavaVersion.VERSION_17
}

sourceSets {
	main {
//		java.srcDirs("src/main/java")
		resources {
			srcDirs(listOf("src/main/resources", "src/main/resources-$theProfile"))
		}
	}
}

noArg {
	annotation("com.tf.cms.common.utils.DefaultConstructor")
}

application {
	mainClass.set("com.tf.cms.CmsApplicationKt")
//	mainClass = "com.tf.cms.CosmaxApplicationKt"
}

tasks.bootJar {
	mainClass.set("com.tf.cms.CmsApplicationKt")
//	mainClass = "com.tf.cms.CosmaxApplicationKt"
	archiveFileName.set("app-cms-${theProfile}.jar")
	duplicatesStrategy=DuplicatesStrategy.INCLUDE
}

tasks.processResources {
	duplicatesStrategy=DuplicatesStrategy.INCLUDE

}

configurations {
	compileOnly {
		extendsFrom(configurations.annotationProcessor.get())
	}
}

repositories {
	mavenCentral()
}

extra["sentryVersion"] = "6.28.0"
extra["springCloudVersion"] = "2022.0.4"

dependencies {
//	implementation("org.springframework.boot:spring-boot-starter-actuator")
//	implementation("org.springframework.boot:spring-boot-starter-amqp")
	implementation("org.springframework.boot:spring-boot-starter-data-jpa")
	implementation("org.springframework.boot:spring-boot-starter-mail")
	implementation("org.springframework.boot:spring-boot-starter-security")
	implementation("org.springframework.boot:spring-boot-starter-thymeleaf")
	implementation("org.springframework.boot:spring-boot-starter-validation")
	implementation("org.springframework.boot:spring-boot-starter-web")
	implementation("org.springframework.boot:spring-boot-starter-data-ldap")
//	implementation("org.springframework.boot:spring-boot-starter-websocket")
	implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
//	implementation("io.sentry:sentry-spring-boot-starter-jakarta")
	implementation("org.jetbrains.kotlin:kotlin-reflect")
//	implementation("org.springframework.cloud:spring-cloud-starter-circuitbreaker-resilience4j")
	implementation("org.thymeleaf.extras:thymeleaf-extras-springsecurity6")
	implementation("org.springframework.boot:spring-boot-starter-cache")

	implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core")

//	implementation("ch.qos.logback:logback-classic:1.4.11")
	implementation("io.github.microutils:kotlin-logging-jvm:3.0.5")

//	implementation("io.springfox:springfox-swagger-ui:3.0.0")
//	implementation("io.springfox:springfox-boot-starter:3.0.0")

	implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:2.3.0")

	implementation("io.jsonwebtoken:jjwt-api:0.12.6")
	runtimeOnly("io.jsonwebtoken:jjwt-impl:0.12.6")
	runtimeOnly("io.jsonwebtoken:jjwt-jackson:0.12.6")

	implementation("com.querydsl:querydsl-jpa:${queryDslVersion}:jakarta")
	kapt("com.querydsl:querydsl-apt:${queryDslVersion}:jakarta")
//	annotationProcessor("com.querydsl:querydsl-apt:${queryDslVersion}:jakarta")
	// => kapt 대신에 annotationProcessor 을 쓰면 안되는거 같기도 하고..

	implementation("com.squareup.okhttp3:okhttp:4.12.0")
//	implementation("com.github.kittinunf.fuel:fuel:3.0.0-alpha1")

	implementation("com.squareup.retrofit2:retrofit:2.9.0")
	implementation("com.squareup.retrofit2:converter-gson:2.9.0")

	implementation(platform("org.http4k:http4k-bom:5.10.3.0"))
	implementation("org.http4k:http4k-core")
	implementation("org.http4k:http4k-client-okhttp")
	implementation("org.http4k:http4k-format-jackson")

	implementation("org.mapstruct:mapstruct:1.5.5.Final")
	implementation("org.mapstruct:mapstruct-processor:1.5.5.Final")

	implementation("org.apache.poi:poi:5.2.3")
	implementation("org.apache.poi:poi-ooxml:5.2.3")

	implementation("org.apache.pdfbox:pdfbox:2.0.25")
	implementation("net.coobird:thumbnailator:0.4.14")

	implementation("com.google.guava:guava:32.1.3-jre")

	implementation("org.bouncycastle:bcprov-jdk18on:1.77")

	// https://mvnrepository.com/artifact/com.github.ben-manes.caffeine/caffeine
	implementation("com.github.ben-manes.caffeine:caffeine:3.1.8")

	compileOnly("org.projectlombok:lombok")
	developmentOnly("org.springframework.boot:spring-boot-devtools")
//	runtimeOnly("com.mysql:mysql-connector-j")
	runtimeOnly("org.mariadb.jdbc:mariadb-java-client")
	annotationProcessor("org.springframework.boot:spring-boot-configuration-processor")
//	annotationProcessor("org.projectlombok:lombok")

	implementation("org.mybatis.spring.boot:mybatis-spring-boot-starter:3.0.3")

	implementation("org.springframework.boot:spring-boot-starter-data-ldap")

	testImplementation("org.springframework.boot:spring-boot-starter-test")
	testImplementation("org.springframework.amqp:spring-rabbit-test")
	testImplementation("org.springframework.security:spring-security-test")
}

dependencyManagement {
	imports {
		mavenBom("io.sentry:sentry-bom:${property("sentryVersion")}")
		mavenBom("org.springframework.cloud:spring-cloud-dependencies:${property("springCloudVersion")}")
	}
}

tasks.withType<KotlinCompile> {
	kotlinOptions {
		freeCompilerArgs += "-Xjsr305=strict"
		jvmTarget = "17"
	}
}

tasks.withType<Test> {
	useJUnitPlatform()
}


allOpen {
	annotation("jakarta.persistence.Entity")
	annotation("jakarta.persistence.MappedSuperclass")
	annotation("jakarta.persistence.Embeddable")
}
