package com.kodekernel.billing.service;

import com.kodekernel.billing.dto.TrialBalanceDTO;
import com.kodekernel.billing.model.Ledger;
import com.kodekernel.billing.model.LedgerGroup;
import com.kodekernel.billing.repository.LedgerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ReportService {

    @Autowired
    private LedgerRepository ledgerRepository;

    public List<TrialBalanceDTO> getTrialBalance(Long companyId) {
        List<Ledger> allLedgers = ledgerRepository.findByCompanyId(companyId);

        // Group ledgers by LedgerGroup
        Map<LedgerGroup, List<Ledger>> groupedLedgers = allLedgers.stream()
                .collect(Collectors.groupingBy(Ledger::getGroup));

        List<TrialBalanceDTO> report = new ArrayList<>();

        for (Map.Entry<LedgerGroup, List<Ledger>> entry : groupedLedgers.entrySet()) {
            LedgerGroup group = entry.getKey();
            List<Ledger> ledgersInGroup = entry.getValue();

            BigDecimal groupDebit = BigDecimal.ZERO;
            BigDecimal groupCredit = BigDecimal.ZERO;
            List<TrialBalanceDTO.LedgerSummary> ledgerSummaries = new ArrayList<>();

            for (Ledger l : ledgersInGroup) {
                // For MVP, we treat openingBalance as the net running balance.
                // We crudely check openingBalanceType to guess sign, but since we updated it
                // mathematically in previous steps...
                // Ideally, we should have maintained IsDebit flag or signed BigDecimal.
                // Assumption: If balance is positive, it maintains its original nature unless
                // flipped (which we handled poorly in MVP).
                // Let's assume openingBalance is always absolute magnitude, and type is kept
                // 'Dr' or 'Cr'.

                // REFINEMENT: In InvoiceService, we just did .add().
                // If it was "Dr" and we added, it grew.
                // If it was "Cr" and we added, it grew.
                // So openingBalance represents magnitude of that nature.

                BigDecimal bal = l.getOpeningBalance();
                String type = l.getOpeningBalanceType();

                if ("DR".equalsIgnoreCase(type)) {
                    groupDebit = groupDebit.add(bal);
                } else {
                    groupCredit = groupCredit.add(bal);
                }

                ledgerSummaries.add(new TrialBalanceDTO.LedgerSummary(l.getId(), l.getName(), bal, type));
            }

            // Net off for the Group line? Or show total Dr/Cr?
            // Usually Trial Balance shows Debit Col and Credit Col.

            TrialBalanceDTO dto = new TrialBalanceDTO();
            dto.setGroupName(group.getName());
            dto.setPrimaryGroup(group.getPrimaryGroup());
            dto.setDebitTotal(groupDebit);
            dto.setCreditTotal(groupCredit);
            dto.setLedgers(ledgerSummaries);

            report.add(dto);
        }

        return report;
    }
}
