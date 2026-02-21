package com.restaurant.ordering_system.dto.request;

import lombok.Data;

/**
 * 餐桌请求DTO
 * 用于创建和更新餐桌
 */
@Data
public class DiningTableRequest {

    /**
     * 桌号（如 A01、B02）
     */
    private String tableNumber;

    /**
     * 座位数
     */
    private Integer seats;
}
