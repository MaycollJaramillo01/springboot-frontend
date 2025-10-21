package com.pos.pos.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pos.pos.Repository.OrderItemRepository;
import com.pos.pos.Service.OrderItemService;
import com.pos.pos.Model.OrderItem;

@RestController
@RequestMapping("api/order-items")
public class OrderItemController {
	@Autowired
	private OrderItemRepository orderItemRepository;
	@Autowired
	private OrderItemService orderItemService;

	@GetMapping
	public List<OrderItem> list() {
		return orderItemRepository.findAll();
	}

	// every item in a order
	// las ordenes son ventas
	@PostMapping
	public OrderItem createOrderItem(OrderItem OrderItem) {
		return orderItemService.createOrderItem(OrderItem);
	}

	@GetMapping("/{id}")
	public OrderItem getOrderItem(@PathVariable Long id) {
		return orderItemRepository.findById(id).orElseThrow(() -> new RuntimeException("OrderItem not found"));
	}

	@DeleteMapping("/{id}")
	public void deleteOrderItem(@PathVariable Long id) {
		orderItemRepository.deleteById(id);
	}
}
