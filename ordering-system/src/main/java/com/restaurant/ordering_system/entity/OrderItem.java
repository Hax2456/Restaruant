package com.restaurant.ordering_system.entity;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.*;

@Data
@Entity
@Table(name = "order_item")
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "order_id", nullable = false)
    private Long orderId; 

    @Column(name = "dish_id", nullable = false)
    private Long dishId;

    @Column(name = "dish_name", nullable = false, length = 100)
    private String dishName; 

    @Column(name = "dish_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal dishPrice;

    @Column(nullable = false)
    private Integer quantity;


    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotal; 

    @Column(name = "create_time", nullable = false, updatable = false)
    private LocalDateTime createTime;
    
    @PrePersist
    protected void onCreate() {
        createTime = LocalDateTime.now();
    }
}
