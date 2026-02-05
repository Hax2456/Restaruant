package com.restaurant.ordering_system.common;

import lombok.Getter;

@Getter
public enum ResultCode {
    //状态成功码
    SUCCESS(200, "操作成功"),


    //客户端错误 4xx
    BAD_REQUEST(400,"请求参数错误"),
    UNAUTHORIZED(401,"未授权"),
    FORBIDDEN(403,"禁止访问"),
    NOT_FOUND(404,"资源不存在"),
    //服务器错误5xx
    ERROR(500, "操作失败"),
    INTERNAL_SERVER_ERROR(500, "服务器内部错误"),
    
    //业务错误 1xxxx
    CATEGORY_NOT_FOUND(1001, "分类不存在"),
    CATEGORY_NAME_EXISTS(1002, "分类名称已存在"),
    DISH_NOT_FOUND(1003, "菜品不存在"),
    TABLE_NOT_FOUND(1004, "餐桌不存在"),
    ORDER_NOT_FOUND(1005, "订单不存在");

    /* 状态码
     */
    private final int code; 

    /*
    状态描述 */
    private final String message;


    /*构造函数 */
    ResultCode(int code, String message){
        this.code = code;
        this.message = message;
    }
}
