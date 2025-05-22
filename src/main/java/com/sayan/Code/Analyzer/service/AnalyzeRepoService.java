package com.sayan.Code.Analyzer.service;

import com.sayan.Code.Analyzer.model.Folder;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class AnalyzeRepoService {

    private Environment environment;

    public AnalyzeRepoService(Environment environment) {
        this.environment = environment;
    }

    // This is the service for analyzing the repository
    public Folder analyzeRepo(String absPath) {
        Path path = Paths.get(absPath);

        try (Stream<Path> stream = Files.walk(path)) {
            // Collect all directories and files
            Map<Path, List<Path>> groupedByParent = stream
                    .filter(Files::exists)
                    .collect(Collectors.groupingBy(
                            p -> Files.isDirectory(p) ? p : p.getParent()
                    ));

            // Filter out non-.java files
            filterFilesByType(groupedByParent);

            return buildFolderTree(path, groupedByParent);

        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private static void filterFilesByType(Map<Path, List<Path>> groupedByParent) {
        groupedByParent.replaceAll((key, value) -> value.stream()
                .filter(Files::isRegularFile)
                .filter(p -> p.toString().endsWith(".java"))
                .toList()
        );
    }

    private Folder buildFolderTree(Path currentPath, Map<Path, List<Path>> groupedByParent) {
        // Get files directly under the current folder
        List<String> files = getFilesForFolder(currentPath, groupedByParent);
        // Recursively add subfolders
        List<Folder> subfolders = getSubfolders(currentPath, groupedByParent);

        // If the current folder has no files and no subfolders, return null
        if (files.isEmpty() && subfolders.isEmpty()) {
            return null;
        }

        // Set files to null if empty
        return new Folder(currentPath.getFileName().toString(), subfolders, files.isEmpty() ? null : files);
    }

    private List<Folder> getSubfolders(Path currentPath, Map<Path, List<Path>> groupedByParent) {
        return groupedByParent.keySet().stream()
                .filter(p -> p.getParent() != null && p.getParent().equals(currentPath))
                .map(subfolderPath -> buildFolderTree(subfolderPath, groupedByParent))
                .filter(Objects::nonNull) // Exclude null subfolders
                .toList();
    }

    private static List<String> getFilesForFolder(Path currentPath, Map<Path, List<Path>> groupedByParent) {
        return Optional.ofNullable(groupedByParent.get(currentPath))
                .orElse(Collections.emptyList())
                .stream()
                .map(p -> currentPath.relativize(p).toString())
                .toList();
    }
}
