package com.tf.cms.test

import java.io.File
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder

fun main() {
//    println("== LocalDateTime : ${LocalDateTime.now()}")
//    println("== ZonedDateTime : ${ZonedDateTime.now()}")
//    println("== ZonedDateTime : ${ZonedDateTime.now(ZoneId.of("UTC"))}")
//    test100()
    var file : String
    file = "d:/old-files.txt"
    val oldMap = readProdOldFiles(file)
    println("============== ")
    file = "d:/new-files.txt"
    val newMap = readProdOldFiles(file)
    println("============== ")
    showDiff(oldMap, newMap)
}

fun showDiff(oldMap: MutableMap<String, MutableSet<String>>, newMap: MutableMap<String, MutableSet<String>>) {
    // old에는 있는데, new에는 없는건들
    println("=== old에는 있는데, new에는 없는건들")
    oldMap.forEach{
        print("=== ${it.key} => ")
        val diffs = oldMap[it.key]!! - (newMap[it.key] ?: mutableSetOf())
        println(diffs)
    }
    println("=== new에는 있는데, old에는 없는건들")
    newMap.forEach{
        print("=== ${it.key} => ")
        val diffs = newMap[it.key]!! - (oldMap[it.key] ?: mutableSetOf())
        println(diffs)
    }
}

fun readProdOldFiles(file:String): MutableMap<String, MutableSet<String>> {

//    File(file).readLines().filter { !it.startsWith("drw") && !it.startsWith("-rw")}
//        .forEach { println(it) }

//    println("=======")
    val map = mutableMapOf<String, MutableSet<String>>()
    var key = ""
    File(file).readLines().filter {
            !it.startsWith("total ") && !it.isBlank() && !it.startsWith("SQNT@") && !it.startsWith("drwx") }
        .filter { !it.startsWith("drwx") }
        .filter { !(it.startsWith("./") && it.indexOf("/",2)<0 )}
        .map {
            if(it.lastIndexOf(" ")>0){
                it.substring(it.lastIndexOf(" ")+1)
            }else{
                if(it.endsWith(":") && it.startsWith("./")){
                    "===" + it
                }else{
                    "뭬냐 : $it"
                }
            }
        }
        .filter { !it.startsWith("뭬냐") }
        .forEach {
//            println(it)
            if(it.startsWith("===")){
                key = it.substring(3)
                map[key] = mutableSetOf<String>()
            }else{
                map[key]!!.add(it)
            }
        }

        map.forEach { k,v -> println("$k : ${v.size}")  }
        return map
}

fun test100() {
    data class A(val a: Int, val b: String? = null) {
        fun doSome() {
            println("== a : $a")
        }

    }

    A(-10).takeIf { it.a>0 }.let { it?.doSome() }
}


class JustTest {

    class Cake(val flavor: String) {
        fun printCake() {
            println(flavor)
        }

        companion object {
            fun strawberry(): Cake {
                return Cake("딸기")
            }

            fun cheese(): Cake {
                return Cake("치즈")
            }
        }
    }

    //    @Test
    fun test() {
        val factory: Cake.Companion = Cake  // 익명의 companion object를 가리킴
        Cake.strawberry().printCake()
        val factory2: Cake.Companion = Cake    // Cake는 companion object, Cake()는 instance!
        Cake.cheese().printCake()
    }

    //    @Test
    fun test2() {
        println("hong1 : " + BCryptPasswordEncoder().encode("savasava!123"))
        println("hong2 : " + BCryptPasswordEncoder().encode("hong"))
        println("hong3 : " + BCryptPasswordEncoder().encode("hong"))
        var s: String? = "9975"
        val k = s?.toInt()
        println("=========== $k")

    }
}

