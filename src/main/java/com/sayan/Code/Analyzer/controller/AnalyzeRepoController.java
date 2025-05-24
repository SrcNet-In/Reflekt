package com.sayan.Code.Analyzer.controller;

import com.sayan.Code.Analyzer.model.File;
import com.sayan.Code.Analyzer.model.RequestModel.AnalyzeRequest;
import com.sayan.Code.Analyzer.service.AnalyzeRepoService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.nio.file.Path;
import java.util.List;


@Slf4j
@RestController
public class AnalyzeRepoController {

    private final AnalyzeRepoService analyzeRepoService;

    public AnalyzeRepoController(AnalyzeRepoService analyzeRepoService) {
        this.analyzeRepoService = analyzeRepoService;
    }

    @PostMapping("/analyze")
    public List<File> AnalyzeRepo(@RequestBody AnalyzeRequest analyzeRequest) throws IOException {
        // This is the controller for analyzing the repository
        // It will handle the requests and responses for the analysis
        System.out.println("Analyzing repo with path: " + analyzeRequest.getAbsPath());
       return analyzeRepoService.analyzeRepo(analyzeRequest);

    }

}
