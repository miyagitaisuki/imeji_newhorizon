// Thông tin giảng viên: dùng cho trang /giang-vien/ và dữ liệu Person (JSON-LD) trong src/seo.ts.
// Chỉ ghi thông tin có thật, có thể kiểm chứng. Bổ sung thêm khi có (năm tốt nghiệp, nơi đào tạo,
// link hồ sơ trên trang trường, Facebook…) để tăng độ tin cậy với Google.

export const TEACHER = {
  name: "Nguyễn Thanh Quang",
  honorific: "ThS.",
  fullTitle: "ThS. Nguyễn Thanh Quang",
  jobTitle: "Giảng viên tiếng Nhật",
  photo: "/assets/aistudio/teacher.webp",
  university: { name: "Trường Đại học Quy Nhơn", url: "https://qnu.edu.vn" },
  degree: "Thạc sĩ Ngôn ngữ học",
  jlpt: "JLPT N1",
  yearsTeaching: "Hơn 10 năm",
  // Link hồ sơ của thầy ở nơi khác (trang trường, Facebook, LinkedIn…). Thêm vào để Google nối các hồ sơ với nhau.
  sameAs: [] as string[],
};
