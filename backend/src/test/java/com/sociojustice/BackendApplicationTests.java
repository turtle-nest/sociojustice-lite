package com.sociojustice;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("nodb")
class BackendApplicationTests {
    @Test void contextLoads() {}
}
