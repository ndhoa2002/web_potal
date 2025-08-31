package com.example.web_project.common;

public enum Category {

    // 8 mục chính dựa trên cấu trúc website Bộ Công An
    HOAT_DONG_BO_CONG_AN("HOẠT_ĐỘNG_CỦA_BỘ_CÔNG_AN", "Hoạt động của Bộ Công an", "/hoat-dong-bo-cong-an"),
    HOAT_DONG_CONG_AN_DIA_PHUONG("HOẠT_ĐỘNG_CỦA_CÔNG_AN_ĐỊA_PHƯƠNG", "Hoạt động của Công an địa phương", "/hoat-dong-cong-an-dia-phuong"),
    DOI_NGOAI("ĐỐI_NGOẠI", "Đối ngoại", "/doi-ngoai"),
    AN_NINH_TRAT_TU("AN_NINH_TRẬT_TỰ", "An ninh, trật tự", "/an-ninh-trat-tu"),
    PHO_BIEN_GIAO_DUC_PHAP_LUAT("PHỔ_BIẾN_GIÁO_DỤC_PHÁP_LUẬT", "Phổ biến giáo dục pháp luật", "/pho-bien-giao-duc-phap-luat"),
    CHI_DAO_DIEU_HANH("CHỈ_ĐẠO_ĐIỀU_HÀNH", "Chỉ đạo điều hành", "/chi-dao-dieu-hanh"),
    NGUOI_TOT_VIEC_TOT("NGƯỜI_TỐT_VIỆC_TỐT", "Người tốt, việc tốt", "/nguoi-tot-viec-tot"),
    HOAT_DONG_XA_HOI("HOẠT_ĐỘNG_XÃ_HỘI", "Hoạt động xã hội", "/hoat-dong-xa-hoi");

    private final String categoryName;
    private final String displayName;
    private final String urlPath;

    Category(String categoryName, String displayName, String urlPath) {
        this.categoryName = categoryName;
        this.displayName = displayName;
        this.urlPath = urlPath;
    }

    public String getCategoryName() {
        return categoryName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
    
    public String getUrlPath() {
        return urlPath;
    }
}
