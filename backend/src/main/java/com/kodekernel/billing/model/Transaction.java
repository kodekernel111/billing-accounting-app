package com.kodekernel.billing.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String voucherNumber;

    @Column(nullable = false)
    private LocalDate date;

    @Enumerated(EnumType.STRING)
    private TransactionType type; // PAYMENT, RECEIPT

    private BigDecimal amount;
    private String description;

    @ManyToOne
    @JoinColumn(name = "debit_ledger_id", nullable = false)
    private Ledger debitLedger;

    @ManyToOne
    @JoinColumn(name = "credit_ledger_id", nullable = false)
    private Ledger creditLedger;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    public enum TransactionType {
        PAYMENT,
        RECEIPT,
        CONTRA,
        JOURNAL
    }
}
