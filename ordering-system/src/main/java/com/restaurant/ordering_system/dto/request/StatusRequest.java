package com.restaurant.ordering_system.dto.request;

import lombok.Data;

@Data
public class StatusRequest {

    /**
     * 状态值
     * 0 - 禁用
     * 1 - 启用
     */
    private Integer status; 

}
