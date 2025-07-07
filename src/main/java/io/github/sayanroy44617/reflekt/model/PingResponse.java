package io.github.sayanroy44617.reflekt.model;

public record PingResponse(String status) {
    public PingResponse() {
        this("Service is up and running");
    }
}
