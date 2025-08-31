
import { categories } from "../../data/categories";

export default function BaiViet3ChiDao() {
  const article = categories["CHỈ ĐẠO ĐIỀU HÀNH"][2];

  return (
    <div>
      <h1 style={{ fontSize: "18px", fontWeight: 600, color: "#1e3a8a", marginBottom: "12px", lineHeight: "1.5", borderLeft: "4px solid #dc2626", paddingLeft: "16px" }}>
        {article.title}
      </h1>

      <p style={{ fontSize: "17px", fontWeight: "600", lineHeight: "1.7", color: "#333", marginBottom: "24px" }}>
        {"Thủ tướng Chính phủ Phạm Minh Chính vừa ký Công điện số 114/CĐ-TTg ngày 19/7/2025 về việc lật tàu dịch vụ du lịch Vịnh Xanh 58 (QN 7105) tại khu vực đảo Ti Tốp, tỉnh Quảng Ninh."}
      </p>

      <p style={{ marginBottom: "16px" }}>Công điện gửi Ban Chỉ đạo phòng thủ dân sự quốc gia; Bộ trưởng các Bộ: Quốc phòng, Công an, Xây dựng; Chủ tịch Ủy ban nhân dân tỉnh Quảng Ninh, nêu rõ:</p>
      <p style={{ marginBottom: "16px" }}>Về việc lật tàu dịch vụ du lịch Vịnh Xanh 58 (QN 7105) tại khu vực đảo Ti Tốp, tỉnh Quảng Ninh (20°52'24"' N-107°04'30"E, phía Đông của Hang Đầu Gỗ) vào hồi 15h30 ngày 19 tháng 7 năm 2025, Thủ tướng Chính phủ gửi lời thăm hỏi ân cần, chu đáo tới người bị nạn và chia buồn sâu sắc tới thân nhân, gia đình các nạn nhân tử vong; đồng thời chỉ đạo Phó Thủ tướng Chính phủ Trần Hồng Hà trực tiếp có mặt tại hiện trường chỉ đạo công tác cứu hộ, cứu nạn.</p>
      <p style={{ marginBottom: "16px" }}>Để kịp thời khắc phục hậu quả tai nạn nêu trên, Thủ tướng Chính phủ yêu cầu:</p>
      <p style={{ marginBottom: "16px" }}>1. Bộ Quốc phòng chủ trì, phối hợp với Bộ Công an và các Bộ, cơ quan, địa phương liên quan tập trung tìm mọi biện pháp và huy động lực lượng, phương tiện đang hoạt động gần khu vực tàu bị nạn khẩn trương tìm kiếm cứu nạn nhanh nhất, hiệu quả nhất. Tổ chức giải quyết tốt hậu quả, kịp thời thăm hỏi, động viên, hỗ trợ gia đình những người bị nạn. Điều tra, làm rõ nguyên nhân vụ việc, xử lý nghiêm vi phạm (nếu có); rà soát, kiểm tra toàn bộ các quy trình trong công tác bảo đảm an toàn hàng hải, tổ chức rút kinh nghiệm, khắc phục ngay các hạn chế bảo đảm tuyệt đối an toàn đối với các phương tiện, tàu thuyền đang hoạt động.</p>
      <img style={{ width: "100%", maxWidth: "768px", display: "block", margin: "0 auto 24px auto", borderRadius: "8px", boxShadow: "0 2px 6px rgba(0,0,0,0.15)" }} src="https://bocongan.gov.vn/knd/tt/PublishingImages/khainq/2025/fa80bd1562bfd4e18dae.jpg?RenditionID=7" />
      <p style={{ marginBottom: "16px" }}>2. Ban Chỉ đạo Phòng thủ dân sự quốc gia tổ chức theo dõi công tác tìm kiếm cứu nạn, kịp thời điều phối, huy động lực lượng, phương tiện để hỗ trợ triển khai công tác cứu nạn theo đề nghị của các Bộ, địa phương theo thẩm quyền, báo cáo Thủ tướng Chính phủ chỉ đạo những vấn đề phát sinh vượt thẩm quyền.</p>
      <p style={{ marginBottom: "16px" }}>3. Chủ tịch Ủy ban nhân dân tỉnh Quảng Ninh phối hợp với Bộ Quốc phòng, Bộ Công an và các cơ quan liên quan khẩn trương triển khai hiệu quả công tác tìm kiếm cứu nạn và khắc phục hậu quả vụ tai nạn, kịp thời thăm hỏi, động viên, hỗ trợ gia đình những người bị nạn, thông báo cho tàu, thuyền và ngư dân đang đánh bắt hải sản tại khu vực tàu bị nạn tăng cường quan sát, phối hợp tìm kiếm cứu nạn theo chỉ đạo của Ban Chỉ đạo Phòng thủ dân sự quốc gia.</p>
      <p style={{ marginBottom: "16px" }}>4. Bộ Xây dựng có trách nhiệm hỗ trợ người và phương tiện, thiết bị cứu nạn, cứu hộ và các trang thiết bị cần thiết theo yêu cầu của cơ quan có thẩm quyền để đáp ứng yêu cầu nhanh nhất việc tìm kiếm cứu nạn.</p>
    </div>
  );
}
