package com.restaurant.ordering_system.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.restaurant.ordering_system.common.Result;
import com.restaurant.ordering_system.dto.request.CategoryRequest;
import com.restaurant.ordering_system.dto.request.StatusRequest;
import com.restaurant.ordering_system.entity.Category;
import com.restaurant.ordering_system.service.CategoryService;


/**
 * 分类管理控制器
 * 提供给分类的增删改查接口
 * 
 */
@RestController
@RequestMapping({"/api/admin/categories", "/api/customer/categories"})

public class CategoryController {
    @Autowired
    private CategoryService categoryService; 


    /**
     * 查询所有分类
     * GET /api/admin/categories
     * @return 所有分类列表
     */
    @GetMapping
    public Result<List<Category>> listAll(){
        List<Category> categories = categoryService.listAll();
        return Result.success(categories);
    }


    /**
     * 根据ID查询分类
     * @Get /api/admin/categories/{id}
     * 
     * @param id 分类id
     * @return 分类对象
     */

    @GetMapping("/{id}")
    public Result<Category> getById(@PathVariable Long id) {
        Category category = categoryService.getById(id);
        return Result.success(category);
    }
    

    /**
     * 创建分类
     * POST /api/admin/categories
     * 
     * @param request 分类创建参数
     * @return 创建的分类对象
     * 
     */

    @PostMapping
    public Result<Category> create(@RequestBody CategoryRequest request){
        Category category = categoryService.create(request.getName(),request.getSort());
        
        return Result.success(category);
    }


    /**
     * 更新分类
     * PUT /api/admin/categories/{id}
     * 
     * @param id 分类id
     * @param request 分类请求参数
     *  @return 更新后的分类对象
     * 
     */


    @PutMapping("/{id}")
    public Result<Category> update(@PathVariable Long id, @RequestBody CategoryRequest request){
        Category category = categoryService.update(id, request.getName(), request.getSort());

        return Result.success(category);
    }


    /**
     * 删除分类
     * DELETE /api/admin/categories/{id}
     * 
     * @param id 分类ID
     * @return 成功消息
     */
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        categoryService.delete(id);
        return Result.success();
    }


    /**
     * 启用/禁用分类
     * PATCH /api/admin/categories/{id}/status
     * 
     * @param id 分类id
     * @param request 状态请求参数
     * @return 更新后的分类对象
     * 
     */


    @PatchMapping("/{id}/status")

    public Result<Category> updateStatus(
        @PathVariable Long id, 
        @RequestBody StatusRequest request
    ){
        Category category = categoryService.updateStatus(id, request.getStatus());

        return Result.success(category);
    }
}
