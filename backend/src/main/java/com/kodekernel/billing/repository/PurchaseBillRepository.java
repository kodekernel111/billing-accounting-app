package com.kodekernel.billing.repository;

import com.kodekernel.billing.model.PurchaseBill;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PurchaseBillRepository extends JpaRepository<PurchaseBill, Long> {
    List<PurchaseBill> findByCompanyId(Long companyId);
}
