package com.kodekernel.billing.repository;

import com.kodekernel.billing.model.Party;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PartyRepository extends JpaRepository<Party, Long> {
    List<Party> findByCompanyId(Long companyId);
}
