package com.kodekernel.billing.controller;

import com.kodekernel.billing.dto.InvoiceRequest;
import com.kodekernel.billing.model.Invoice;
import com.kodekernel.billing.repository.InvoiceRepository;
import com.kodekernel.billing.service.InvoiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/invoices")
public class InvoiceController {

    @Autowired
    private InvoiceService invoiceService;

    @Autowired
    private InvoiceRepository invoiceRepository;

    @GetMapping
    public List<Invoice> getInvoices(@RequestParam Long companyId) {
        return invoiceRepository.findByCompanyId(companyId);
    }

    @PostMapping
    public ResponseEntity<?> createInvoice(@RequestBody InvoiceRequest request, @RequestParam Long companyId) {
        try {
            Invoice invoice = invoiceService.createInvoice(request, companyId);
            return ResponseEntity.ok(invoice);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
