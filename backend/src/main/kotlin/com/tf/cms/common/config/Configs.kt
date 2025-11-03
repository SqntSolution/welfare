package com.tf.cms.common.config

import com.querydsl.jpa.impl.JPAQueryFactory
import jakarta.persistence.EntityManager
import jakarta.persistence.PersistenceContext
import okhttp3.OkHttpClient
import org.apache.ibatis.session.SqlSessionFactory
import org.mybatis.spring.SqlSessionFactoryBean
import org.mybatis.spring.annotation.MapperScan
import org.springframework.context.ApplicationContext
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.transaction.annotation.EnableTransactionManagement
import org.springframework.validation.beanvalidation.MethodValidationPostProcessor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit
import javax.sql.DataSource


@Configuration
class Beans {
    @Bean
    fun  okHttpClient() : OkHttpClient {
        return OkHttpClient.Builder().connectTimeout(10, TimeUnit.SECONDS)
            .writeTimeout(60, TimeUnit.SECONDS)
            .readTimeout(60, TimeUnit.SECONDS)
            .build();
    }


    @Bean
    fun  retrofit(client:OkHttpClient ): Retrofit {
        val baseURL = "http://localhost"
        return Retrofit.Builder().baseUrl(baseURL)
            .addConverterFactory(GsonConverterFactory.create())
            .client(client)
            .build();
    }

    @Bean
    fun methodValidationPostProcessor(): MethodValidationPostProcessor {
        return MethodValidationPostProcessor()
    }

}


@Configuration
@EnableTransactionManagement
@MapperScan("com.tf")
class MybatisConfig {
    @Bean
    fun sqlSessionFactoryBean(dataSource: DataSource, ctx: ApplicationContext): SqlSessionFactory? {
        val factory = SqlSessionFactoryBean()
        factory.setDataSource(dataSource)
        factory.setConfigLocation(ctx.getResource("classpath:/mybatis/sqlmap-config.xml"))
        factory.setMapperLocations(*ctx.getResources("classpath:mybatis/mappers/**/*.xml"))
        return factory.getObject()
    }
}


@Configuration
class QuerydslConfig {
    @PersistenceContext
    private lateinit var entityManager: EntityManager
    @Bean
    fun jpaQueryFactory(): JPAQueryFactory {
        return JPAQueryFactory(entityManager )
    }
}