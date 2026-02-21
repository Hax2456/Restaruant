package com.restaurant.ordering_system.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.restaurant.ordering_system.entity.OrderItem;


@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long>{
    /**
     * 统计指定菜品的订单项数量
     * 用于删除菜品前检查是否有订单记录
     * @param dishId 菜品ID
     * @return 订单项数量
     */
    long countByDishId(Long dishId);

    /**
     * 根据订单ID查询订单项列表
     * @param orderId 订单ID
     * @return 订单项列表
     */
    List<OrderItem> findByOrderId(Long orderId);

    /**
     * 根据订单ID删除订单项
     * @param orderId 订单ID
     */
    void deleteByOrderId(Long orderId);

}
