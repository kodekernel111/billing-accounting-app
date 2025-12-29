package com.kodekernel.billing.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;

@Entity
@Table(name = "purchase_bill_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseBillItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bill_id", nullable = false)
    private PurchaseBill bill;

    @ManyToOne
    @JoinColumn(name = "item_id", nullable = false)
    private Item item;

    private BigDecimal quantity;
    private BigDecimal rate; // Purchase Price

    private BigDecimal taxRate;
    private BigDecimal taxAmount;

    private BigDecimal total;
}
