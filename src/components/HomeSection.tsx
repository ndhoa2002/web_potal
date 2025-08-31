import MainNews from "./MainNews";
import Sidebar from "./Sidebar";
import "./HomeSection.css";

export default function HomeSection() {
  return (
    <div className="home-section">
      <MainNews />
      <Sidebar />
    </div>
  );
}
