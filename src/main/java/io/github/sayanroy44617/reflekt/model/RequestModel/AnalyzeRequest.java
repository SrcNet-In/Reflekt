package io.github.sayanroy44617.reflekt.model.RequestModel;


import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class AnalyzeRequest {
    private final String absPath;
    private final String fileExtension;
}
