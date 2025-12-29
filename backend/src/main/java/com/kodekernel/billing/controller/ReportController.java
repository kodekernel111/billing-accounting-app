package com.kodekernel.billing.controller;

import com.kodekernel.billing.dto.TrialBalanceDTO;
import com.kodekernel.billing.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @GetMapping("/trial-balance")
    public List<TrialBalanceDTO> getTrialBalance(@RequestParam Long companyId) {
        return reportService.getTrialBalance(companyId);
    }
}
