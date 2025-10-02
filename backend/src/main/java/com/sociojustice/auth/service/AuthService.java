package com.sociojustice.auth.service;

import com.sociojustice.auth.model.User;
import com.sociojustice.auth.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {
    private final UserRepository users;
    private final PasswordEncoder encoder;

    public AuthService(UserRepository users, PasswordEncoder encoder) {
        this.users = users;
        this.encoder = encoder;
    }

    @Transactional
    public User register(String email, String rawPassword) {
        if (users.existsByEmail(email)) {
            throw new EmailAlreadyUsedException(email);
        }

        String hashed = encoder.encode(rawPassword);

        User user = new User(email, hashed);
        return users.save(user);
    }

    public static class EmailAlreadyUsedException extends RuntimeException {
        public EmailAlreadyUsedException(String email) {
            super("Email already used: " + email);
        }
    }
}
