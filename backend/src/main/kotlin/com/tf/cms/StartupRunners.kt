package com.tf.cms

//import org.http4k.format.Jackson.auto
import com.tf.cms.common.utils.logger
import com.querydsl.jpa.impl.JPAQueryFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.CommandLineRunner
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

fun main() {
    println("%015d".format(3))
    println("%03d".format(13))
    println("%03d".format(123))
    val k = 10
    val s = "== ${"%05d".format(k)}"
    println(s)
}

@Configuration
class StartupRunners(
    private val jpaQueryFactory: JPAQueryFactory,
) {

    val logger = logger()

    @Bean
    fun test(@Value("\${env}") env:String) = CommandLineRunner(){
        logger.info { "==== env : $env" }
    }
//    val logger = KotlinLogging.logger{}

//    class TestDto(var name:String, var age:Int)
//
//    fun test2(s:String){
//
//    }


//    @Bean
//    fun testMultipleYaml(@Value("\${some.test:no-exists}") p: String, @Value("\${some.test2:no-exists2}") p2: String) = CommandLineRunner(){
//        logger.info{"=== some : ${p}, some2 : ${p2}" }
//    }
//
//    @Bean
//    fun testRetrofit(retrofit: Retrofit) = CommandLineRunner(){
//        val s = retrofit.create(TestUserService::class.java)
//        val response = s.getUsers(10,10).execute()
//        logger.info{"=== retrofit isSuccessful : ${response.isSuccessful}"}
//        logger.info{"=== retrofit response : ${response.body()?.size}"}
//    }

//    @Bean
//    fun testHttp4k(okHttpClient: OkHttpClient) = CommandLineRunner(){
//
//        logger.info { "=== http4k 시작." }
//        val request = org.http4k.core.Request(Method.GET, "http://localhost/api/v1/just-test/users").query("limit", "2")
//        val okHttp = OkHttp(okHttpClient)
//        val response = okHttp(request)
//        logger.info{"=== http4k : ${response.status} :: ${response}"}
//        logger.info{"======================== "}
//
//        val listLens = Body.auto<List<UserDto>>().toLens()
//        val request2 = org.http4k.core.Request(Method.GET, "http://localhost/api/v1/just-test/users").query("limit", "33")
//        val response2 = okHttp(request2)
//        val list = listLens( response2 )
//        logger.info{"=== http4k lens : ${list?.size}"}
//    }
//
////    @Bean
//    fun testHttp4k2(okHttpClient: OkHttpClient) = CommandLineRunner(){
//        logger.info { "==== http test" }
//        val listLens = Body.auto<List<BuildingDto>>().toLens()
//        val request2 = org.http4k.core.Request(Method.GET, "http://sevasa.remote/api/v1/building").query("limit", "33")
//        val okHttp = OkHttp(okHttpClient)
//        val response2 = okHttp(request2)
//        val list = listLens( response2 )
//        logger.info{"=== http4k lens : ${list?.size}"}
//    }
//
////    @Bean
//    fun testHttp4k2_post(okHttpClient: OkHttpClient) = CommandLineRunner(){
//        logger.info { "==== http test" }
//        val listLens = Body.auto<List<BuildingDto>>().toLens()
//        val request2 = org.http4k.core.Request(Method.GET, "http://sevasa.remote/api/v1/building").query("limit", "33")
//        val okHttp = OkHttp(okHttpClient)
//        val response2 = okHttp(request2)
//        val list = listLens( response2 )
//        logger.info{"=== http4k lens : ${list?.size}"}
//    }
//
////    @Bean
//    fun testMybatis(testMapperDao: TestMapperDao) = CommandLineRunner() {
//        logger.info { "==== mybatis test" }
//        val list = testMapperDao.selectBuildings()
//        logger.info { "=== building list : ${list?.size}" }
//    }
}