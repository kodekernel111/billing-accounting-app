package com.kodekernel.billing.config;

import com.kodekernel.billing.model.LedgerGroup;
import com.kodekernel.billing.repository.LedgerGroupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private LedgerGroupRepository ledgerGroupRepository;

    @Override
    public void run(String... args) throws Exception {
        if (ledgerGroupRepository.count() == 0) {
            Arrays.asList(
                    new LedgerGroup(null, "Capital Account", "LIABILITIES"),
                    new LedgerGroup(null, "Current Assets", "ASSETS"),
                    new LedgerGroup(null, "Current Liabilities", "LIABILITIES"),
                    new LedgerGroup(null, "Bank Accounts", "ASSETS"),
                    new LedgerGroup(null, "Cash-in-hand", "ASSETS"),
                    new LedgerGroup(null, "Sales Accounts", "INCOME"),
                    new LedgerGroup(null, "Purchase Accounts", "EXPENSES"),
                    new LedgerGroup(null, "Indirect Expenses", "EXPENSES"),
                    new LedgerGroup(null, "Direct Expenses", "EXPENSES"),
                    new LedgerGroup(null, "Sundry Debtors", "ASSETS"),
                    new LedgerGroup(null, "Sundry Creditors", "LIABILITIES"),
                    new LedgerGroup(null, "Duties & Taxes", "LIABILITIES")).forEach(ledgerGroupRepository::save);
        }
    }
}
