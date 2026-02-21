package com.restaurant.ordering_system.dto.request;

import java.util.List;

import lombok.Data;

/**
 * 订单请求DTO
 */
@Data
public class OrderRequest {
    
    /**
     * 桌号
     */
    private Long tableId;

    /**
     * 订单备注
     */
    private String remark;

    /**
     * 订单项列表
     */
    private List<OrderItemRequest> items;

    /**
     * 订单项请求DTO（内部类）
     */
    @Data
    public static class OrderItemRequest {
        /**
         * 菜品ID
         */
        private Long dishId;

        /**
         * 数量
         */
        private Integer quantity;

        /**
         * 订单项备注
         */
        private String remark;
    }
}
