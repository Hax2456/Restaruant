package com.restaurant.ordering_system.dto.request;

import java.math.BigDecimal;

import lombok.Data;

/**
 * 菜品请求DTO
 * 用于接收前端提交的菜品数据（创建和更新）
 */
@Data
public class DishRequest {
    
    /**
     * 菜品名称
     */
    private String name;
    
    /**
     * 分类ID
     */
    private Long categoryId;
    
    /**
     * 价格
     */
    private BigDecimal price;
    
    /**
     * 图片URL
     */
    private String images;
    
    /**
     * 菜品描述
     */
    private String description;
}
