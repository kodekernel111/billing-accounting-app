package com.kodekernel.billing.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "ledger_groups")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LedgerGroup {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    // e.g. ASSETS, LIABILITIES, INCOME, EXPENSES
    @Column(nullable = false)
    private String primaryGroup;
}
