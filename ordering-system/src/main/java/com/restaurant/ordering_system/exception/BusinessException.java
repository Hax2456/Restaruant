package com.restaurant.ordering_system.exception;

/**
 * 业务异常类
 * 用于service层抛出业务逻辑相关的异常
 */
public class BusinessException extends RuntimeException{
    /**
     * 错误码
     * 
     */

    private Integer code; 

    /**
     * 构造函数
     * @param message 错误消息
     */

    public BusinessException(String message){
        super(message);
        this.code = 500; 
    }

    /**
     * 构造函数 包含错误码和消息
     * @param code 
     * @param message
     */

    public BusinessException(Integer code, String message){
        super(message);
        this.code = code; 
    }

    /**
     * 包含错消息和原始异常
     * @param message
     * @param cause 
     * 
     */

    public BusinessException(String message, Throwable cause){
        super(message, cause);
        this.code = 500; 
    }

    /**
     * 获取错误码
     */

    public Integer getCode(){
        return code; 
    }
}
