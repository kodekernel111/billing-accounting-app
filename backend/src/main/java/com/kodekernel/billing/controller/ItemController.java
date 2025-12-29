package com.kodekernel.billing.controller;

import com.kodekernel.billing.model.Item;
import com.kodekernel.billing.repository.CompanyRepository;
import com.kodekernel.billing.repository.ItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/items")
public class ItemController {

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @GetMapping
    public List<Item> getItems(@RequestParam Long companyId) {
        return itemRepository.findByCompanyId(companyId);
    }

    @PostMapping
    public ResponseEntity<?> createItem(@RequestBody Item item, @RequestParam Long companyId) {
        return companyRepository.findById(companyId).map(company -> {
            item.setCompany(company);
            return ResponseEntity.ok(itemRepository.save(item));
        }).orElse(ResponseEntity.badRequest().build());
    }
}
