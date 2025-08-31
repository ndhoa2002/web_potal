# Cổng thông tin điện tử bộ CA

Ứng dụng web tin tức chuyên biệt dành cho lực lượng Công an Nhân dân, cung cấp thông tin cập nhật về hoạt động, chỉ đạo điều hành và các tin tức quan trọng trong ngành.

## 📋 Mục lục

- [Tổng quan](#-tổng-quan)
- [Tính năng](#-tính-năng)
- [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [Cài đặt](#-cài-đặt)
- [Sử dụng](#-sử-dụng)
- [Cấu trúc dự án](#-cấu-trúc-dự-án)
- [API Endpoints](#-api-endpoints)
- [Đóng góp](#-đóng-góp)

## 🎯 Tổng quan

Hệ thống E-Portal là nền tảng thông tin tích hợp, cho phép:
- **Người dùng**: Đọc tin tức, xem thông báo, gửi phản hồi
- **Admin**: Quản lý bài viết, phản hồi và hệ thống

## ✨ Tính năng

### 🌐 Frontend (Người dùng)
- **Trang chủ động**: Banner tin tức tự động xoay vòng 24 bài viết mới nhất (10s/lần)
- **Danh mục tin tức**: 8 chuyên mục chính
  - An ninh trật tự
  - Chỉ đạo điều hành  
  - Đối ngoại
  - Hoạt động Bộ Công an
  - Hoạt động Công an địa phương
  - Hoạt động xã hội
  - Người tốt việc tốt
  - Phổ biến giáo dục pháp luật
- **Tính năng tương tác**:
  - Xem chi tiết bài viết
  - Gửi phản hồi/câu hỏi
  - Tìm kiếm tin tức
  - Responsive design cho mọi thiết bị

### 🛠️ Admin Panel
- **Quản lý bài viết**:
  - Tạo, sửa, xóa bài viết
  - Upload ảnh hoặc dùng URL
  - Rich text editor (TinyMCE)
  - Phân loại theo danh mục
- **Quản lý phản hồi**:
  - Xem danh sách phản hồi
  - Trả lời câu hỏi người dùng
  - Đánh dấu đã xử lý
- **Dashboard**: Thống kê tổng quan hệ thống

## 🛠️ Công nghệ sử dụng

### Frontend
- **React 18** - UI Framework
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **React Router** - Navigation
- **TinyMCE** - Rich text editor
- **CSS3** - Styling

### Backend  
- **Spring Boot 3.5.3** - Java Framework
- **Spring Security** - Authentication & Authorization
- **Spring Data JPA** - Database ORM
- **MySQL 8.0** - Database
- **JWT** - Token authentication
- **Maven** - Dependency management

### Infrastructure
- **Node.js** - Frontend runtime
- **Java 21** - Backend runtime
- **MySQL** - Database server

## 🚀 Cài đặt

### Yêu cầu hệ thống
- Node.js 18+ 
- Java 21+
- MySQL 8.0+
- Git

### 1. Clone Repository
```bash
git clone https://github.com/ToanLee5433/FE_LTW.git
cd FE_LTW-main/FE_LTW-main
```

### 2. Cài đặt Frontend Dependencies
```bash
npm install
```

### 3. Cấu hình Database
Tạo database MySQL và cập nhật connection trong `btl_ltw/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/your_database
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### 4. Khởi động ứng dụng

#### Cách 1: Sử dụng script tự động (Khuyến nghị) 
```bash
# Windows
start-all.bat

# Hoặc double-click vào file start-all.bat
```

Script này sẽ:
- ✅ Kiểm tra tiến trình đang chạy
- 🚀 Khởi động Backend (Spring Boot) trước
- ⏳ Đợi 10 giây để Backend khởi động hoàn tất  
- 🌐 Khởi động Frontend (React + Vite)
- 📊 Hiển thị thông tin các server đang chạy

#### Cách 2: Khởi động thủ công
**Terminal 1 - Backend:**
```bash
cd btl_ltw
./mvnw spring-boot:run
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### 5. Truy cập ứng dụng
- **Frontend**: http://localhost:5173 (hoặc port khác nếu đã sử dụng)
- **Backend API**: http://localhost:8080
- **Admin Panel**: http://localhost:5173/admin

### 6. Tài khoản mặc định
- **Username**: admin
- **Password**: admin123

## 📁 Cấu trúc dự án

```
📁 FE_LTW-main/
├── 📁 btl_ltw/                          # Backend Spring Boot
│   ├── 📁 src/main/java/com/example/web_project/
│   │   ├── 📁 controller/               # API Controllers
│   │   ├── 📁 entity/                   # JPA Entities
│   │   ├── 📁 repository/               # Data repositories
│   │   ├── 📁 service/                  # Business logic
│   │   ├── 📁 security/                 # Security config
│   │   └── 📁 exception/                # Exception handling
│   ├── 📁 src/main/resources/           # Config files
│   └── 📁 uploads/                      # File storage
├── 📁 src/                              # Frontend React
│   ├── 📁 Admin/                        # Admin panel components
│   │   ├── Admin.tsx                    # Main admin layout
│   │   ├── CreateArticle.tsx            # Article creation
│   │   ├── ArticleManagement.tsx        # Article CRUD
│   │   ├── FeedbackManagement.tsx       # Feedback management
│   │   └── Dashboard.tsx                # Admin dashboard
│   ├── 📁 components/                   # Reusable UI components
│   │   ├── MainNews.tsx                 # Auto-rotating news banner
│   │   ├── Header.tsx, Footer.tsx       # Layout components
│   │   ├── Navbar.tsx                   # Navigation
│   │   └── ArticleDetail.tsx            # Article viewer
│   ├── 📁 pages/                        # Page components
│   ├── 📁 data/                         # Static data
│   └── 📁 assets/                       # Static assets
├── 📁 public/                           # Public assets
│   └── 📁 images/                       # Image resources
├── 📄 start-all.bat                     # Quick start script
├── 📄 package.json                      # Frontend dependencies
└── 📄 README.md                         # Documentation
```

## 🔗 API Endpoints

### Public APIs
- `GET /api/public/articles` - Lấy danh sách bài viết
- `GET /api/public/articles/{id}` - Chi tiết bài viết
- `POST /api/public/feedback` - Gửi phản hồi
- `GET /api/public/feedback/answered` - Phản hồi đã trả lời

### Admin APIs  
- `POST /api/auth/login` - Đăng nhập admin
- `POST /api/admin/articles` - Tạo bài viết
- `PUT /api/admin/articles/{id}` - Cập nhật bài viết
- `DELETE /api/admin/articles/{id}` - Xóa bài viết
- `GET /api/admin/feedback` - Quản lý phản hồi
- `POST /api/admin/feedback/{id}/answer` - Trả lời phản hồi

## 🎨 Tính năng nổi bật

### 🔄 Auto-rotating News Banner
- Tự động xoay vòng 24 bài viết mới nhất
- Interval 10 giây/bài
- Click để chuyển manual
- Indicator dots hiển thị vị trí hiện tại

### 📝 Rich Text Editor
- TinyMCE editor đầy đủ tính năng
- Upload ảnh trực tiếp
- Preview real-time
- Support HTML formatting

### 🔐 Security Features
- JWT authentication
- Role-based access control
- XSS protection
- CORS configuration

## 🔧 Troubleshooting

### Lỗi thường gặp

#### 1. Port đã được sử dụng
```bash
# Backend (8080)
Error: Port 8080 is already in use
```
**Giải pháp**: Kiểm tra và dừng tiến trình đang dùng port 8080

#### 2. Database connection failed
```bash
Error: Unable to connect to MySQL
```
**Giải pháp**: 
- Kiểm tra MySQL server đang chạy
- Verify database credentials trong `application.properties`
- Tạo database nếu chưa có

#### 3. Frontend build errors
```bash
Error: Module not found
```
**Giải pháp**: 
```bash
rm -rf node_modules package-lock.json
npm install
```

### Performance Tips
- 🚀 **Backend**: Tăng heap size JVM nếu cần: `-Xmx512m`
- 🌐 **Frontend**: Enable gzip compression for production
- 🗄️ **Database**: Index các column thường query (title, category, created_at)

## 📊 Monitoring

### Health Checks
- **Backend**: http://localhost:8080/actuator/health
- **Frontend**: Kiểm tra console log
- **Database**: Kết nối qua MySQL Workbench

### Log Files
- **Backend**: `btl_ltw/logs/` (nếu có cấu hình)
- **Frontend**: Browser DevTools Console
- **Access**: Server access logs

## 🤝 Đóng góp

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📄 License

Dự án này được phát triển cho mục đích giáo dục và nghiên cứu.

## 👥 Đội ngũ phát triển

- **Frontend**: React + TypeScript
- **Backend**: Spring Boot + MySQL
- **UI/UX**: Responsive Web Design

---

🚀 **Chúc bạn sử dụng ứng dụng thành công!** 🚀
