package com.restaurant.ordering_system.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.restaurant.ordering_system.entity.DiningTable;


@Repository
public interface DiningTableRepository extends JpaRepository<DiningTable, Long>{
    
}
