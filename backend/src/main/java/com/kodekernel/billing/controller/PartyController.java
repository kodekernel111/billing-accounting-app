package com.kodekernel.billing.controller;

import com.kodekernel.billing.model.Ledger;
import com.kodekernel.billing.model.LedgerGroup;
import com.kodekernel.billing.model.Party;
import com.kodekernel.billing.repository.CompanyRepository;
import com.kodekernel.billing.repository.LedgerGroupRepository;
import com.kodekernel.billing.repository.LedgerRepository;
import com.kodekernel.billing.repository.PartyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/parties")
public class PartyController {

    @Autowired
    private PartyRepository partyRepository;

    @Autowired
    private LedgerRepository ledgerRepository;

    @Autowired
    private LedgerGroupRepository ledgerGroupRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @GetMapping
    public List<Party> getParties(@RequestParam Long companyId) {
        return partyRepository.findByCompanyId(companyId);
    }

    @PostMapping
    @Transactional
    public ResponseEntity<?> createParty(@RequestBody Party party, @RequestParam Long companyId) {
        return companyRepository.findById(companyId).map(company -> {
            party.setCompany(company);

            // Auto-create Ledger
            Ledger ledger = new Ledger();
            ledger.setName(party.getName());
            ledger.setCompany(company);

            String groupName = party.getType() == Party.PartyType.CUSTOMER ? "Sundry Debtors" : "Sundry Creditors";
            LedgerGroup group = ledgerGroupRepository.findByName(groupName)
                    .orElseThrow(() -> new RuntimeException("Ledger Group not found: " + groupName));

            ledger.setGroup(group);
            ledgerRepository.save(ledger);

            party.setLedger(ledger);
            return ResponseEntity.ok(partyRepository.save(party));
        }).orElse(ResponseEntity.badRequest().build());
    }
}
