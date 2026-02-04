package com.restaurant.ordering_system.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import jakarta.persistence.Id;
import lombok.Data;


@Data
@Entity
@Table(name = "dining_table")
public class DiningTable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(name = "table_number", nullable = false, unique = true, length = 20)
    private String tableNumber;

    @Column(nullable = false)
    private Integer seats;

    @Column(nullable = false)
    private Integer status;

    @Column(name = "qr_code", unique = true, length = 100)
    private String qrCode;

    @Column(name = "create_time", nullable = false, updatable = false)
    private LocalDateTime createTime;

    @Column(name = "update_time", nullable = false)
    private LocalDateTime updateTime;


    @PrePersist
    protected void onCreate(){
        createTime = LocalDateTime.now();
        updateTime = LocalDateTime.now();
    }


    @PreUpdate
    protected void onUpdate(){
        updateTime = LocalDateTime.now();
    }
    
}
