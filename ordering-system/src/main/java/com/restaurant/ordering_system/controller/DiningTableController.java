package com.restaurant.ordering_system.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.restaurant.ordering_system.common.Result;
import com.restaurant.ordering_system.dto.request.DiningTableRequest;
import com.restaurant.ordering_system.dto.request.StatusRequest;
import com.restaurant.ordering_system.entity.DiningTable;
import com.restaurant.ordering_system.service.DiningTableService;

/**
 * 餐桌管理控制器
 * 提供餐桌的增删改查接口
 */
@RestController
@RequestMapping("/api/admin/tables")
public class DiningTableController {

    @Autowired
    private DiningTableService diningTableService;

    /**
     * 查询所有餐桌
     * GET /api/admin/tables
     * @return 餐桌列表
     */
    @GetMapping
    public Result<List<DiningTable>> listAll() {
        List<DiningTable> tables = diningTableService.listAll();
        return Result.success(tables);
    }

    /**
     * 根据ID查询餐桌
     * GET /api/admin/tables/{id}
     * @param id 餐桌ID
     * @return 餐桌对象
     */
    @GetMapping("/{id}")
    public Result<DiningTable> getById(@PathVariable Long id) {
        DiningTable table = diningTableService.getById(id);
        return Result.success(table);
    }

    /**
     * 根据状态查询餐桌列表
     * GET /api/admin/tables/status/{status}
     * @param status 状态（0-维修中，1-空闲，2-使用中）
     * @return 餐桌列表
     */
    @GetMapping("/status/{status}")
    public Result<List<DiningTable>> listByStatus(@PathVariable Integer status) {
        List<DiningTable> tables = diningTableService.listByStatus(status);
        return Result.success(tables);
    }

    /**
     * 创建餐桌
     * POST /api/admin/tables
     * @param request 餐桌请求参数
     * @return 创建的餐桌对象
     */
    @PostMapping
    public Result<DiningTable> create(@RequestBody DiningTableRequest request) {
        DiningTable table = diningTableService.create(request.getTableNumber(), request.getSeats());
        return Result.success(table);
    }

    /**
     * 更新餐桌信息
     * PUT /api/admin/tables/{id}
     * @param id 餐桌ID
     * @param request 餐桌请求参数
     * @return 更新后的餐桌对象
     */
    @PutMapping("/{id}")
    public Result<DiningTable> update(@PathVariable Long id, @RequestBody DiningTableRequest request) {
        DiningTable table = diningTableService.update(id, request.getTableNumber(), request.getSeats());
        return Result.success(table);
    }

    /**
     * 更新餐桌状态
     * PATCH /api/admin/tables/{id}/status
     * @param id 餐桌ID
     * @param request 状态请求参数
     * @return 更新后的餐桌对象
     */
    @PatchMapping("/{id}/status")
    public Result<DiningTable> updateStatus(@PathVariable Long id, @RequestBody StatusRequest request) {
        DiningTable table = diningTableService.updateStatus(id, request.getStatus());
        return Result.success(table);
    }

    /**
     * 删除餐桌
     * DELETE /api/admin/tables/{id}
     * @param id 餐桌ID
     * @return 成功消息
     */
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        diningTableService.delete(id);
        return Result.success();
    }
}
