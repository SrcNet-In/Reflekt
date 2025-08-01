package io.github.sayanroy44617.reflekt.controller;

import io.github.sayanroy44617.reflekt.model.File;
import io.github.sayanroy44617.reflekt.model.RequestModel.AnalyzeRequest;
import io.github.sayanroy44617.reflekt.service.AnalyzeRepoService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;
import java.util.Map;


@Slf4j
@RestController
public class AnalyzeRepoController {

    private final AnalyzeRepoService analyzeRepoService;

    public AnalyzeRepoController(AnalyzeRepoService analyzeRepoService) {
        this.analyzeRepoService = analyzeRepoService;
    }

    @PostMapping("/analyze")
    public List<File> AnalyzeRepo(@RequestBody Map<String, String> req) throws IOException {
        // This is the controller for analyzing the repository
        // It will handle the requests and responses for the analysis
        System.out.println("Received analyze request: " + req);
        AnalyzeRequest analyzeRequest = new AnalyzeRequest(
                req.get("absPath"),
                req.get("fileExtension")
        );
        System.out.println("Analyzing repo with path: " + analyzeRequest.absPath());
        System.out.println("File extension to analyze: " + analyzeRequest.fileExtension());
        return analyzeRepoService.analyzeRepo(analyzeRequest);
    }

}
