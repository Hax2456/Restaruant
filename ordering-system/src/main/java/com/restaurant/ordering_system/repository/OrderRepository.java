package com.restaurant.ordering_system.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.restaurant.ordering_system.entity.Order;
import java.util.List;


@Repository
public interface OrderRepository extends JpaRepository<Order, Long>{
    /**
     * 根据订单号查询订单
     * @param orderNumber
     * @return
     */
    Optional<Order> findByOrderNumber(String orderNumber);

    /**
     * 检查订单号是否存在
     * @param orderNumber
     * @return
     */
    boolean existsByOrderNumber(String orderNumber);

    /**
     * 根据桌号查询订单列表
     * @param tableId
     * @return
     */
    List<Order> findByTableId(Long tableId);

    /**
     * 根据状态查询订单列表
     * @param status
     * @return
     */
    List<Order> findByStatus(Integer status);

    /**
     * 根据桌号和状态查询订单
     * @param tableId
     * @param status
     * @return
     */
    List<Order> findByTableIdAndStatus(Long tableId, Integer status);


    
}
