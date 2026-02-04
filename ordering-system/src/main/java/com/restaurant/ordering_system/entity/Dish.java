package com.restaurant.ordering_system.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "dish")
public class Dish {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "category_id", nullable = false)
    private Long categoryId; 


    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price; 

    @Column(length = 255)
    private String images; 


    @Column(length = 500)
    private String description; 


    @Column(nullable = false)
    private Integer status; //0-停售， 1-在售

    @Column(name = "create_time", nullable = false, updatable = false)
    private LocalDateTime createTime; 

    @Column(name = "update_time", nullable = false)
    private LocalDateTime upDateTime;


    @PrePersist
    protected void onCreate(){
        createTime = LocalDateTime.now();
        upDateTime = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate(){
        upDateTime = LocalDateTime.now();
    }
}
