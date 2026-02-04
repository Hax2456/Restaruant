package com.restaurant.ordering_system.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; 

    @Column(name = "order_number", nullable = false, unique = true, length = 50)
    private String orderNumber; 

    @Column(name = "table_id", nullable = false)
    private Long tableId; 

    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount; 

    @Column(nullable = false)
    private Integer status; // 0-待支付 1-已支付 2-已完成 3-已取消


    @Column(length = 500)
    private String remark; 

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
