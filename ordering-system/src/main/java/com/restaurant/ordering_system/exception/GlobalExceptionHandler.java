package com.restaurant.ordering_system.exception;

import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.restaurant.ordering_system.common.Result;

/**
 * 全局异常处理器
 * 统一拦截所有Controller抛出的异常
 * 返回标准的Result格式
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * 处理业务异常
     * @param e BusinessException
     * @return 错误信息
     */
    @ExceptionHandler(BusinessException.class)
    public Result<Void> handleBusinessException(BusinessException e) {
        // 使用 build 方法，因为 BusinessException 有自定义错误码
        Integer code = e.getCode() != null ? e.getCode() : 500;
        return Result.build(code, e.getMessage(), null);
    }

    /**
     * 处理所有未捕获的异常
     * @param e Exception
     * @return 错误信息
     */
    @ExceptionHandler(Exception.class)
    public Result<Void> handleException(Exception e) {
        e.printStackTrace(); // 打印异常堆栈，方便调试
        return Result.build(500, "系统内部错误：" + e.getMessage(), null);
    }
}
