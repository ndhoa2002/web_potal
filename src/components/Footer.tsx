import "./Footer.css";

export default function Footer() {
  return (
    <><footer className="footer">
      <div className="footer-menu">
        <a href="#">TRANG CHỦ</a>
        <a href="#">GIỚI THIỆU</a>
        <a href="#">TIN TỨC SỰ KIỆN</a>
        <a href="#">PHỔ BIẾN, GIÁO DỤC PHÁP LUẬT</a>
        <a href="#">BỘ VỚI CÔNG DÂN</a>
        <a href="#">THỐNG KÊ</a>
      </div>

      <div className="footer-main">
        <p className="footer-title"><strong>CỔNG THÔNG TIN ĐIỆN TỬ BỘ CÔNG AN</strong></p>
        <p className="footer-info">
          Địa chỉ: 30 Trần Bình Trọng - Hai Bà Trưng - Hà Nội. <br />
          Điện thoại: 069.2343647. <br />
          Website: <a href="https://www.mps.gov.vn">www.mps.gov.vn</a> hoặc <a href="https://bocongan.gov.vn">www.bocongan.gov.vn</a>
        </p>
      </div>


    </footer>
    <div className="footer-bottom">
        <p>Bản quyền thuộc về Bộ Công an.</p>
        <p>Khi sử dụng lại thông tin, đề nghị ghi rõ nguồn "Cổng TTĐT Bộ Công an"</p>
      </div></>
  );
}
