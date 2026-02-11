package com.restaurant.ordering_system.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.restaurant.ordering_system.entity.Dish;

@Repository
public interface DishRepository extends JpaRepository<Dish, Long> {
    /**
     * 统计制定分类下的菜品数量
     * @param categoryId
     * @return 菜品数量
     */

    long countByCategoryId(Long categoryId);
}
