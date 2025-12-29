package com.kodekernel.billing.controller;

import com.kodekernel.billing.dto.PurchaseBillRequest;
import com.kodekernel.billing.model.PurchaseBill;
import com.kodekernel.billing.repository.PurchaseBillRepository;
import com.kodekernel.billing.service.PurchaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/purchases")
public class PurchaseController {

    @Autowired
    private PurchaseService purchaseService;

    @Autowired
    private PurchaseBillRepository purchaseRepository;

    @GetMapping
    public List<PurchaseBill> getBills(@RequestParam Long companyId) {
        return purchaseRepository.findByCompanyId(companyId);
    }

    @PostMapping
    public ResponseEntity<?> createBill(@RequestBody PurchaseBillRequest request, @RequestParam Long companyId) {
        try {
            PurchaseBill bill = purchaseService.createPurchaseBill(request, companyId);
            return ResponseEntity.ok(bill);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
