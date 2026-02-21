package com.restaurant.ordering_system.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.restaurant.ordering_system.entity.DiningTable;


@Repository
public interface DiningTableRepository extends JpaRepository<DiningTable, Long>{

    /**
     * 根据桌号查询餐桌
     * @param tableNumber 桌号
     * @return 餐桌
     */
    Optional<DiningTable> findByTableNumber(String tableNumber);

    /**
     * 检查桌号是否存在
     * @param tableNumber 桌号
     * @return 是否存在
     */
    boolean existsByTableNumber(String tableNumber);

    /**
     * 检查桌号是否存在（排除指定ID）
     * @param tableNumber 桌号
     * @param id 要排除的ID
     * @return 是否存在
     */
    boolean existsByTableNumberAndIdNot(String tableNumber, Long id);

    /**
     * 根据状态查询餐桌列表
     * @param status 状态（0-维修中，1-空闲，2-使用中）
     * @return 餐桌列表
     */
    List<DiningTable> findByStatus(Integer status);
}
