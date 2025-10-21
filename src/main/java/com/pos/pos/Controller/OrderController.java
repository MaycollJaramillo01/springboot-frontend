package com.pos.pos.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pos.pos.Repository.OrderRepository;
import com.pos.pos.Model.Order;

@RestController
@RequestMapping("api/orders")
public class OrderController {
	@Autowired
	private OrderRepository orderRepository;

	@GetMapping
	public List<Order> list() {
		return orderRepository.findAll();
	}

	// create an order (final order)
	@PostMapping
	public Order createOrder(Order Order) {
		return orderRepository.save(Order);
	}

	@GetMapping("/{id}")
	public Order getOrder(@PathVariable Long id) {
		return orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Order not found"));
	}

	@DeleteMapping("/{id}")
	public void deleteOrder(@PathVariable Long id) {
		orderRepository.deleteById(id);
	}
}
