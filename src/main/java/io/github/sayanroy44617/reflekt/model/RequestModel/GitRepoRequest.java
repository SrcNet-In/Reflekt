package io.github.sayanroy44617.reflekt.model.RequestModel;

import java.util.Set;

public record GitRepoRequest(String url, String branch, Set<String> skipDirs,
                             Set<String> skipFiles) implements java.io.Serializable {
}
