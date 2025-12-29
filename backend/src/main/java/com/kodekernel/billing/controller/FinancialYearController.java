package com.kodekernel.billing.controller;

import com.kodekernel.billing.model.FinancialYear;
import com.kodekernel.billing.repository.CompanyRepository;
import com.kodekernel.billing.repository.FinancialYearRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/companies/{companyId}/fyears")
public class FinancialYearController {

    @Autowired
    private FinancialYearRepository fyRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @GetMapping
    public List<FinancialYear> getFinancialYears(@PathVariable Long companyId) {
        return fyRepository.findByCompanyId(companyId);
    }

    @PostMapping
    public ResponseEntity<?> createFinancialYear(@PathVariable Long companyId, @RequestBody FinancialYear fy) {
        return companyRepository.findById(companyId).map(company -> {
            fy.setCompany(company);
            return ResponseEntity.ok(fyRepository.save(fy));
        }).orElse(ResponseEntity.notFound().build());
    }
}
