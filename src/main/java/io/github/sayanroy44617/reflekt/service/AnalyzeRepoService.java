package io.github.sayanroy44617.reflekt.service;

import io.github.sayanroy44617.reflekt.model.File;
import io.github.sayanroy44617.reflekt.model.RequestModel.AnalyzeRequest;
import org.eclipse.jgit.api.Git;
import org.eclipse.jgit.api.errors.GitAPIException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Stream;

@Service
public class AnalyzeRepoService {

    private static final Logger logger = LoggerFactory.getLogger(AnalyzeRepoService.class);

    // This is the service for analyzing the repository
    public List<File> analyzeRepo(AnalyzeRequest analyzeRequest) throws IOException {
        Path path = cloneRepositoryFromUrl(analyzeRequest.absPath());
        try (Stream<Path> stream = Files.walk(path)) {
            List<Path> relativePaths = stream.filter(Files::isRegularFile)
                    .map(path::relativize)
                    .toList();
            return filterAndTransformPaths(relativePaths, analyzeRequest.fileExtension());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public static Path cloneRepositoryFromUrl(String repoUrl) {
        try {
            Path tempDir = Files.createTempDirectory(null);
            logger.info("Cloning from {} to {}", repoUrl, tempDir);
            Git.cloneRepository()
                    .setURI(repoUrl)
                    .setDirectory(tempDir.toFile())
                    .call();
            logger.info("Successfully cloned repository from {}", repoUrl);
            return tempDir;
        } catch (GitAPIException | IOException e) {
            System.err.println("Error while cloning repo: " + e.getMessage());
            throw new RuntimeException("Failed to clone repository", e);
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
