package com.kodekernel.billing.repository;

import com.kodekernel.billing.model.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ItemRepository extends JpaRepository<Item, Long> {
    List<Item> findByCompanyId(Long companyId);

    List<Item> findByCompanyIdAndNameContainingIgnoreCase(Long companyId, String name);
}
