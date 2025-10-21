package com.pos.pos.Service;

import com.pos.pos.Repository.InventoryRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.pos.pos.Model.Inventory;

@Service
@Transactional

@RequiredArgsConstructor
public class InventoryService implements InventoryServiceInterface {
	private final InventoryRepository inventoryRepository;

	@Override
	public boolean checkAvailableProduct(Long productId, Integer requestedQuantity) {
		if(productId == null || requestedQuantity == null || requestedQuantity <=0){
			throw new IllegalArgumentException("Invalid Parameters");
		}

		Integer availableStock = inventoryRepository.findQuantityByProductId(productId)
			.orElse(0);

		return availableStock >= requestedQuantity;


	}

}
