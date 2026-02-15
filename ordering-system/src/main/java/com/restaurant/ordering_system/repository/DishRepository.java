package com.restaurant.ordering_system.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.restaurant.ordering_system.entity.Dish;
import java.util.List;


@Repository
public interface DishRepository extends JpaRepository<Dish, Long> {
    /**
     * 统计制定分类下的菜品数量
     * @param categoryId
     * @return 菜品数量
     */

    long countByCategoryId(Long categoryId);


    /**
     * 检查菜品名称是否存在
     * @param name 菜品名称
     * @return true-存在， false 不存在
     * 
     */

    boolean existsByName(String name);

    /**
     * 检查菜品名称是否存在 （排除指定ID）
     * @param name 菜品名称
     * @param id 菜品id
     * @return true 存在重复， false 不存在重复
     */

    boolean existsByNameAndIdNot(String name, Long id);

    /**
     * 根据分类Id 查询菜品
     * @param categoryId 分类id
     * @return 菜品列表
     */

    List<Dish> findByCategoryId(Long categoryId);


    /**
     * 根据状态查询菜品
     * @param status 状态（0-停售，1-在售）
     * @return 菜品列表
     */

    List<Dish> findByStatus(Integer status);


    /**
     * 根据分类ID和状态查询菜品
     * @param categoryId 分类ID
     * @param status 状态（0-停售，1-在售）
     * @return 菜品列表
     */
    List<Dish> findByCategoryIdAndStatus(Long categoryId, Integer status);
}
