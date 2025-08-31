
import { categories } from "../../data/categories";

export default function BaiViet3DoiNgoai() {
  const article = categories["ĐỐI NGOẠI"][2];

  return (
    <div>
      <h1 style={{ fontSize: "18px", fontWeight: 600, color: "#1e3a8a", marginBottom: "12px", lineHeight: "1.5", borderLeft: "4px solid #dc2626", paddingLeft: "16px" }}>
        {article.title}
      </h1>

      <p style={{ fontSize: "17px", fontWeight: "600", lineHeight: "1.7", color: "#333", marginBottom: "24px" }}>
        {"abc"}
      </p>

      <p style={{ fontSize: "17px", lineHeight: "1.7", color: "#222" }}>
        Đây là nội dung chi tiết của bài viết 1 thuộc chuyên mục "Hoạt động của Bộ Công An". Bạn có thể tuỳ ý thay đổi nội dung hiển thị tại đây sau này.
      </p>
    </div>
  );
}
