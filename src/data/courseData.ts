export interface CourseData {
  id: "n5" | "n4" | "n3";
  title: string;
  tag: string;
  duration: string;
  price: string;
  targetAudience: string;
  highlight?: boolean;
  features: string[];
}

export const COURSES: CourseData[] = [
  {
    id: "n5",
    title: "Khóa N5 Cơ Bản",
    tag: "Căn bản vững chắc",
    duration: "6 tháng",
    price: "900.000",
    targetAudience: "Dành cho người mới bắt đầu từ con số 0",
    highlight: false,
    features: [
      "Bảng chữ cái Hiragana & Katakana phát âm chuẩn Tokyo",
      "Kanji căn bản (100 - 150 chữ Hán thường gặp)",
      "25 bài ngữ pháp chuẩn giáo trình Minna no Nihongo",
      "Hội thoại đời sống thường nhật & phản xạ câu đơn",
    ],
  },
  {
    id: "n4",
    title: "Khóa N4 Tăng Tốc",
    tag: "Học viên yêu thích",
    duration: "6 tháng",
    price: "900.000",
    targetAudience: "Dành cho người đã hoàn thành xong N5",
    highlight: true,
    features: [
      "Ngữ pháp trung cấp N4 toàn diện (25 bài tiếp theo)",
      "Mở rộng vốn Kanji lên 300 chữ với mẹo chiết tự",
      "Luyện nghe hiểu & đọc hiểu chuyên sâu theo chủ đề",
      "Thi thử JLPT mô phỏng chuẩn áp lực thời gian thi thật",
    ],
  },
  {
    id: "n3",
    title: "Khóa N3 Chuyên Sâu",
    tag: "Bứt phá trung cấp",
    duration: "9 tháng",
    price: "900.000",
    targetAudience: "Cánh cửa làm việc cho doanh nghiệp Nhật Bản",
    highlight: false,
    features: [
      "Đọc hiểu văn bản học thuật & thương mại doanh nghiệp",
      "Từ vựng & ngữ pháp chuyên sâu (650 chữ Kanji)",
      "Chiến thuật phân bổ thời gian & bẫy đề thi JLPT N3",
      "Hướng dẫn làm CV & phỏng vấn xin việc tiếng Nhật",
    ],
  },
];

export const ROADMAP_STEPS = [
  {
    step: "Giai đoạn 1",
    title: "Bắt đầu",
    time: "Tuần đầu",
    desc: "Làm quen bảng chữ cái, phát âm chuẩn Tokyo, quy tắc bút thuận Kanji.",
  },
  {
    step: "Giai đoạn 2",
    title: "N5 Cơ Bản",
    time: "6 tháng",
    desc: "Hoàn thiện 25 bài Minna no Nihongo, giao tiếp câu đơn và tự tin thi N5.",
  },
  {
    step: "Giai đoạn 3",
    title: "N4 Tăng Tốc",
    time: "6 tháng",
    desc: "Ngữ pháp ghép, hội thoại tự nhiên, nâng vốn từ lên 1.500 từ.",
  },
  {
    step: "Giai đoạn 4",
    title: "N3 Chuyên Sâu",
    time: "9 tháng",
    desc: "Xử lý văn dài, hiểu ý ngầm trong đoạn hội thoại, ngữ pháp trung cấp.",
  },
  {
    step: "Đích đến",
    title: "JLPT Success",
    time: "Bền vững",
    desc: "Sẵn sàng thi đỗ JLPT N3/N2 và ứng tuyển công ty Nhật hoặc du học.",
  },
];

export const FAQS = [
  {
    q: "Người chưa biết gì về tiếng Nhật có học được không?",
    a: "Hoàn toàn có thể. Khóa N5 được thiết kế chuyên biệt cho người bắt đầu từ con số 0. Thầy sẽ hướng dẫn bạn từ cách cầm bút viết chữ cái Hiragana, Katakana đến quy tắc ghép âm chuẩn xác.",
  },
  {
    q: "Lớp học tổ chức online hay offline?",
    a: "Hiện tại các lớp học được tổ chức trực tiếp (offline) tại địa chỉ 80 Võ Mười, Quy Nhơn nhằm đảm bảo tính tương tác cao nhất và sửa lỗi phát âm trực tiếp. Học viên có thể xem lại tài liệu và làm bài trên hệ thống số hóa.",
  },
  {
    q: "Lớp có cam kết đầu ra chứng chỉ JLPT không?",
    a: "Có. Học viên tham gia tối thiểu 90% số buổi học và hoàn thành các bài tập, bài thi thử theo quy định sẽ được hỗ trợ tối đa để đạt mục tiêu kỳ thi JLPT gần nhất.",
  },
  {
    q: "Học liệu của lớp gồm những gì?",
    a: "Tài liệu tự biên soạn, bộ flashcard Anki, đề thi JLPT thử có đáp án chi tiết và bài luyện nghe theo từng giai đoạn của khóa học.",
  },
];
