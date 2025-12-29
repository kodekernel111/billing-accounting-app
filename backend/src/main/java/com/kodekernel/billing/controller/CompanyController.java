package com.kodekernel.billing.controller;

import com.kodekernel.billing.model.Company;
import com.kodekernel.billing.model.User;
import com.kodekernel.billing.repository.CompanyRepository;
import com.kodekernel.billing.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/companies")
public class CompanyController {

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<Company> getMyCompanies() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByUsername(userDetails.getUsername()).orElseThrow();
        return companyRepository.findByOwnerId(user.getId());
    }

    @PostMapping
    public Company createCompany(@RequestBody Company company) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByUsername(userDetails.getUsername()).orElseThrow();

        company.setOwner(user);
        return companyRepository.save(company);
    }
}
