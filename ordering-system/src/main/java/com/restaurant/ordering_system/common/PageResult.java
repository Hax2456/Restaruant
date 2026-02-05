package com.restaurant.ordering_system.common;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PageResult <T>{
    
    //当前页数据
    private List<T> records;


    //总记录数
    private long total;


    //每页大小
    private long size; 

    //当前页吗
    private long current;

    //总页数
    private long pages;


    //构造分页结果

    public static <T> PageResult<T> of(List<T> records, long total, long size, long current){
        PageResult<T> pageResult = new PageResult<>();
        pageResult.setRecords(records);
        pageResult.setTotal(total);
        pageResult.setSize(size);
        pageResult.setCurrent(current);
        pageResult.setPages((total + size -1 )/ size);
        return pageResult;
    }
}
