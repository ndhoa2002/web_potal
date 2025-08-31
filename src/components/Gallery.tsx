import "./Gallery.css";

export default function Gallery() {
  return (
    <section className="gallery-section">
      <h2 className="section-title">Thư viện ảnh</h2>
      <div className="gallery-grid">
        <div className="gallery-item">
          <img src="https://img.cand.com.vn/resize/800x800/NewFiles/Images/2021/12/27/Bai_Bo_truong_1_1640563340583-1640570630570.jpg" alt="Lễ khai mạc" />
          <p>Lễ khai mạc Hội nghị Công an toàn quốc</p>
        </div>
        <div className="gallery-item">
          <img src="https://video.laocaitv.vn/uploads/00KHOANH/2023/12/ongtrinhxuantruong.jpg" alt="Ra quân" />
          <p>Lễ ra quân tấn công tội phạm</p>
        </div>
        <div className="gallery-item">
          <img src="https://congan.daklak.gov.vn/image/journal/article?img_id=1189059&t=1746763927872" alt="Tuyên dương" />
          <p>Trao thưởng chiến sĩ lập công xuất sắc</p>
        </div>
        <div className="gallery-item">
          <img src="https://img.cand.com.vn/resize/800x800/NewFiles/Images/2025/02/13/TT_phat_bieu-1739430917608.jpg" alt="Hội nghị" />
          <p>Hội nghị triển khai kế hoạch năm</p>
        </div>
      </div>
    </section>
  );
}
