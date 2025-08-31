
import { categories } from "../../data/categories";

export default function BaiViet3XaHoi() {
  const article = categories["HOẠT ĐỘNG XÃ HỘI"][2];

  return (
    <div>
      <h1 style={{ fontSize: "18px", fontWeight: 600, color: "#1e3a8a", marginBottom: "12px", lineHeight: "1.5", borderLeft: "4px solid #dc2626", paddingLeft: "16px" }}>
        {article.title}
      </h1>

      <p style={{ fontSize: "17px", fontWeight: "600", lineHeight: "1.7", color: "#333", marginBottom: "24px" }}>
        {"abc"}
      </p>

      {article.img && (
        <img
          src={article.img}
          alt={article.title}
          style={{ width: "100%", maxWidth: "768px", display: "block", margin: "0 auto 24px auto", borderRadius: "8px", boxShadow: "0 2px 6px rgba(0,0,0,0.15)" }}
        />
      )}

      <p style={{ fontSize: "17px", lineHeight: "1.7", color: "#222" }}>
        Đây là nội dung chi tiết của bài viết 1 thuộc chuyên mục "Hoạt động của Bộ Công An". Bạn có thể tuỳ ý thay đổi nội dung hiển thị tại đây sau này.
      </p>
    </div>
  );
}
