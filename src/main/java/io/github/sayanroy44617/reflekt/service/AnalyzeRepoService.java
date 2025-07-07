package io.github.sayanroy44617.reflekt.service;

import io.github.sayanroy44617.reflekt.model.File;
import io.github.sayanroy44617.reflekt.model.RequestModel.AnalyzeRequest;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Stream;

@Service
public class AnalyzeRepoService {

    // This is the service for analyzing the repository
    public List<File> analyzeRepo(AnalyzeRequest analyzeRequest) throws IOException {
        Path path = Paths.get(analyzeRequest.getAbsPath());

        try (Stream<Path> stream = Files.walk(path)) {
            List<Path> relativePaths = stream.filter(Files::isRegularFile)
                    .map(path::relativize)
                    .toList();
            return filterAndTransformPaths(relativePaths, analyzeRequest.getFileExtension());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }


    private List<File> filterAndTransformPaths(List<Path> paths, String fileExtension) {
        List<File> files = new ArrayList<>();
        paths.stream()
                .filter(path -> path.toString().endsWith(fileExtension))
                .forEach(path -> files.add(createFile(files.size() + 1, path)));
        return files;
    }

    // Creates a File object from a path
    private File createFile(int id, Path path) {
        return new File(id, path.toString());
    }


}
