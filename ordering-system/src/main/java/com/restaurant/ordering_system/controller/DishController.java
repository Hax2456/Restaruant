package com.restaurant.ordering_system.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.restaurant.ordering_system.common.Result;
import com.restaurant.ordering_system.dto.request.DishRequest;
import com.restaurant.ordering_system.dto.request.StatusRequest;
import com.restaurant.ordering_system.entity.Dish;
import com.restaurant.ordering_system.service.DishService;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping({"/api/admin/dishes", "/api/customer/dishes"})
public class DishController {
    @Autowired
    private DishService dishService;

    /**
     * 查询所有菜品
     * @return 菜品列表
     */
    @GetMapping
    public Result<List<Dish>> listAll(){
        List<Dish> dishes = dishService.listAll();
        return Result.success(dishes);

    }

    /**
     * 根据ID查询菜品
     * @param id
     * @return
     */
    @GetMapping("/{id}")
    public Result<Dish> getById(@PathVariable Long id) {
        Dish dish = dishService.getById(id);
        return Result.success(dish);
    }
    
    /**
     * 根据分类id查询菜品
     * @param categoryId
     * @return
     */
    @GetMapping("/category/{categoryId}")
    public Result<List<Dish>> listByCategoryId(@PathVariable Long categoryId) {
        List<Dish> dishes = dishService.listByCategoryId(categoryId);
        return Result.success(dishes);
    }
    

    /**
     * 创建菜品
     * @param request
     * @return
     */
    @PostMapping
    public Result<Dish> create(@RequestBody DishRequest request){
        Dish dish = dishService.create(request.getName(), request.getCategoryId(), request.getPrice(), request.getImages(), request.getDescription());
        return Result.success(dish);
    }

    /**
     * 更新菜品
     * @param id
     * @param request
     * @return
     */
    @PutMapping("/{id}")
    public Result<Dish> update(@PathVariable Long id, @RequestBody DishRequest request){
        Dish dish = dishService.update(id, request.getName(), request.getCategoryId(), request.getPrice(), request.getImages(), request.getDescription());
        return Result.success(dish);
    }

    /**
     * 删除菜品
     * @param id
     * @return
     */
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id){
        dishService.delete(id);
        return Result.success();
    }


    /**
     * 启用/停售菜品
     * @param id
     * @param request
     * @return
     */

    @PatchMapping("/{id}/status")
    public Result<Dish> updateStatus(@PathVariable Long id, @RequestBody StatusRequest request){
        Dish dish = dishService.updateStatus(id, request.getStatus());
        return Result.success(dish);
    }
}
