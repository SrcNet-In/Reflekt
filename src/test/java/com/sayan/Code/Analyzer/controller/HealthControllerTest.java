package com.sayan.Code.Analyzer.controller;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class HealthControllerTest {
    @Test
    void shouldReturnServerIsUpAndRunning() {
        // Arrange
        HealthController healthController = new HealthController();
        String response = healthController.ping();
        assertEquals("Server is Up and Running", response);
    }


}