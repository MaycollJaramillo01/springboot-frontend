package com.pos.pos.Repository;

import com.pos.pos.Model.Inventory;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {
	@Query("SELECT i.quantity FROM Inventory i WHERE i.product.id = :productId")
	Optional<Integer> findQuantityByProductId(Long productId);
}
