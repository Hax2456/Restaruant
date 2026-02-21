package com.restaurant.ordering_system.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collector;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.restaurant.ordering_system.common.ResultCode;
import com.restaurant.ordering_system.dto.request.OrderRequest;
import com.restaurant.ordering_system.entity.Dish;
import com.restaurant.ordering_system.entity.Order;
import com.restaurant.ordering_system.entity.OrderItem;
import com.restaurant.ordering_system.exception.BusinessException;
import com.restaurant.ordering_system.repository.DishRepository;
import com.restaurant.ordering_system.repository.OrderItemRepository;
import com.restaurant.ordering_system.repository.OrderRepository;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private DishRepository dishRepository;

    /**
     * 根据Id查询订单
     * @param id
     * @return
     */
    public Order getById(Long id){
        return orderRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ResultCode.ORDER_NOT_FOUND.getCode(), "订单不存在"));
    }

    /**
     * 根据订单号查询订单
     * @param orderNumber
     * @return
     */
    public Order getByOrderNumber(String orderNumber){
        return orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new BusinessException(ResultCode.ORDER_NOT_FOUND.getCode(), "订单不存在"));
    }

    /**
     * 查询所有订单
     * @return
     */
    public List<Order> listAll(){
        return orderRepository.findAll();
    }

    /**
     * 根据桌号查询订单列表
     * @param tableId
     * @return
     */
    public List<Order> listByTableId(Long tableId){
        return orderRepository.findByTableId(tableId);
    }


    /**
     * 根据状态查询订单列表
     * @param status
     * @return
     */
    public List<Order> listByStatus(Integer status){
        return orderRepository.findByStatus(status);
    }

    /**
     * 更新订单状态
     * @param id
     * @param status
     * @return
     */
    @Transactional
    public Order updateStatus(Long id, Integer status){
        //1. 验证订单存在
        Order order = orderRepository.findById(id)
                        .orElseThrow(()-> new BusinessException(ResultCode.ORDER_NOT_FOUND.getCode(), "订单不存在"));
        //2. 验证状态值
        if (status < 0|| status > 3){
            throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), 
            "无效的订单状态（0-待支付 1-已支付 2-已完成 3-已取消）"
                                        );
        }

        //3. 验证状态转化规则

        if (order.getStatus() == 3){
            throw new BusinessException(ResultCode.ERROR.getCode(), 
        "已取消的订单不能修改状态"
                                        );   
        }

        if (order.getStatus() ==2 && status!=2){
            throw new BusinessException(ResultCode.ERROR.getCode(), 
                "已完成的订单不能修改状态"          
        )       ;
        }

        //4. 更新状态保存
        order.setStatus(status);
        return orderRepository.save(order);
    }
    /**
     * 取消订单
     * @param id
     */
    @Transactional
    public void cancel(Long id){
        //1. 验证订单存在
        Order order = orderRepository.findById(id)
                        .orElseThrow(()-> new BusinessException(ResultCode.ORDER_NOT_FOUND.getCode(),"订单不存在"));
        //2. y验证业务规则： 只有待支付0 和 已经支付1 可以取消
        if (order.getStatus() !=0 && order.getStatus() != 1){
            throw new BusinessException(
                ResultCode.ERROR.getCode(),
                "只有待支付获已支付的订单可以取消"
            );
        }

        //3. 设置已取消状态
        order.setStatus(3);
        orderRepository.save(order);
    }

    /**
     * 删除订单
     * @param id
     */
    @Transactional
    public void delete(Long id){
        //1. 验证订单存在
        if(!orderRepository.existsById(id)){
            throw new BusinessException(
                ResultCode.ORDER_NOT_FOUND.getCode(),
                "订单不存在"
            );
        }

        //2. 先删除订单明细
        orderItemRepository.deleteByOrderId(id);

        //3. 删除
        orderRepository.deleteById(id);
    }


    /**
     * 创建订单
     * 
     * @param request
     * @return
     */
    @Transactional
    public Order create(OrderRequest request){
        //1. 验证参数
        if (request.getTableId() == null) {
            throw new BusinessException(
                ResultCode.BAD_REQUEST.getCode(),
                "桌号不能为空"
            );
        }
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new BusinessException(
                ResultCode.BAD_REQUEST.getCode(),
                "订单项不能为空"
            );

        }

        //2. 计算总金额并验证菜品
        BigDecimal totalAmount = BigDecimal.ZERO;
        for(OrderRequest.OrderItemRequest item: request.getItems()){
            //验证菜品存在
            Dish dish = dishRepository.findById(item.getDishId())
                                        .orElseThrow(() -> new BusinessException(
                                            ResultCode.DISH_NOT_FOUND.getCode(),
                                            "菜品不存在： ID=" + item.getDishId()
                                        ));
            //验证菜品状态
            if (dish.getStatus() == 0){
                throw new BusinessException(
                    ResultCode.ERROR.getCode(),
                    "菜品已停售：" + dish.getName()
            
            );}
            //验证数量
            if (item.getQuantity() == null || item.getQuantity() <= 0){
                throw new BusinessException(
                    ResultCode.BAD_REQUEST.getCode(),
                    "菜品数量必须大于0"
                );
            }

            //计算小计并累加
            BigDecimal itemTotal = dish.getPrice().multiply(new BigDecimal(item.getQuantity()));
            totalAmount = totalAmount.add(itemTotal);
        }

        //3. 生成订单号 格式：yyyyMMddHHmmss + 4位随机
        String orderNumber = generateOrderNumber();

        //4. 创建订单主记录
        Order order = new Order();
        order.setOrderNumber(orderNumber);
        order.setTableId(request.getTableId());
        order.setTotalAmount(totalAmount);
        order.setStatus(0);
        order.setRemark(request.getRemark());

        order = orderRepository.save(order);


        final Long orderId = order.getId();
        List<OrderItem> orderItems = request.getItems().stream()
                                        .map(item -> {
                                            Dish dish = dishRepository.findById(item.getDishId()).get();
                                            
                                            OrderItem orderItem = new OrderItem();
                                            orderItem.setOrderId(orderId);
                                            orderItem.setDishId(dish.getId());
                                            orderItem.setDishName(dish.getName());
                                            orderItem.setDishPrice(dish.getPrice());
                                            orderItem.setQuantity(item.getQuantity());
                                            orderItem.setRemark(item.getRemark());
                                            // 计算小计
                                            BigDecimal subtotal = dish.getPrice().multiply(new BigDecimal(item.getQuantity()));
                                            orderItem.setSubtotal(subtotal);

                                            return orderItem;
                                        }).collect(Collectors.toList());
        orderItemRepository.saveAll(orderItems);
        return order;
    }

    /**
     * 生成订单号
     * @return 订单号
     */
    private String generateOrderNumber(){
        String timestamp = LocalDateTime.now().format(
            DateTimeFormatter.ofPattern("yyyyMMddHHmmss")
        );

        int random  = (int) (Math.random()*9000) + 1000;
        return timestamp + random;


    }
}
