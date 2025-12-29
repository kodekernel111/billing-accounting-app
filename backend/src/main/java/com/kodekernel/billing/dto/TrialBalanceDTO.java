package com.kodekernel.billing.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TrialBalanceDTO {
    private String groupName;
    private String primaryGroup; // ASSETS, LIABILITIES, INCOME, EXPENSES
    private BigDecimal debitTotal;
    private BigDecimal creditTotal;
    private List<LedgerSummary> ledgers;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LedgerSummary {
        private Long id;
        private String name;
        private BigDecimal balance; // Signed or absolute
        private String balanceType; // Dr/Cr
    }
}
