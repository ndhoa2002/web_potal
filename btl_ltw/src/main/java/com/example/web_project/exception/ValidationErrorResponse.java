package com.example.web_project.exception;

import java.util.HashMap;
import java.util.Map;

public class ValidationErrorResponse {
    private Map<String, String> errors = new HashMap<>();

    public ValidationErrorResponse() {}

    public ValidationErrorResponse(Map<String, String> errors) {
        this.errors = errors;
    }

    public Map<String, String> getErrors() {
        return errors;
    }

    public void setErrors(Map<String, String> errors) {
        this.errors = errors;
    }
}
