package com.restaurant.ordering_system.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.restaurant.ordering_system.common.Result;
import com.restaurant.ordering_system.dto.request.OrderRequest;
import com.restaurant.ordering_system.dto.request.StatusRequest;
import com.restaurant.ordering_system.entity.Order;
import com.restaurant.ordering_system.service.OrderService;


/**
 * 订单管理控制器
 * 提供订单的增删改查接口
 */
@RestController
@RequestMapping({"/api/admin/orders", "/api/customer/orders"})
public class OrderController {
    @Autowired
    private OrderService orderService;

    /**
     * 根据ID查询订单
     * GET /api/admin/orders/{id}
     * @param id 订单ID
     * @return 订单对象
     */
    @GetMapping("/{id}")
    public Result<Order> getById(@PathVariable Long id) {
        Order order = orderService.getById(id);
        return Result.success(order);
    }

    /**
     * 根据订单号查询订单
     * GET /api/admin/orders/number/{orderNumber}
     * @param orderNumber 订单号
     * @return 订单对象
     */
    @GetMapping("/number/{orderNumber}")
    public Result<Order> getByOrderNumber(@PathVariable String orderNumber) {
        Order order = orderService.getByOrderNumber(orderNumber);
        return Result.success(order);
    }

    /**
     * 查询所有订单
     * GET /api/admin/orders
     * @return 订单列表
     */
    @GetMapping
    public Result<List<Order>> listAll() {
        List<Order> orders = orderService.listAll();
        return Result.success(orders);
    }

    /**
     * 根据桌号查询订单列表
     * GET /api/admin/orders/table/{tableId}
     * @param tableId 桌号
     * @return 订单列表
     */
    @GetMapping("/table/{tableId}")
    public Result<List<Order>> listByTableId(@PathVariable Long tableId) {
        List<Order> orders = orderService.listByTableId(tableId);
        return Result.success(orders);
    }

    /**
     * 根据状态查询订单列表
     * GET /api/admin/orders/status/{status}
     * @param status 订单状态（0-待支付 1-已支付 2-已完成 3-已取消）
     * @return 订单列表
     */
    @GetMapping("/status/{status}")
    public Result<List<Order>> listByStatus(@PathVariable Integer status) {
        List<Order> orders = orderService.listByStatus(status);
        return Result.success(orders);
    }

    /**
     * 创建订单
     * POST /api/admin/orders
     * @param request 订单请求参数
     * @return 创建的订单对象
     */
    @PostMapping
    public Result<Order> create(@RequestBody OrderRequest request) {
        Order order = orderService.create(request);
        return Result.success(order);
    }

    /**
     * 更新订单状态
     * PATCH /api/admin/orders/{id}/status
     * @param id 订单ID
     * @param request 状态请求参数
     * @return 更新后的订单对象
     */
    @PatchMapping("/{id}/status")
    public Result<Order> updateStatus(@PathVariable Long id, @RequestBody StatusRequest request) {
        Order order = orderService.updateStatus(id, request.getStatus());
        return Result.success(order);
    }

    /**
     * 取消订单
     * PATCH /api/admin/orders/{id}/cancel
     * @param id 订单ID
     * @return 成功消息
     */
    @PatchMapping("/{id}/cancel")
    public Result<Void> cancel(@PathVariable Long id) {
        orderService.cancel(id);
        return Result.success();
    }

    /**
     * 删除订单
     * DELETE /api/admin/orders/{id}
     * @param id 订单ID
     * @return 成功消息
     */
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        orderService.delete(id);
        return Result.success();
    }
}
