package com.kodekernel.billing.repository;

import com.kodekernel.billing.model.LedgerGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface LedgerGroupRepository extends JpaRepository<LedgerGroup, Long> {
    Optional<LedgerGroup> findByName(String name);
}
