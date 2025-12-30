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

    @Autowired
    private com.kodekernel.billing.service.ExcelService excelService;

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

    @PutMapping("/{id}")
    public ResponseEntity<?> updateItem(@PathVariable Long id, @RequestBody Item itemData) {
        return itemRepository.findById(id).map(existingItem -> {
            existingItem.setName(itemData.getName());
            existingItem.setCode(itemData.getCode());
            existingItem.setType(itemData.getType());
            existingItem.setUnit(itemData.getUnit());
            existingItem.setHsnCode(itemData.getHsnCode());
            existingItem.setTaxRate(itemData.getTaxRate());
            existingItem.setSellingPrice(itemData.getSellingPrice());
            existingItem.setPurchasePrice(itemData.getPurchasePrice());
            // Optional: Update Stock if needed, or keeping it separate via transactions?
            // User requested "edit items", assuming full edit.
            existingItem.setCurrentStock(itemData.getCurrentStock());

            return ResponseEntity.ok(itemRepository.save(existingItem));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadItems(@RequestParam("file") org.springframework.web.multipart.MultipartFile file,
            @RequestParam Long companyId) {
        try {
            List<Item> items = excelService.parseExcelFile(file.getInputStream());
            return companyRepository.findById(companyId).map(company -> {
                items.forEach(item -> item.setCompany(company));
                List<Item> savedItems = itemRepository.saveAll(items);
                return ResponseEntity.ok(savedItems);
            }).orElse(ResponseEntity.badRequest().body(null));
        } catch (java.io.IOException e) {
            return ResponseEntity.badRequest().body("Failed to process file: " + e.getMessage());
        }
    }

    @GetMapping("/template")
    public ResponseEntity<org.springframework.core.io.InputStreamResource> downloadTemplate() {
        java.io.ByteArrayInputStream in = excelService.generateSampleExcel();
        org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=item_template.xlsx");

        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(org.springframework.http.MediaType
                        .parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(new org.springframework.core.io.InputStreamResource(in));
    }
}
