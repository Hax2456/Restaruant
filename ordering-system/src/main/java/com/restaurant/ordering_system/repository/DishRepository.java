package com.restaurant.ordering_system.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.restaurant.ordering_system.entity.Dish;

@Repository
public interface DishRepository extends JpaRepository<Dish, Long> {
    
}
