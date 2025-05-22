package com.sayan.Code.Analyzer.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@ToString
public class Folder {

    private String name;
    private List<Folder> subFolders;
    private List<String> files;
}
