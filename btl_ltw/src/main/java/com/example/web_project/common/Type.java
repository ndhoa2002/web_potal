package com.example.web_project.common;

public enum Type {

    NEWS("Tin tức"),
    ANSWER_THE_QUESTION("Trả lời câu hỏi");

    private String typeName;

    Type(String typeName) {
        this.typeName = typeName;
    }

    public String getTypeName() {
        return typeName;
    }
}
