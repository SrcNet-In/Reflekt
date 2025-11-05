package io.github.sayanroy44617.reflekt.service;

import io.github.sayanroy44617.reflekt.model.*;
import io.github.sayanroy44617.reflekt.model.RequestModel.AnalyzeRequest;
import io.github.sayanroy44617.reflekt.model.RequestModel.GitRepoRequest;
import io.github.sayanroy44617.reflekt.model.RequestModel.NodeContentRequest;
import org.eclipse.jgit.api.Git;
import org.eclipse.jgit.api.errors.GitAPIException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.stream.Stream;

@Service
public class AnalyzeRepoService {

    private static final Logger logger = LoggerFactory.getLogger(AnalyzeRepoService.class);

    @Value("${git.repo.base-path}")
    private String gitRepoBasePath;

    @Value("#{'${git.repo.skip-dirs}'.split(',')}")
    private Set<String> gitSkipDirs;

    @Value("#{'${git.repo.skip-files}'.split(',')}")
    private Set<String> gitSkipFiles;

    public FileInfo analyzeRepo(GitRepoRequest gitRepoRequest) throws GitAPIException {
        if (!isValid(gitRepoRequest)) {
            throw new IllegalArgumentException("Invalid GitRepoRequest");
        }
        Path repoPath = getLatestRepo(gitRepoRequest);
        logger.info("Analyzing repository at path: {}", repoPath);
        Set<String> skipDirs = mergeSets(gitSkipDirs, gitRepoRequest.skipDirs());

        Set<String> skipFiles = mergeSets(gitSkipFiles, gitRepoRequest.skipFiles());

        List<NodeInfo> nodes = crawl(repoPath, 0, 0,
                "", "",
                skipDirs, skipFiles, new ArrayList<>());

        return new FileInfo(
                gitRepoRequest.url(),
                nodes
        );
    }

    public Object fetchContent(NodeContentRequest nodeContentRequest, boolean raw) {
        if (!isValid(nodeContentRequest)) {
            throw new IllegalArgumentException("Invalid Node content request");
        }
        Path repoPath = buildRepoPath(nodeContentRequest.url());
        Path filePath = Paths.get(repoPath.toString(), nodeContentRequest.path());
        if (!Files.exists(filePath)) {
            throw new IllegalArgumentException("File does not exist at path: " + filePath);
        }
        try {
            String content = Files.readString(filePath);
            if (raw) {
                return content;
            }
            return new NodeContent(content);
        } catch (IOException e) {
            logger.error("Failed to read file at path: {}", filePath, e);
            throw new RuntimeException("Failed to read file", e);
        }
    }

    private boolean isValid(NodeContentRequest nodeContentRequest) {
        return nodeContentRequest != null
                && nodeContentRequest.url() != null
                && !nodeContentRequest.url().isBlank()
                && nodeContentRequest.path() != null
                && !nodeContentRequest.path().isBlank();
    }

    private List<NodeInfo> crawl(Path repoPath, int level, int parentId, String relativePath, String parentPath,
                                 Set<String> skipDirs, Set<String> skipFiles, List<NodeInfo> nodes) {
        Path fullPath = Paths.get(repoPath.toString(), relativePath);
        logger.debug("crawling path: {}", fullPath);
        for (java.io.File file : Objects.requireNonNull(fullPath.toFile().listFiles())) {
            int id = nodes.size() + 1;
            String fileName = file.getName();
            String currPath = relativePath + "/" + fileName;
            if (file.isDirectory()) {
                if (skipDirs.contains(currPath))
                    continue;
                logger.debug("found({}) directory at : {}, at path {}", id, file.getName(), currPath);
                NodeInfo dirNode = new NodeInfo(
                        id,
                        parentId,
                        level,
                        currPath,
                        parentPath,
                        fileName,
                        NodeType.DIRECTORY
                );
                nodes.add(dirNode);
                crawl(repoPath, level + 1, id, currPath, fileName, skipDirs, skipFiles, nodes);
            } else {
                if (skipFiles.contains(currPath))
                    continue;
                logger.debug("found({}) file at : {}, at path {}", id, file.getName(), currPath);
                NodeInfo fileNode = new NodeInfo(
                        id,
                        parentId,
                        level,
                        currPath,
                        parentPath,
                        fileName,
                        NodeType.FILE
                );
                nodes.add(fileNode);
            }
        }
        return nodes;
    }

    @SafeVarargs
    private static <T> Set<T> mergeSets(Set<T>... sets) {
        Set<T> mergedSet = new HashSet<>();
        for (Set<T> set : sets) {
            if (set != null && !set.isEmpty()) {
                mergedSet.addAll(set);
            }
        }
        return mergedSet;
    }

    private boolean isValid(GitRepoRequest gitRepoRequest) {
        return gitRepoRequest != null
                && gitRepoRequest.url() != null
                && !gitRepoRequest.url().isBlank();
    }

    private Path getLatestRepo(GitRepoRequest gitRepoRequest) {
        Path repoPath = buildRepoPath(gitRepoRequest.url());
        if (Files.exists(repoPath)) {
            logger.info("Repository already exists at path: {}", repoPath);
            try (Git git = Git.open(repoPath.toFile())) {
                git.pull().call();
                logger.info("Pulled latest changes for repository at path: {}", repoPath);
            } catch (IOException | GitAPIException e) {
                logger.error("Failed to pull repository at path: {}", repoPath, e);
                throw new RuntimeException("Failed to pull repository", e);
            }
        } else {
            logger.info("Repository does not exist at path: {}", repoPath);
            var git = Git.cloneRepository()
                    .setURI(gitRepoRequest.url())
                    .setDirectory(repoPath.toFile());
            if (gitRepoRequest.branch() != null && !gitRepoRequest.branch().isBlank()) {
                git.setBranch(gitRepoRequest.branch());
            }
            try {
                git.call();
                logger.info("Cloned repository to path: {}", repoPath);
            } catch (GitAPIException e) {
                logger.error("Failed to clone repository to path: {}", repoPath, e);
                throw new RuntimeException("Failed to clone repository", e);
            }
        }
        return repoPath;
    }

    private Path buildRepoPath(String url) {
        String[] repoParts = url.split("/");
        if (!isValidGitUrl(url) || repoParts.length < 2)
            throw new IllegalArgumentException("Invalid GitRepoRequest");
        String repoDir = repoParts[repoParts.length - 2];
        String repoName = repoParts[repoParts.length - 1];
        return Path.of(gitRepoBasePath, repoDir, repoName);
    }

    private boolean isValidGitUrl(String url) {
        return url != null &&
                (url.startsWith("http://")
                        || url.startsWith("https://")
                        || url.startsWith("git@")
                );
    }

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
