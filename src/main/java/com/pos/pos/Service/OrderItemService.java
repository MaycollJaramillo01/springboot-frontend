package com.pos.pos.Service;

import org.springframework.stereotype.Service;

import com.pos.pos.Model.OrderItem;
import com.pos.pos.Repository.OrderItemRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;


@Service
@Transactional
@RequiredArgsConstructor
public class OrderItemService {
	private final InventoryService inventoryService;
	private final OrderItemRepository orderItemRepository;

	public OrderItem createOrderItem(OrderItem orderItem){

		Integer requestedQuantity = orderItem.getQuantity();
		if(!inventoryService.checkAvailableProduct(orderItem.getProduct().getId(), requestedQuantity)){
			throw new IllegalArgumentException("Not Enoght of This Product Available");
		}

		return orderItemRepository.save(orderItem);

	}
}
