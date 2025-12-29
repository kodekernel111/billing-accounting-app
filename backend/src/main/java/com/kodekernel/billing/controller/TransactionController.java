package com.kodekernel.billing.controller;

import com.kodekernel.billing.dto.TransactionRequest;
import com.kodekernel.billing.model.Transaction;
import com.kodekernel.billing.repository.TransactionRepository;
import com.kodekernel.billing.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private TransactionRepository transactionRepository;

    @GetMapping
    public List<Transaction> getTransactions(@RequestParam Long companyId) {
        return transactionRepository.findByCompanyId(companyId);
    }

    @PostMapping
    public ResponseEntity<?> createTransaction(@RequestBody TransactionRequest request, @RequestParam Long companyId) {
        try {
            Transaction transaction = transactionService.createTransaction(request, companyId);
            return ResponseEntity.ok(transaction);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
