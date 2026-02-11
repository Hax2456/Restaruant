package com.restaurant.ordering_system.dto.request;

import lombok.Data;


/**
 * 分类请求DTO
 * 用于创建和更新分类
 */
@Data
public class CategoryRequest {
    private String name;
    private Integer sort; 
}
