package io.github.sayanroy44617.reflekt.controller;

import io.github.sayanroy44617.reflekt.model.File;
import io.github.sayanroy44617.reflekt.model.RequestModel.AnalyzeRequest;
import io.github.sayanroy44617.reflekt.service.AnalyzeRepoService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
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
        File mockFile = new File(1, "root");

        Mockito.when(analyzeRepoService.analyzeRepo(Mockito.any(AnalyzeRequest.class))).thenReturn(List.of(mockFile));

        mockMvc.perform(post("/analyze")
                .contentType("application/json")
                .content("{\"absPath\":\"/path/to/repo\",\"fileExtension\":\".java\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].name").value("root"));
    }
}