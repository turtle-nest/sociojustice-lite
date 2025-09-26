package com.sociojustice.auth;

import com.sociojustice.auth.model.User;
import com.sociojustice.auth.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class UserRepositoryTest {

    @Autowired
    private UserRepository users;

    @Test
    void save_and_findByEmail_should_work() {
        // Given
        String email = "alice@example.com";

        if (!users.existsByEmail(email)) {
            users.save(new User(email, "password123")); // ⚠️ mot de passe en clair, juste pour test
        }

        // When
        var found = users.findByEmail(email);

        // Then
        assertThat(found).isPresent();
        assertThat(found.get().getId()).isNotNull();
        assertThat(found.get().getEmail()).isEqualTo(email);
    }
}
