package com.smartfashion;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication // Enables Spring Boot auto-configuration
public class SmartFashionApplication {

    public static void main(String[] args) {
        // Starts the server when you run: mvn spring-boot:run
        SpringApplication.run(SmartFashionApplication.class, args);
    }
}
