package com.kodekernel.billing.service;

import com.kodekernel.billing.dto.PurchaseBillRequest;
import com.kodekernel.billing.model.*;
import com.kodekernel.billing.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class PurchaseService {

    @Autowired
    private PurchaseBillRepository purchaseRepository;
    @Autowired
    private CompanyRepository companyRepository;
    @Autowired
    private PartyRepository partyRepository;
    @Autowired
    private ItemRepository itemRepository;
    @Autowired
    private LedgerRepository ledgerRepository;
    @Autowired
    private LedgerGroupRepository ledgerGroupRepository;

    @Transactional
    public PurchaseBill createPurchaseBill(PurchaseBillRequest request, Long companyId) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found"));
        Party party = partyRepository.findById(request.getPartyId())
                .orElseThrow(() -> new RuntimeException("Party not found"));

        PurchaseBill bill = new PurchaseBill();
        bill.setBillNumber(request.getBillNumber());
        bill.setDate(request.getDate());
        bill.setDueDate(request.getDueDate());
        bill.setParty(party);
        bill.setCompany(company);

        List<PurchaseBillItem> items = new ArrayList<>();
        BigDecimal subTotal = BigDecimal.ZERO;
        BigDecimal totalTax = BigDecimal.ZERO;

        for (PurchaseBillRequest.PurchaseItemRequest itemReq : request.getItems()) {
            Item item = itemRepository.findById(itemReq.getItemId())
                    .orElseThrow(() -> new RuntimeException("Item not found"));

            PurchaseBillItem billItem = new PurchaseBillItem();
            billItem.setBill(bill);
            billItem.setItem(item);
            billItem.setQuantity(BigDecimal.valueOf(itemReq.getQuantity()));

            // Allow override or default to purchase price
            BigDecimal rate = itemReq.getRate() != null ? BigDecimal.valueOf(itemReq.getRate())
                    : item.getPurchasePrice();
            if (rate == null)
                rate = BigDecimal.ZERO;

            billItem.setRate(rate);
            billItem.setTaxRate(item.getTaxRate());

            // Calc
            BigDecimal lineTotal = billItem.getRate().multiply(billItem.getQuantity());
            BigDecimal taxAmount = lineTotal.multiply(item.getTaxRate()).divide(BigDecimal.valueOf(100));

            billItem.setTaxAmount(taxAmount);
            billItem.setTotal(lineTotal.add(taxAmount));

            items.add(billItem);

            subTotal = subTotal.add(lineTotal);
            totalTax = totalTax.add(taxAmount);

            // INVENTORY UPDATE: Increase Stock
            item.setCurrentStock(item.getCurrentStock().add(billItem.getQuantity()));
            itemRepository.save(item);
        }

        bill.setItems(items);
        bill.setSubTotal(subTotal);
        bill.setTotalTax(totalTax);
        bill.setTotalAmount(subTotal.add(totalTax));

        PurchaseBill savedBill = purchaseRepository.save(bill);

        // ACCOUNTING POSTING
        // 1. Credit Supplier Ledger (Total Amount) -> Liability increases
        Ledger partyLedger = party.getLedger();
        partyLedger.setOpeningBalance(partyLedger.getOpeningBalance().add(savedBill.getTotalAmount()));
        // Again, assuming (+) means Credit for Liabilities in this simple running
        // balance model.
        // Or if we treat Asset (+Dr) and Liability (+Cr), this works.
        ledgerRepository.save(partyLedger);

        // 2. Debit Purchase Account (SubTotal) -> Expense increases
        Ledger purchaseLedger = findOrCreateLedger("Purchase Account", "Purchase Accounts", company);
        purchaseLedger.setOpeningBalance(purchaseLedger.getOpeningBalance().add(savedBill.getSubTotal()));
        ledgerRepository.save(purchaseLedger);

        // 3. Debit Input Tax (Total Tax) -> Asset increases
        if (totalTax.compareTo(BigDecimal.ZERO) > 0) {
            Ledger taxLedger = findOrCreateLedger("Input GST", "Duties & Taxes", company);
            taxLedger.setOpeningBalance(taxLedger.getOpeningBalance().add(totalTax));
            ledgerRepository.save(taxLedger);
        }

        return savedBill;
    }

    private Ledger findOrCreateLedger(String name, String groupName, Company company) {
        return ledgerRepository.findByCompanyId(company.getId()).stream()
                .filter(l -> l.getName().equalsIgnoreCase(name))
                .findFirst()
                .orElseGet(() -> {
                    LedgerGroup group = ledgerGroupRepository.findByName(groupName)
                            .orElseThrow(() -> new RuntimeException("Group not found: " + groupName));
                    Ledger l = new Ledger();
                    l.setName(name);
                    l.setCompany(company);
                    l.setGroup(group);
                    l.setOpeningBalance(BigDecimal.ZERO);
                    l.setOpeningBalanceType("DR"); // Expense/Asset usually Dr
                    return ledgerRepository.save(l);
                });
    }
}
