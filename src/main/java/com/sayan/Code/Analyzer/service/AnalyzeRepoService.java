package com.sayan.Code.Analyzer.service;

import com.sayan.Code.Analyzer.model.Folder;
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

    // This is the service for analyzing the repository
    // It will contain the business logic for the analysis

    public Folder  analyzeRepo(String absPath) {
        // This is the method for analyzing the repository
        // It will take the absolute path of the repository as input
        // and return the analysis result as output
        Path path = Paths.get(absPath);

        try (Stream<Path> stream = Files.walk(path)) {
            // Collect all directories and files
            Map<Path, List<Path>> groupedByParent = stream
                    .filter(Files::exists)
                    .collect(Collectors.groupingBy(
                            p -> Files.isDirectory(p) ? p : p.getParent()
                    ));

            // Filter out non-.java files
            groupedByParent.replaceAll((key, value) -> value.stream()
                    .filter(Files::isRegularFile)
                    .filter(p -> {
                        return p.toString().endsWith(".java");
                    })
                    .toList()
            );

           return buildFolderTree(path, groupedByParent);

        } catch (IOException e) {
            throw new RuntimeException(e);
        }


    }

    private Folder buildFolderTree(Path currentPath, Map<Path, List<Path>> groupedByParent) {

        List<String> files2 = new ArrayList<>();

        for(Map.Entry<Path, List<Path>> entry : groupedByParent.entrySet()) {
            List<Path> subfiles = entry.getValue();
            for(Path subfile : subfiles) {
                Path relativePath = currentPath.relativize(subfile);
                files2.add(relativePath.toString());
                System.out.println(subfile);

            }
        }

        // Return the folder structure with only the folder name and files
        return new Folder(currentPath.getFileName().toString(), files2);
    }
}
