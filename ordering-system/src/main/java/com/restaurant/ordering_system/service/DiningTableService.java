package com.restaurant.ordering_system.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.restaurant.ordering_system.entity.DiningTable;
import com.restaurant.ordering_system.exception.BusinessException;
import com.restaurant.ordering_system.repository.DiningTableRepository;

/**
 * 餐桌业务逻辑层
 * 处理餐桌相关的业务操作
 */
@Service
public class DiningTableService {

    @Autowired
    private DiningTableRepository diningTableRepository;

    /**
     * 根据ID查询餐桌
     * @param id 餐桌ID
     * @return 餐桌对象
     */
    public DiningTable getById(Long id) {
        return diningTableRepository.findById(id)
                .orElseThrow(() -> new BusinessException("餐桌不存在"));
    }

    /**
     * 根据桌号查询餐桌
     * @param tableNumber 桌号
     * @return 餐桌对象
     */
    public DiningTable getByTableNumber(String tableNumber) {
        return diningTableRepository.findByTableNumber(tableNumber)
                .orElseThrow(() -> new BusinessException("餐桌不存在"));
    }

    /**
     * 查询所有餐桌
     * @return 餐桌列表
     */
    public List<DiningTable> listAll() {
        return diningTableRepository.findAll();
    }

    /**
     * 根据状态查询餐桌列表
     * @param status 状态（0-维修中，1-空闲，2-使用中）
     * @return 餐桌列表
     */
    public List<DiningTable> listByStatus(Integer status) {
        return diningTableRepository.findByStatus(status);
    }

    /**
     * 创建餐桌
     * @param tableNumber 桌号
     * @param seats 座位数
     * @return 创建的餐桌对象
     */
    @Transactional
    public DiningTable create(String tableNumber, Integer seats) {
        // 1. 验证桌号不能为空
        if (tableNumber == null || tableNumber.trim().isEmpty()) {
            throw new BusinessException("桌号不能为空");
        }

        // 2. 检查桌号是否重复
        if (diningTableRepository.existsByTableNumber(tableNumber)) {
            throw new BusinessException("桌号已存在");
        }

        // 3. 验证座位数大于0
        if (seats == null || seats <= 0) {
            throw new BusinessException("座位数必须大于0");
        }

        // 4. 创建餐桌，默认状态为空闲(1)
        DiningTable table = new DiningTable();
        table.setTableNumber(tableNumber);
        table.setSeats(seats);
        table.setStatus(1);

        return diningTableRepository.save(table);
    }

    /**
     * 更新餐桌信息
     * @param id 餐桌ID
     * @param tableNumber 新桌号
     * @param seats 新座位数
     * @return 更新后的餐桌对象
     */
    @Transactional
    public DiningTable update(Long id, String tableNumber, Integer seats) {
        // 1. 查询餐桌是否存在
        DiningTable table = diningTableRepository.findById(id)
                .orElseThrow(() -> new BusinessException("餐桌不存在"));

        // 2. 验证桌号不能为空
        if (tableNumber == null || tableNumber.trim().isEmpty()) {
            throw new BusinessException("桌号不能为空");
        }

        // 3. 检查新桌号是否与其他餐桌重复（排除自己）
        if (diningTableRepository.existsByTableNumberAndIdNot(tableNumber, id)) {
            throw new BusinessException("桌号已存在");
        }

        // 4. 验证座位数大于0
        if (seats == null || seats <= 0) {
            throw new BusinessException("座位数必须大于0");
        }

        // 5. 更新信息
        table.setTableNumber(tableNumber);
        table.setSeats(seats);

        return diningTableRepository.save(table);
    }

    /**
     * 更新餐桌状态
     * @param id 餐桌ID
     * @param status 状态（0-维修中，1-空闲，2-使用中）
     * @return 更新后的餐桌对象
     */
    @Transactional
    public DiningTable updateStatus(Long id, Integer status) {
        // 1. 查询餐桌是否存在
        DiningTable table = diningTableRepository.findById(id)
                .orElseThrow(() -> new BusinessException("餐桌不存在"));

        // 2. 验证状态值
        if (status == null || (status != 0 && status != 1 && status != 2)) {
            throw new BusinessException("状态值只能是0（维修中）、1（空闲）或2（使用中）");
        }

        // 3. 更新状态
        table.setStatus(status);

        return diningTableRepository.save(table);
    }

    /**
     * 删除餐桌
     * @param id 餐桌ID
     */
    @Transactional
    public void delete(Long id) {
        // 1. 检查餐桌是否存在
        if (!diningTableRepository.existsById(id)) {
            throw new BusinessException("餐桌不存在");
        }

        // 2. 删除餐桌
        diningTableRepository.deleteById(id);
    }
}
