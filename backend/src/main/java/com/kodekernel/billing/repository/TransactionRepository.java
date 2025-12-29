package com.kodekernel.billing.repository;

import com.kodekernel.billing.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByCompanyId(Long companyId);
}
