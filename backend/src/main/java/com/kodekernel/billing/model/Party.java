package com.kodekernel.billing.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "parties")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Party {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    private PartyType type; // CUSTOMER or SUPPLIER

    private String mobile;
    private String email;
    private String address;
    private String gstin;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "ledger_id")
    private Ledger ledger; // Link to accounting ledger

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    public enum PartyType {
        CUSTOMER,
        SUPPLIER
    }
}
