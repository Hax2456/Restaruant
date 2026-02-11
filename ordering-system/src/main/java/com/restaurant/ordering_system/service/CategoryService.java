package com.restaurant.ordering_system.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.restaurant.ordering_system.entity.Category;
import com.restaurant.ordering_system.exception.BusinessException;
import com.restaurant.ordering_system.repository.CategoryRepository;
import com.restaurant.ordering_system.repository.DishRepository;

import jakarta.transaction.Transactional;

/**
 * 分类服务器
 */
@Service
public class CategoryService {
    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private DishRepository dishRepository;


    /**
     * 创建分类
     * @param name
     * @param sort 
     * @return 
     */

    @Transactional
    public Category create(String name, Integer sort){
        //1。验证名称不为空
        if(name == null || name.trim().isEmpty()){
            throw new BusinessException("分类名称不能为空");
        }
        //2. 检查名称是否重复
        if (categoryRepository.existsByName(name)){
            throw new BusinessException("分类名称已存在");
        }
        //3. 创建category 对象设置默认值 sort 0, status 1 
        Category category = new Category();
        category.setName(name);
        category.setSort(sort != null ? sort : 0);
        category.setStatus(1);

        //保存数据库
        return categoryRepository.save(category);
    }


    /**
     * 更新分类
     * @param id 分类ID
     * @param name 新名称
     * @param sort 新排序号
     * @return 更新后的分类对象
     */

    @Transactional
    public Category update(Long id, String name, Integer sort){
        //1, 查询分类是否存在
        Category category = categoryRepository.
                            findById(id).
                            orElseThrow(()-> new BusinessException("分类名称不存在") );

        //2. 验证名称
        if (name == null || name.trim().isEmpty()){
            throw new BusinessException("分类名称不能为空");
        }

        //3. 如果修改了名称， 检查新名词是否与其他分类重复
        if (!category.getName().equals(name)){
            if (categoryRepository.existsByNameAndIdNot(name, id)){
                throw new BusinessException("分类名称已经存在");
            }
        }

        //4. 更新字段
        category.setName(name);
        category.setSort(sort != null ? sort: 0);

        return categoryRepository.save(category);
    }


    /**
     * 删除分类
     * @param id 分类ID
     */

    @Transactional
    public void delete(Long id){
        //1. 检查分类存在
        Category category = categoryRepository.findById(id).
                            orElseThrow(()-> new BusinessException("分类不存在"));
        //2，检查分类下是否有菜品
        long dishCount = dishRepository.countByCategoryId(id);
        if (dishCount > 0){
            throw new BusinessException("该分类下有菜品，无法删除");
        }
        //3. 删除分类
        categoryRepository.deleteById(id);

    }

    /**
     * 根据id查询分类
     * 
     */

    public Category getById(Long id){
        return categoryRepository.findById(id)
                                    .orElseThrow(()-> new BusinessException("分类不存在"));
    }

    /**
     * 查询所有启用的分类(按照排序好生序)
     * @return 分类列表
     * 
     */
    public List<Category> list(){
        return categoryRepository.findByStatusOrderBySortAsc(1);
    }


    /**
     * 查询所有分类
     * @return 分类列表
     */
    public List<Category> listAll(){
        return categoryRepository.findAll();
    }


    /**
     * 启用/禁用分类
     * @param id 分类id
     * @param status 状态 0 1 
     * @return 更新后的分类对象
     */

    @Transactional
    public Category updateStatus(Long id, Integer status){
        //1. 查询分类是否存在
        Category category = categoryRepository.findById(id)
                            .orElseThrow(()-> new BusinessException("分类不存在"));
        //2. 验证status值
        if (status == null || (status != 0 && status != 1)) {
            throw new BusinessException("状态值只能是0或1");
        }

        //3. 更新状态
        category.setStatus(status);
        
        //4. 保存返回
        return categoryRepository.save(category);
        
    }
}
