package io.github.sayanroy44617.reflekt.controller;

import io.github.sayanroy44617.reflekt.model.File;
import io.github.sayanroy44617.reflekt.model.FileInfo;
import io.github.sayanroy44617.reflekt.model.RequestModel.AnalyzeRequest;
import io.github.sayanroy44617.reflekt.model.RequestModel.GitRepoRequest;
import io.github.sayanroy44617.reflekt.model.RequestModel.NodeContentRequest;
import io.github.sayanroy44617.reflekt.service.AnalyzeRepoService;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.jgit.api.errors.GitAPIException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;
import java.util.Map;


@Slf4j
@RestController
public class AnalyzeRepoController {

    private static final Logger logger = LoggerFactory.getLogger(AnalyzeRepoController.class);

    private final AnalyzeRepoService analyzeRepoService;

    public AnalyzeRepoController(AnalyzeRepoService analyzeRepoService) {
        this.analyzeRepoService = analyzeRepoService;
    }

    @PostMapping("/analyze")
    public List<File> AnalyzeRepo(@RequestBody Map<String, String> req) throws IOException {
        // This is the controller for analyzing the repository
        // It will handle the requests and responses for the analysis
        logger.info("Received analyze request: {}", req);
        AnalyzeRequest analyzeRequest = new AnalyzeRequest(
                req.get("absPath"),
                req.get("fileExtension")
        );
        logger.info("Analyzing repo with path: {}", analyzeRequest.absPath());
        logger.info("File extension to analyze: {}", analyzeRequest.fileExtension());
        return analyzeRepoService.analyzeRepo(analyzeRequest);
    }

    @PostMapping(path = "/analyzeV2", consumes = "application/json", produces = "application/json")
    public ResponseEntity<FileInfo> AnalyzeRepoV2(@RequestBody(required = false) GitRepoRequest gitRepoRequest) throws GitAPIException {
        logger.info("Received analyzeV2 request: {}", gitRepoRequest);
        return ResponseEntity.ok(analyzeRepoService.analyzeRepo(gitRepoRequest));
    }

    @PostMapping(path = "/content", consumes = "application/json", produces = "application/json")
    public ResponseEntity<?> nodeContent(@RequestBody NodeContentRequest nodeContentRequest, @RequestParam(required = false, defaultValue = "false") boolean raw) {
//        logger.info("Received content request: {}", req);
//        NodeContentRequest nodeContentRequest = new NodeContentRequest(
//                req.get("url"),
//                req.get("filePath")
//        );
        logger.info("Received node content request : {}", nodeContentRequest);
        return ResponseEntity.ok(analyzeRepoService.fetchContent(nodeContentRequest, raw));
    }



}
