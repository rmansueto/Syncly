package com.syncly.backend.user;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Base64;
import java.io.OutputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Scanner;
import org.springframework.beans.factory.annotation.Value;
@Service
public class SupabaseService {

    private final String SUPABASE_URL;
    private final String SUPABASE_KEY;
    private final String BUCKET;

    public SupabaseService(
            @Value("${supabase.url}") String supabaseUrl,
            @Value("${supabase.key}") String supabaseKey,
            @Value("${supabase.bucket}") String bucket
    ) {
        this.SUPABASE_URL = supabaseUrl;
        this.SUPABASE_KEY = supabaseKey;
        this.BUCKET = bucket;
    }

    public String uploadFile(String path, MultipartFile file) throws IOException {
        String uploadUrl = SUPABASE_URL + "/storage/v1/object/" + BUCKET + "/" + path;

        HttpURLConnection conn = (HttpURLConnection) new URL(uploadUrl).openConnection();
        conn.setDoOutput(true);
        conn.setRequestMethod("PUT");
        conn.setRequestProperty("Authorization", "Bearer " + SUPABASE_KEY);
        conn.setRequestProperty("Content-Type", file.getContentType());
        conn.setRequestProperty("x-upsert", "true");

        try (OutputStream os = conn.getOutputStream()) {
            os.write(file.getBytes());
        }

        int code = conn.getResponseCode();
        if (code >= 200 && code < 300) {
            return SUPABASE_URL + "/storage/v1/object/public/" + BUCKET + "/" + path;
        } else {
            InputStream errorStream = conn.getErrorStream();
            String error = "";
            if (errorStream != null) {
                Scanner s = new Scanner(errorStream).useDelimiter("\\A");
                error = s.hasNext() ? s.next() : "";
            }
            throw new IOException("Supabase upload failed: " + code + " " + error);
        }
    }
}