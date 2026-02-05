package com.restaurant.ordering_system.common;

import lombok.Data;

@Data
public class Result <T> {


    private T data;
    private int code;
    private String msg;


    private Result(){

    }

    private Result(int code, String msg, T data){
        this.code = code;
        this.msg = msg;
        this.data = data; 
    }

    /*
    成功返回，无数据
    */

    public static <T> Result<T> success(){
        return new Result<>(ResultCode.SUCCESS.getCode(),
                            ResultCode.SUCCESS.getMessage(),
                            null
                            );
    }

    /*
    成功返回，有数据
    */

    public static <T> Result<T> success(T data){
        return new Result<>(ResultCode.SUCCESS.getCode(),
                            ResultCode.SUCCESS.getMessage(),
                            data
                            );
    }

    //成功返回，自定义数据
    public static <T> Result<T> success(String msg, T data){
        return new Result<>(
            ResultCode.SUCCESS.getCode(), msg, data
        );
    }


    //失败返回，默认消息
    public static <T> Result<T> error(){
        return new Result<>(
            ResultCode.ERROR.getCode(),
            ResultCode.ERROR.getMessage(),
            null
        );
    }

    //失败返回，自定义
    public static <T> Result<T> error(String msg){
        return new Result<>(
            ResultCode.ERROR.getCode(),
            msg,
            null
        );
    }

    //失败返回，使用枚举
    public static <T> Result<T> error(ResultCode resultCode){
        return new Result<>(
            resultCode.getCode(),
            resultCode.getMessage(),
            null
        );
    }


    //失败返回，枚举+自定义
    public static <T> Result<T> error(ResultCode resultCode, String msg){
        return new Result<>(
            resultCode.getCode(), 
            msg, 
            null
        );
    }


    //自定义返回
    public static <T> Result<T> build(int code, String msg, T data){
        return new Result<>(code, msg, null);
    }

}
