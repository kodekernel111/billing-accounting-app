package com.kodekernel.billing.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;

@Entity
@Table(name = "items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Item {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String code; // SKU or Item Code

    @Enumerated(EnumType.STRING)
    private ItemType type; // PRODUCT or SERVICE

    private String unit; // e.g. Nos, Kg, Mtr
    private String hsnCode;

    // Tax Rate in Percentage (e.g., 18.00)
    private BigDecimal taxRate;

    private BigDecimal sellingPrice;
    private BigDecimal purchasePrice;

    private BigDecimal currentStock = BigDecimal.ZERO;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    public enum ItemType {
        PRODUCT,
        SERVICE
    }
}
