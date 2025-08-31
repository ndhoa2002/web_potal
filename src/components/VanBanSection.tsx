import "./VanBanSection.css";

export default function VanBanSection() {
  return (
    <section className="vanban-section">
      <h2 className="section-title">Văn bản pháp luật</h2>
      <div className="vanban-list">
        <div className="vanban-item">
          <span className="vanban-code">Nghị định 16/2025/NĐ-CP</span>
          <a href="#">Quy định xử phạt vi phạm hành chính trong lĩnh vực an ninh</a>
        </div>
        <div className="vanban-item">
          <span className="vanban-code">Thông tư 05/2025/TT-BCA</span>
          <a href="#">Hướng dẫn cấp, quản lý thẻ căn cước công dân</a>
        </div>
        <div className="vanban-item">
          <span className="vanban-code">Quyết định 101/QĐ-BCA</span>
          <a href="#">Phê duyệt kế hoạch cải cách hành chính năm 2025</a>
        </div>
      </div>
    </section>
  );
}
