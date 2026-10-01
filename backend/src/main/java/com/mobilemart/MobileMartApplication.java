package com.mobilemart;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class MobileMartApplication {

    public static void main(String[] args) {
        SpringApplication.run(MobileMartApplication.class, args);
    }
}
