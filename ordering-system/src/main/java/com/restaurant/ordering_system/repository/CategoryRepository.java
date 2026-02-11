package com.restaurant.ordering_system.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.restaurant.ordering_system.entity.Category;


@Repository
public interface CategoryRepository extends JpaRepository<Category,Long>{
    /**
     * 根据名称检查分类是否存在
     * @param name 分类名称
     * @return 是否存在
     */
    boolean existsByName(String name);

    /**
     * 根据名称和ID查询（用于更新时检查名称是否重复，排除自己）
     * @param name 分类名称
     * @param id 要排除的ID
     * @return 是否存在
     */
    boolean existsByNameAndIdNot(String name, Long id);

    /**
     * 根据状态查询分类列表
     * @param status 状态 0 no 1 on 
     * @return 分类列表
     */
    List<Category> findByStatus(Integer status);
    

    /** 
     * 
     *     根据状态查询并按排序字段生序排列
    @parms status 状态
    @return 排序后的分类列表
    */

    List<Category> findByStatusOrderBySortAsc(Integer status);


} 
