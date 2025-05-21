package com.sayan.Code.Analyzer.controller;

import com.sayan.Code.Analyzer.model.Folder;
import com.sayan.Code.Analyzer.service.AnalyzeRepoService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.nio.file.Path;
import java.util.List;
import java.util.Map;

@RestController
public class AnalyzeRepoController {

    private final AnalyzeRepoService analyzeRepoService;

    public AnalyzeRepoController(AnalyzeRepoService analyzeRepoService) {
        this.analyzeRepoService = analyzeRepoService;
    }

    @GetMapping("/analyze")
    public Folder AnalyzeRepo(@RequestParam String absPath) {
        // This is the controller for analyzing the repository
        // It will handle the requests and responses for the analysis
       Folder groupedByParent =  analyzeRepoService.analyzeRepo(absPath);

        return groupedByParent;

    }

}
