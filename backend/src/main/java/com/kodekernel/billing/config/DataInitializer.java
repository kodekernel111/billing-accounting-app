package com.kodekernel.billing.config;

import com.kodekernel.billing.model.User;
import com.kodekernel.billing.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Create Admin User if not exists
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin")); // Default password
            admin.setEmail("admin@kodekernel.com");
            admin.setRole(User.Role.ADMIN);

            userRepository.save(admin);
            System.out.println("DataInitializer: Admin user created (admin/admin)");
        }
    }
}
