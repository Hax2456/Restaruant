package com.restaurant.ordering_system.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

/**
 * 跨域配置
 * 允许前端（React）访问后端API
 */
@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();

        // 允许前端地址（开发环境）
        config.addAllowedOrigin("http://localhost:5173"); // Vite顾客端
        config.addAllowedOrigin("http://localhost:5174"); // Vite管理端
        config.addAllowedOrigin("http://localhost:3000"); // 顾客端
        config.addAllowedOrigin("http://localhost:3001"); // 管理端

        // 允许所有请求头
        config.addAllowedHeader("*");

        // 允许所有请求方法（GET/POST/PUT/DELETE/PATCH）
        config.addAllowedMethod("*");

        // 允许携带Cookie（如果后续需要Session）
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // 对所有API路径生效
        source.registerCorsConfiguration("/api/**", config);

        return new CorsFilter(source);
    }
}
