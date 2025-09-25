package com.sociojustice.api.errors;

import java.time.Instant;
import java.util.List;

/** Minimal error payload returned to clients */
public record ApiError(
        boolean error,
        int status,
        String message,
        String path,
        Instant timestamp,
        List<?> details   // ✅ accepte List de n’importe quoi (Maps, Strings…)
) {
    public static ApiError of(int status, String message, String path, List<?> details) {
        return new ApiError(true, status, message, path, Instant.now(), details);
    }
    public static ApiError of(int status, String message, String path) {
        return of(status, message, path, null);
    }
}
