package io.github.sayanroy44617.reflekt.controller;

import io.github.sayanroy44617.reflekt.model.PingResponse;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class HealthControllerTest {
    @Test
    void shouldReturnServerIsUpAndRunning() {
        // Arrange
        HealthController healthController = new HealthController();
        PingResponse response = healthController.ping().getBody();
        assertEquals(new PingResponse(), response);
    }


}