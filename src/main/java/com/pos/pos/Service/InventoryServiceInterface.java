package com.pos.pos.Service;

public interface InventoryServiceInterface {
	boolean checkAvailableProduct(Long productId, Integer requestedQuantity);
}
