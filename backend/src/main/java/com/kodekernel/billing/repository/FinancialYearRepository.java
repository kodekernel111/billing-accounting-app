package com.kodekernel.billing.repository;

import com.kodekernel.billing.model.FinancialYear;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FinancialYearRepository extends JpaRepository<FinancialYear, Long> {
    List<FinancialYear> findByCompanyId(Long companyId);
}
