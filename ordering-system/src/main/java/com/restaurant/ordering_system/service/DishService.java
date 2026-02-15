package com.restaurant.ordering_system.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.restaurant.ordering_system.entity.Dish;
import com.restaurant.ordering_system.exception.BusinessException;
import com.restaurant.ordering_system.repository.CategoryRepository;
import com.restaurant.ordering_system.repository.DishRepository;
import com.restaurant.ordering_system.repository.OrderItemRepository;

/**
 * 菜品业务逻辑层
 * 处理菜品相关的业务操作
 */
@Service
public class DishService {
    @Autowired
    private DishRepository dishRepository; 

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;


    /**
     * 创建菜品
     * @param name 菜品名称
     * @param categoryId 分类Id
     * @param price 价格
     * @param images   图片URL
     * @param description 描述
     * @return 创建的菜品对象
     */
    @Transactional
    public Dish create(String name, Long categoryId, BigDecimal price, String images, String description){
        //1. 验证菜品名称不能为空
        if (name == null || name.trim().isEmpty()){
            throw new BusinessException("菜品名称不能为空");
        }
        //2. 检查菜品名称是否已经存在
        if (dishRepository.existsByName(name)){
            throw new BusinessException("菜品名称已经存在");

        }

        //3. 检查分类id不能为空
        if (categoryId == null){
            throw new BusinessException("分类ID不能为空");

        }
        //4. 检查分类是否存在
        if (!categoryRepository.existsById(categoryId)){
            throw new BusinessException("分类不存在");
        }
        //5. 验证价格必须大于0
        if (price == null || price.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessException("价格必须大于0");
        }

        Dish dish = new Dish();
        dish.setName(name);
        dish.setCategoryId(categoryId);
        dish.setPrice(price);
        dish.setImages(images);
        dish.setDescription(description);
        dish.setStatus(1);// 默认启用

        //7. 保存到数据苦
        return dishRepository.save(dish);

    }
    /**
     * 
     * @param id 菜品id
     * @param name 菜品名称
     * @param categoryId 分类id
     * @param price 价格
     * @param images 图片url
     * @param description 描述
     * @return 更新后的菜品名称
     */
    @Transactional
    public Dish update(Long id, String name, 
                        Long categoryId, 
                        BigDecimal price, 
                        String images, String description){
        Dish dish = dishRepository.findById(id)
                        .orElseThrow(() -> new BusinessException("菜品不存在"));

        //2. 验证名称不能为空
        if (name == null || name.trim().isEmpty()){
            throw new BusinessException("菜品名称不能为空");

        }
        //3. 检查次啊品名称是否重复 (排除自己)
        if (dishRepository.existsByNameAndIdNot(name, id)){
            throw new BusinessException("菜品名称已经存在");

        }
        //4. 验证分类id 不能为空
        if (categoryId == null) {
            throw new BusinessException("分类ID不能为空");

        }

        //5. 检查分类是否存在
        if (!categoryRepository.existsById(categoryId)){
            throw new BusinessException("分类不存在");
        }

        //6. 验证价格必须大于0
        if (price == null || price.compareTo(BigDecimal.ZERO) <= 0){
            throw new BusinessException("价格必须大于0");
        }

        //7. 更新菜品信息
        dish.setName(name);
        dish.setCategoryId(categoryId);
        dish.setPrice(price);
        dish.setImages(images);
        dish.setDescription(description);

        //8 保存更新
        return dishRepository.save(dish);
    }

    /**
     * 删除菜品
     * @param id 菜品id
     */
    @Transactional
    public void delete(Long id){
        //1 查询菜品是否存在
        if (!dishRepository.existsById(id)){
            throw new BusinessException("菜品不存在");

        }

        //2. 检查是否有关联的订单项
        long count = orderItemRepository.countByDishId(id);
        if (count > 0){
            throw new BusinessException("该菜品已有订单");
        }

        //3. 删除菜品
        dishRepository.deleteById(id);
    }

    /**
     * 根据id查询菜品
     * @param id 菜品id
     * @return
     */
    public Dish getById(Long id){
        return dishRepository.findById(id)
                .orElseThrow(() -> new BusinessException("菜品不存在"));
    }

    /**
     * 根据分类id查询菜品列表
     * @param categoryId
     * @return 菜品列表
     */
    public List<Dish> listByCategoryId(Long categoryId){
        //返回在售的菜品
        return dishRepository.findByCategoryIdAndStatus(categoryId, 1);
    }

    /**
     * 查询所有在售菜品
     * 用于顾客短菜品展示
     * @return 在售菜品列表
     */
    public List<Dish> listByStatus(){
        return dishRepository.findByStatus(1);
    }

    /**
     * 查询所有菜品（包括停售）
     * 用于后台管理
     * @return 所有菜品列表
     */
    public List<Dish> listAll(){
        return dishRepository.findAll();
    }


    @Transactional
    public Dish updateStatus(Long id, Integer status){
        //1. 查询菜品是否存在
        Dish dish = dishRepository.findById(id)
                    .orElseThrow(() -> new BusinessException("菜品不存在"));
        // 2. 验证状态值
        if (status == null || (status != 0 && status != 1)) {
            throw new BusinessException("状态值只能是0或1");
        }

        //3. 更新状态
        dish.setStatus(status);

        //4. 保存更新
        return dishRepository.save(dish);
    }
}
