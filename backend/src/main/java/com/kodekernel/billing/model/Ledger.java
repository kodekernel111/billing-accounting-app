package com.kodekernel.billing.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;

@Entity
@Table(name = "ledgers")
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Ledger {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @ManyToOne
    @JoinColumn(name = "group_id", nullable = false)
    private LedgerGroup group;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    private BigDecimal openingBalance = BigDecimal.ZERO;

    // DR or CR for opening balance
    private String openingBalanceType = "DR";
}
