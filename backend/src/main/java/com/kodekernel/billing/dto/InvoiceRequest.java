package com.kodekernel.billing.dto;

import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class InvoiceRequest {
    private String invoiceNumber;
    private LocalDate date;
    private LocalDate dueDate;
    private Long partyId;
    private List<InvoiceItemRequest> items;

    @Data
    public static class InvoiceItemRequest {
        private Long itemId;
        private Double quantity;
        // Rate and Tax might be fetched from Item or overridden here
    }
}
