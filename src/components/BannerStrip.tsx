import { useState } from "react";
import "./BannerStrip.css";

export default function BannerStrip() {
  const banners = [
    { href: "http://chinhphu.vn/", src: "https://bocongan.gov.vn/knd/qc/PublishingImages/chinh-phu.png", alt: "Banner 1" },
    { href: "http://vpcqcsdt.bocongan.gov.vn/Truy-n%C3%A3-TP/%C4%90%E1%BB%91i-t%C6%B0%E1%BB%A3ng-truy-n%C3%A3?_ga=2.176256109.991060579.1753197888-97632345.1752664210", src: "https://bocongan.gov.vn/knd/qc/PublishingImages/bannercuoi/doituongtruyna_160.70.png", alt: "Banner 2" },
    { href: "https://bocongan.gov.vn/tintuc/Pages/lists.aspx?Cat=136", src: "https://bocongan.gov.vn/knd/qc/PublishingImages/BannerTrangChu/75nam160.70.jpg", alt: "Banner 3" },
    { href: "https://phapdien.moj.gov.vn/", src: "https://bocongan.gov.vn/knd/qc/PublishingImages/phap-dien.jpg", alt: "Banner 4" },
    { href: "https://www.facebook.com/profile.php?id=100063553415945&mibextid=LQQJ4d", src: "https://bocongan.gov.vn/knd/qc/PublishingImages/bannercuoi/x03_phunuca165.75.png", alt: "Banner 5" },
    { href: "http://cand.com.vn/", src: "https://bocongan.gov.vn/knd/qc/PublishingImages/congannd.png", alt: "Banner 6" },
    { href: "http://www.antv.gov.vn/", src: "https://bocongan.gov.vn/knd/qc/PublishingImages/anninhtv.png", alt: "Banner 7" },
    { href: "http://congbao.chinhphu.vn/", src: "https://bocongan.gov.vn/knd/qc/PublishingImages/cong-bao-cp.jpg", alt: "Banner 8" },
    { href: "https://fta.gov.vn/", src: "https://bocongan.gov.vn/knd/qc/PublishingImages/fta4.png", alt: "Banner 9" },
    { href: "https://paknvbqppl.moj.gov.vn/", src: "https://bocongan.gov.vn/knd/qc/PublishingImages/bannercuoi/171.61_banner_pakn2.jpg", alt: "Banner 10" },
  ];

  const VISIBLE_COUNT = 5;
  const [startIndex, setStartIndex] = useState(0);

  const handleNext = () => {
    if (startIndex + VISIBLE_COUNT < banners.length) {
      setStartIndex(startIndex + 1);
    }
  };

  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };

  const visibleBanners = banners.slice(startIndex, startIndex + VISIBLE_COUNT);

  return (
    <section className="banner-strip">
      <h2 className="section-title">Liên kết nhanh</h2>
      <div className="banner-controls">
        <button onClick={handlePrev} className="scroll-button" disabled={startIndex === 0}>
          ◀
        </button>
        <div className="banner-container">
          <div className="banner-list slide-animation">
            {visibleBanners.map((banner, index) => (
              <a
                key={index}
                href={banner.href}
                className="banner-item"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={banner.src} alt={banner.alt} />
              </a>
            ))}
          </div>
        </div>
        <button
          onClick={handleNext}
          className="scroll-button"
          disabled={startIndex + VISIBLE_COUNT >= banners.length}
        >
          ▶
        </button>
      </div>
    </section>
  );
}
