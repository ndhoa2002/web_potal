import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


import Header from "./components/Header";
import Navbar from "./components/Navbar";
import BreakingNews from "./components/BreakingNews";
import HomeSection from "./components/HomeSection";
import CategorySection from "./components/CategorySection";
import VanBanSection from "./components/VanBanSection";
import Footer from "./components/Footer";
import QandASection from "./components/QandASection";
import Gallery from "./components/Gallery";
import BannerStrip from "./components/BannerStrip";
import Admin from "./Admin/Admin";
import UserFeedback from "./components/UserFeedback";
import ArticleDetail from "./components/ArticleDetail";

import BaiViet1BoCongAn from "./pages/tin-tuc-su-kien/BaiViet1BoCongAn";
import BaiViet2BoCongAn from "./pages/tin-tuc-su-kien/BaiViet2BoCongAn";
import BaiViet3BoCongAn from "./pages/tin-tuc-su-kien/BaiViet3BoCongAn";
import BaiViet1DiaPhuong from "./pages/tin-tuc-su-kien/BaiViet1DiaPhuong";
import BaiViet2DiaPhuong from "./pages/tin-tuc-su-kien/BaiViet2DiaPhuong";
import BaiViet3DiaPhuong from "./pages/tin-tuc-su-kien/BaiViet3DiaPhuong";
import BaiViet1ChiDao from "./pages/tin-tuc-su-kien/BaiViet1ChiDao";
import BaiViet2ChiDao from "./pages/tin-tuc-su-kien/BaiViet2ChiDao";
import BaiViet3ChiDao from "./pages/tin-tuc-su-kien/BaiViet3ChiDao";
import CongAnNgheAnBaoSo3 from "./pages/tin-tuc-su-kien/CongAnNgheAnBaoSo3";

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <div className="container">
          <Navbar />
          <BreakingNews />

          <Routes>
            {/* Trang chủ */}
            <Route
              path="/"
              element={
                <>
                  <HomeSection />
                  <CategorySection />
                  <VanBanSection />
                  <QandASection />
                  <Gallery />
                  <BannerStrip />
                </>
              }
            />

            {/* Trang Admin */}
            <Route path="/admin/*" element={<Admin />} />

            {/* Trang Phản hồi công dân */}
            <Route path="/phan-hoi" element={<UserFeedback />} />

            {/* Route động cho bài viết theo ID */}
            <Route path="/tin-tuc-su-kien/bai-viet/:id" element={<ArticleDetail />} />

            <Route path="/tin-tuc-su-kien/bai-viet">
              <Route
                path="xung-dang-la-cho-dua-vung-chac-cua-dang-bo-chinh-quyen-va-nhan-dan-thu-do-ha-noi"    
                element={<BaiViet1BoCongAn />}
              />
              <Route
                path="trien-khai-cong-tac-dac-xa-nam-2025-dot-2-dam-bao-chat-che-dung-quy-dinh"
                element={<BaiViet2BoCongAn />}
              />
              <Route
                path="dang-bo-cuc-quan-ly-xuat-nhap-canh-to-chuc-thanh-cong-dai-hoi-dai-bieu-lan-thu-ii-nhiem-ky-2025-2030"
                element={<BaiViet3BoCongAn />}
              />
              <Route
                path="canh-sat-phong-chay-chua-chay-va-cuu-nan-cuu-ho-thanh-hoa-cang-minh-trong-dem-gia-co-de-tai-xa-trieu-son"
                element={<BaiViet1DiaPhuong />}
              />
              <Route
                path="cong-an-tinh-nghe-an-khan-truong-tich-cuc-giup-nhan-dan-khac-phuc-hau-qua-con-bao-so-3"
                element={<CongAnNgheAnBaoSo3 />}
              />
              <Route
                path="phu-tho-tich-cuc-di-doi-tai-san-dam-bao-an-toan-cho-nhan-dan"
                element={<BaiViet3DiaPhuong />}
              />
              <Route
                path="chu-dong-ung-pho-voi-mua-lon-lu-ngap-lut-lu-quet-sat-lo-dat"
                element={<BaiViet1ChiDao />}
              />
              <Route
                path="luc-luong-cong-an-nhan-dan-tap-trung-ung-pho-voi-bao-so-3-va-mua-lu"
                element={<BaiViet2ChiDao />}
              />
              <Route
                path="cong-dien-cua-thu-tuong-chi-dao-khan-truong-tim-kiem-cuu-nan-khac-phuc-hau-qua-vu-lat-tau-o-quang-ninh"
                element={<BaiViet3ChiDao />}
              />
            </Route>
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;