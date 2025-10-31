package io.github.sayanroy44617.reflekt.model;

import java.util.List;

public record FileInfo(String gitRepoUrl, List<NodeInfo> nodes) {
}
