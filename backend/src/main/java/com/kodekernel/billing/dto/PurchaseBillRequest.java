package com.kodekernel.billing.dto;

import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class PurchaseBillRequest {
    private String billNumber;
    private LocalDate date;
    private LocalDate dueDate;
    private Long partyId;
    private List<PurchaseItemRequest> items;

    @Data
    public static class PurchaseItemRequest {
        private Long itemId;
        private Double quantity;
        private Double rate; // Optional override
    }
}
