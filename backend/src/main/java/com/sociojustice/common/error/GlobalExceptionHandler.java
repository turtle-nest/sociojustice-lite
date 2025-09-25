package com.sociojustice.api.errors;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    /** Bean validation on @RequestBody (e.g. @Valid DTO) */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleBodyValidation(MethodArgumentNotValidException ex,
                                                         HttpServletRequest req) {
        var details = ex.getBindingResult().getFieldErrors().stream()
                .map(fe -> Map.of("field", fe.getField(), "message", fe.getDefaultMessage()))
                .toList();
        var body = ApiError.of(HttpStatus.BAD_REQUEST.value(), "Validation failed", req.getRequestURI(), details);
        return ResponseEntity.badRequest().body(body);
    }

    /** Bean validation on @RequestParam / @PathVariable */
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiError> handleConstraintViolation(ConstraintViolationException ex,
                                                              HttpServletRequest req) {
        var details = ex.getConstraintViolations().stream()
                .map(cv -> Map.of("property", cv.getPropertyPath().toString(), "message", cv.getMessage()))
                .toList();
        var body = ApiError.of(HttpStatus.BAD_REQUEST.value(), "Constraint violation", req.getRequestURI(), details);
        return ResponseEntity.badRequest().body(body);
    }

    /** When code throws new ResponseStatusException(...) */
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ApiError> handleResponseStatus(ResponseStatusException ex,
                                                         HttpServletRequest req) {
        var status = ex.getStatusCode().value();
        var body = ApiError.of(status, ex.getReason() != null ? ex.getReason() : "Error", req.getRequestURI());
        return ResponseEntity.status(status).body(body);
    }

    /** Catch-all fallback (last resort) */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleAny(Exception ex, HttpServletRequest req) {
        var body = ApiError.of(HttpStatus.INTERNAL_SERVER_ERROR.value(),
                ex.getMessage() != null ? ex.getMessage() : "Internal Server Error",
                req.getRequestURI());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
    }
}
