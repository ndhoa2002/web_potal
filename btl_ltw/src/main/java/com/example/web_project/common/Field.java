package com.example.web_project.common;

public enum Field {

    POLICIES_AND_REGIMES("Chế độ chính sách"),
    CRIME_PREVENTION_AND_COMBAT("Đấu tranh phòng chống tội phạm"),
    LEGAL_AFFAIRS("Pháp chế"),
    FIRE_SAFETY_AND_FIREFIGHTING("Phòng cháy và chữa cháy"),
    CRIMINAL_SENTENCE_ENFORCEMENT_AND_JUDICIAL_ASSISTANCE("Thi hành án hình sự và hỗ trợ tư pháp"),
    ADMINISTRATIVE_PROCEDURES("Thủ tục hành chính"),
    RECRUITMENT_AND_TRAINING("Tuyển dụng và đào tạo"),
    TRAFFIC_ORDER_AND_SAFETY("Trật tự an toàn giao thông"),
    OTHER_FIELDS("Các lĩnh vực khác");

    private final String fieldName;

    Field(String fieldName) {
        this.fieldName = fieldName;
    }

    public String getFieldName() {
        return fieldName;
    }
}
