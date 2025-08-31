// Sidebar.tsx
import { Link } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="box image-only">
        <img src="/images/botrong_4sao1.jpg" alt="Bộ trưởng" />
      </div>
      <div className="box">
        <h3>Chỉ đạo điều hành</h3>
        <ul>
          <li>
            <Link to="/tin-tuc-su-kien/bai-viet/chu-dong-ung-pho-voi-mua-lon-lu-ngap-lut-lu-quet-sat-lo-dat">
              Chủ động ứng phó với mưa lớn, lũ, ngập lụt, lũ quét, sạt lở đất
            </Link>
          </li>
          <li>
            <Link to="/tin-tuc-su-kien/bai-viet/luc-luong-cong-an-nhan-dan-tap-trung-ung-pho-voi-bao-so-3-va-mua-lu">
              Lực lượng Công an nhân dân tập trung ứng phó với bão số 3 và mưa lũ
            </Link>
          </li>
          <li>
            <Link to="/tin-tuc-su-kien/bai-viet/cong-dien-cua-thu-tuong-chi-dao-khan-truong-tim-kiem-cuu-nan-khac-phuc-hau-qua-vu-lat-tau-o-quang-ninh">
              Công điện của Thủ tướng chỉ đạo khẩn trương tìm kiếm cứu nạn, khắc phục hậu quả vụ lật tàu ở Quảng Ninh
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
}
