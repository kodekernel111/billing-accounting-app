package com.kodekernel.billing.service;

import com.kodekernel.billing.dto.InvoiceRequest;
import com.kodekernel.billing.model.*;
import com.kodekernel.billing.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class InvoiceService {

    @Autowired
    private InvoiceRepository invoiceRepository;
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
    public Invoice createInvoice(InvoiceRequest request, Long companyId) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found"));
        Party party = partyRepository.findById(request.getPartyId())
                .orElseThrow(() -> new RuntimeException("Party not found"));

        Invoice invoice = new Invoice();
        invoice.setInvoiceNumber(request.getInvoiceNumber());
        invoice.setDate(request.getDate());
        invoice.setDueDate(request.getDueDate());
        invoice.setParty(party);
        invoice.setCompany(company);

        List<InvoiceItem> items = new ArrayList<>();
        BigDecimal subTotal = BigDecimal.ZERO;
        BigDecimal totalTax = BigDecimal.ZERO;

        for (InvoiceRequest.InvoiceItemRequest itemReq : request.getItems()) {
            Item item = itemRepository.findById(itemReq.getItemId())
                    .orElseThrow(() -> new RuntimeException("Item not found"));

            InvoiceItem invItem = new InvoiceItem();
            invItem.setInvoice(invoice);
            invItem.setItem(item);
            invItem.setQuantity(BigDecimal.valueOf(itemReq.getQuantity()));
            invItem.setRate(item.getSellingPrice()); // Using default selling price
            invItem.setTaxRate(item.getTaxRate());

            // Calc
            BigDecimal lineTotal = invItem.getRate().multiply(invItem.getQuantity());
            BigDecimal taxAmount = lineTotal.multiply(item.getTaxRate()).divide(BigDecimal.valueOf(100));

            invItem.setTaxAmount(taxAmount);
            invItem.setTotal(lineTotal.add(taxAmount));

            items.add(invItem);

            subTotal = subTotal.add(lineTotal);
            totalTax = totalTax.add(taxAmount);

            // INVENTORY UPDATE: Reduce Stock
            item.setCurrentStock(item.getCurrentStock().subtract(invItem.getQuantity()));
            itemRepository.save(item);
        }

        invoice.setItems(items);
        invoice.setSubTotal(subTotal);
        invoice.setTotalTax(totalTax);
        invoice.setTotalAmount(subTotal.add(totalTax));

        Invoice savedInvoice = invoiceRepository.save(invoice);

        // ACCOUNTING POSTING
        // 1. Debit Party Ledger (Total Amount)
        Ledger partyLedger = party.getLedger();
        partyLedger.setOpeningBalance(partyLedger.getOpeningBalance().add(savedInvoice.getTotalAmount()));
        // Note: For MVP we strictly add to openingBalance to simulate debit.
        // In real accounting we would insert Journal Entries.
        ledgerRepository.save(partyLedger);

        // 2. Credit Sales Account (SubTotal)
        // Find or Create Sales Ledger
        Ledger salesLedger = findOrCreateLedger("Sales Account", "Sales Accounts", company);
        // Credit means increasing income (conceptually), or negative asset..
        // For simplicity allow signed view or separate Dr/Cr columns.
        // Here we just incr balance for MVP tracking.
        salesLedger.setOpeningBalance(salesLedger.getOpeningBalance().add(savedInvoice.getSubTotal()));
        ledgerRepository.save(salesLedger);

        // 3. Credit Output Tax (Total Tax)
        if (totalTax.compareTo(BigDecimal.ZERO) > 0) {
            Ledger taxLedger = findOrCreateLedger("Output GST", "Duties & Taxes", company);
            taxLedger.setOpeningBalance(taxLedger.getOpeningBalance().add(totalTax));
            ledgerRepository.save(taxLedger);
        }

        return savedInvoice;
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
                    l.setOpeningBalanceType("CR");
                    return ledgerRepository.save(l);
                });
    }
}
