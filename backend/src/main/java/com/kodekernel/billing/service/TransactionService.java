package com.kodekernel.billing.service;

import com.kodekernel.billing.dto.TransactionRequest;
import com.kodekernel.billing.model.*;
import com.kodekernel.billing.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;
    @Autowired
    private CompanyRepository companyRepository;
    @Autowired
    private LedgerRepository ledgerRepository;

    @Transactional
    public Transaction createTransaction(TransactionRequest request, Long companyId) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        Ledger debitLedger = ledgerRepository.findById(request.getDebitLedgerId())
                .orElseThrow(() -> new RuntimeException("Debit Ledger not found"));
        Ledger creditLedger = ledgerRepository.findById(request.getCreditLedgerId())
                .orElseThrow(() -> new RuntimeException("Credit Ledger not found"));

        Transaction transaction = new Transaction();
        transaction.setVoucherNumber(request.getVoucherNumber());
        transaction.setDate(request.getDate());
        transaction.setType(Transaction.TransactionType.valueOf(request.getType()));
        transaction.setAmount(BigDecimal.valueOf(request.getAmount()));
        transaction.setDescription(request.getDescription());
        transaction.setDebitLedger(debitLedger);
        transaction.setCreditLedger(creditLedger);
        transaction.setCompany(company);

        Transaction savedTransaction = transactionRepository.save(transaction);

        // ACCOUNTING IMPACT
        // 1. Update Debit Ledger
        // Ideally we check nature, but for simple running balance, we just ADD to stats
        // Note: Real systems maintain separate Dr/Cr totals or journal lines.
        // Here we just mutate the 'openingBalance' (conceptually 'currentBalance')
        debitLedger.setOpeningBalance(debitLedger.getOpeningBalance().add(savedTransaction.getAmount()));
        ledgerRepository.save(debitLedger);

        // 2. Update Credit Ledger
        creditLedger.setOpeningBalance(creditLedger.getOpeningBalance().add(savedTransaction.getAmount()));
        ledgerRepository.save(creditLedger);

        return savedTransaction;
    }
}
