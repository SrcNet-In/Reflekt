package com.sayan.Code.Analyzer.controller;

import com.sayan.Code.Analyzer.model.Folder;
import com.sayan.Code.Analyzer.model.RequestModel.AnalyzeRequest;
import com.sayan.Code.Analyzer.service.AnalyzeRepoService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AnalyzeRepoController.class)
class AnalyzeRepoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private AnalyzeRepoService analyzeRepoService;

    @TestConfiguration
    static class testConfig
    {
        @Bean
        public AnalyzeRepoService analyzeRepoService() {
            return Mockito.mock(AnalyzeRepoService.class);
        }
    }

    @Test
    void shouldReturnFolderStructureWhenCalled() throws Exception {
        Folder mockFolder = new Folder("root", List.of(), List.of("file1.txt", "file2.txt"));

        Mockito.when(analyzeRepoService.analyzeRepo(Mockito.any(AnalyzeRequest.class))).thenReturn(mockFolder);

        mockMvc.perform(get("/analyze")
                .contentType("application/json")
                .content("{\"absPath\":\"/path/to/repo\",\"fileExtension\":\".java\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("root"))
                .andExpect(jsonPath("$.subFolders").isArray())
                .andExpect(jsonPath("$.files[0]").value("file1.txt"))
                .andExpect(jsonPath("$.files[1]").value("file2.txt"));
    }
}