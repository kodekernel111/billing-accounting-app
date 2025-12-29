package com.kodekernel.billing.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "purchase_bills")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseBill {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String billNumber;

    @Column(nullable = false)
    private LocalDate date;

    private LocalDate dueDate;

    @ManyToOne
    @JoinColumn(name = "party_id", nullable = false)
    private Party party; // Supplier

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @OneToMany(mappedBy = "bill", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PurchaseBillItem> items;

    private BigDecimal totalAmount;
    private BigDecimal totalTax;
    private BigDecimal subTotal;
}
