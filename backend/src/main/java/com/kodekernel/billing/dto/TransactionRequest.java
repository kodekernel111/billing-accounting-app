package com.kodekernel.billing.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class TransactionRequest {
    private String voucherNumber;
    private LocalDate date;
    private String type; // PAYMENT, RECEIPT
    private Double amount;
    private String description;
    private Long debitLedgerId;
    private Long creditLedgerId;
}
