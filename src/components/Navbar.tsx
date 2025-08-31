import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <ul className="menu">
        <li className="menu-item home-button">
          <Link to="/" className="no-blue-link">Trang chủ</Link>
        </li>
        <li className="menu-item">
          Giới thiệu
          <ul className="dropdown">
            <li className="dropdown-item has-submenu">
              <span className="label">
                Lãnh đạo Bộ
                <span className="arrow">▶</span>
              </span>
              <ul className="sub-dropdown">
                <li>Lãnh đạo Bộ đương nhiệm</li>
                <li>Lãnh đạo Bộ qua các thời kỳ</li>
              </ul>
            </li>
            <li className="dropdown-item">Chức năng nhiệm vụ</li>
            <li className="dropdown-item">Lịch sử phát triển</li>
          </ul>
        </li>

        {/* tin tuc su kien*/}
        <li className="menu-item">
          Tin tức sự kiện
          <ul className="dropdown">
            <li className="dropdown-item has-submenu">
              <span className="label">
                Hoạt động của lực lượng Công an
                <span className="arrow">▶</span>
              </span>
              <ul className="sub-dropdown">
                <li>Hoạt động của Bộ</li>
                <li>Hoạt động của địa phương</li>
              </ul>
            </li>
            <li className="dropdown-item">Chỉ đạo điều hành</li>
            <li className="dropdown-item">Thông tin đối ngoại</li>
            <li className="dropdown-item">Tin an ninh trật tự</li>
            <li className="dropdown-item">Người tốt, việc tốt</li>
            <li className="dropdown-item">Hoạt động xã hội</li>
          </ul>
        </li>

        <li className="menu-item">
          <a href="https://bocongan.gov.vn/pbgdpl.html" className="no-blue-link">
            Phổ biến, Giáo dục pháp luật
          </a>
        </li>

        <li className="menu-item">
          Bộ với công dân
          <ul className="dropdown">
            <li className="dropdown-item">
              <Link to="/phan-hoi" className="no-blue-link">Hỏi đáp & Phản hồi công dân</Link>
            </li>
            <li className="dropdown-item">Lịch tiếp công dân</li>
          </ul>
        </li>

        <li className="menu-item">
          Thống kê
          <ul className="dropdown">
            <li className="dropdown-item">Phòng, chống tội phạm và VPPL</li>
            <li className="dropdown-item">Quản lý hành chính về trật tự xã hội</li>
            <li className="dropdown-item">Quản lý xuất nhập cảnh</li>
          </ul>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
