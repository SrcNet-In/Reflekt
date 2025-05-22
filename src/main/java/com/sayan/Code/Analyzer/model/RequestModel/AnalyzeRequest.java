package com.sayan.Code.Analyzer.model.RequestModel;


import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class AnalyzeRequest {
    private final String absPath;
    private final String fileExtension;
}
