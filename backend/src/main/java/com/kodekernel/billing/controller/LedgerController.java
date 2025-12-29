package com.kodekernel.billing.controller;

import com.kodekernel.billing.model.Ledger;
import com.kodekernel.billing.model.LedgerGroup;
import com.kodekernel.billing.repository.CompanyRepository;
import com.kodekernel.billing.repository.LedgerGroupRepository;
import com.kodekernel.billing.repository.LedgerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ledgers")
public class LedgerController {

    @Autowired
    private LedgerRepository ledgerRepository;

    @Autowired
    private LedgerGroupRepository ledgerGroupRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @GetMapping
    public List<Ledger> getLedgers(@RequestParam Long companyId) {
        return ledgerRepository.findByCompanyId(companyId);
    }

    @GetMapping("/groups")
    public List<LedgerGroup> getLedgerGroups() {
        return ledgerGroupRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> createLedger(@RequestBody Ledger ledger, @RequestParam Long companyId) {
        return companyRepository.findById(companyId).map(company -> {
            ledger.setCompany(company);
            return ResponseEntity.ok(ledgerRepository.save(ledger));
        }).orElse(ResponseEntity.badRequest().build());
    }
}
