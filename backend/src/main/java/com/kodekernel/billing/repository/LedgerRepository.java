package com.kodekernel.billing.repository;

import com.kodekernel.billing.model.Ledger;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LedgerRepository extends JpaRepository<Ledger, Long> {
    List<Ledger> findByCompanyId(Long companyId);
}
