package io.github.sayanroy44617.reflekt.model;

public record NodeInfo(int id, int parentId, int level, String fullPath, String parentPath, String fileName,
                       NodeType nodeType) {
}
