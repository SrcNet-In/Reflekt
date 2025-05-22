package com.sayan.Code.Analyzer.controller;

import com.sayan.Code.Analyzer.model.Folder;
import com.sayan.Code.Analyzer.model.RequestModel.AnalyzeRequest;
import com.sayan.Code.Analyzer.service.AnalyzeRepoService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
public class AnalyzeRepoController {

    private final AnalyzeRepoService analyzeRepoService;

    public AnalyzeRepoController(AnalyzeRepoService analyzeRepoService) {
        this.analyzeRepoService = analyzeRepoService;
    }

    @GetMapping("/analyze")
    public Folder AnalyzeRepo(@RequestBody AnalyzeRequest analyzeRequest) throws IOException {
        // This is the controller for analyzing the repository
        // It will handle the requests and responses for the analysis
       return analyzeRepoService.analyzeRepo(analyzeRequest);

    }

}
