// Nội dung chi tiết cho trang riêng của từng khóa: /khoa-hoc/n5/, /khoa-hoc/n4/, /khoa-hoc/n3/
// Mỗi trang nhắm một nhóm từ khóa tìm kiếm riêng (ví dụ "học tiếng Nhật N5 Quy Nhơn").
// Khi thay đổi chương trình học, sửa nội dung ở đây.

import type { CourseData } from "./courseData";

export interface CoursePhase {
  period: string;
  title: string;
  points: string[];
}

export interface JlptInfo {
  level: string;
  passMark: string;
  sections: string;
}

export interface CourseDetail {
  id: CourseData["id"];
  months: number;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string[];
  forWhom: string[];
  outcomes: string[];
  phases: CoursePhase[];
  jlpt: JlptInfo;
  materials: string[];
  faqs: { q: string; a: string }[];
}

export const COURSE_DETAILS: Record<CourseData["id"], CourseDetail> = {
  n5: {
    id: "n5",
    months: 6,
    metaTitle: "Học tiếng Nhật N5 tại Quy Nhơn – Khóa cho người mới bắt đầu | IMEJI日本語教室",
    metaDescription:
      "Khóa tiếng Nhật N5 cho người mới bắt đầu tại Quy Nhơn: Hiragana, Katakana, 25 bài Minna no Nihongo, luyện thi JLPT N5. Lớp dưới 6 bạn, học thử miễn phí 2 buổi.",
    h1: "Khóa học tiếng Nhật N5 tại Quy Nhơn cho người mới bắt đầu",
    intro: [
      "Khóa N5 Cơ Bản dành cho người bắt đầu từ con số 0. Trong 6 tháng, bạn đi từ bảng chữ cái Hiragana, Katakana đến hết 25 bài Minna no Nihongo, đủ nền tảng để tự tin giao tiếp các câu đơn giản và thi chứng chỉ JLPT N5.",
      "Lớp học trực tiếp tại 80 Võ Mười, Quy Nhơn, mỗi lớp dưới 6 học viên. Nhờ sĩ số nhỏ, thầy Quang sửa phát âm, cách viết chữ và lỗi ngữ pháp cho từng bạn ngay trong buổi học, điều mà lớp đông rất khó làm được.",
    ],
    forWhom: [
      "Người chưa từng học tiếng Nhật, hoặc mới thuộc một phần bảng chữ cái",
      "Sinh viên cần chứng chỉ tiếng Nhật cho chuẩn đầu ra hoặc chuẩn bị du học",
      "Người đi làm muốn có nền tảng tiếng Nhật để làm việc với đối tác, công ty Nhật",
      "Người yêu thích văn hóa Nhật, anime, manga và muốn hiểu tiếng Nhật bài bản",
    ],
    outcomes: [
      "Đọc, viết thành thạo Hiragana và Katakana, phát âm chuẩn",
      "Nắm khoảng 100–150 chữ Kanji thường gặp và khoảng 800 từ vựng cơ bản",
      "Dùng được ngữ pháp sơ cấp của 25 bài Minna no Nihongo trong câu nói và câu viết",
      "Giới thiệu bản thân, hỏi đường, mua sắm, nói về sinh hoạt hằng ngày",
      "Sẵn sàng làm bài thi JLPT N5 với chiến thuật phân bổ thời gian rõ ràng",
    ],
    phases: [
      {
        period: "Tháng 1",
        title: "Bảng chữ cái và phát âm",
        points: [
          "Hiragana, Katakana: cách viết, cách đọc, âm đục, âm ghép, trường âm, âm ngắt",
          "Luyện phát âm và nhịp câu tiếng Nhật ngay từ đầu",
          "Làm quen cấu trúc câu cơ bản (bài 1–2 Minna no Nihongo)",
        ],
      },
      {
        period: "Tháng 2–3",
        title: "Ngữ pháp và từ vựng nền tảng",
        points: [
          "Minna no Nihongo bài 3–13: trợ từ, động từ, tính từ, câu so sánh",
          "Kanji cơ bản: số đếm, thời gian, gia đình, địa điểm",
          "Hội thoại tình huống: mua sắm, hỏi giờ, hẹn gặp",
        ],
      },
      {
        period: "Tháng 4–5",
        title: "Thể て, thể ない và mở rộng giao tiếp",
        points: [
          "Minna no Nihongo bài 14–25: thể て, thể ない, thể từ điển, thể た, câu điều kiện",
          "Nhờ vả, xin phép, kể lại trải nghiệm",
          "Luyện nghe hiểu và đọc hiểu đoạn ngắn",
        ],
      },
      {
        period: "Tháng 6",
        title: "Tổng ôn và luyện thi JLPT N5",
        points: [
          "Hệ thống lại toàn bộ ngữ pháp, từ vựng, Kanji",
          "Làm đề thi thử có bấm giờ, chữa đề chi tiết",
          "Chiến thuật làm từng phần thi và tránh bẫy đề",
        ],
      },
    ],
    jlpt: {
      level: "N5",
      passMark: "Đỗ khi đạt từ 80/180 điểm, đồng thời phần Kiến thức ngôn ngữ – Đọc hiểu đạt tối thiểu 38/120 và phần Nghe đạt tối thiểu 19/60.",
      sections: "Kiến thức ngôn ngữ (từ vựng, chữ Hán), Ngữ pháp – Đọc hiểu, Nghe hiểu.",
    },
    materials: [
      "Giáo trình Minna no Nihongo sơ cấp (bài 1–25)",
      "Tài liệu tóm tắt ngữ pháp do thầy biên soạn",
      "Bộ flashcard Anki từ vựng và Kanji N5",
      "Đề thi JLPT N5 thử có đáp án chi tiết",
    ],
    faqs: [
      {
        q: "Học tiếng Nhật N5 mất bao lâu?",
        a: "Với lịch 2–3 buổi/tuần, mỗi buổi 90 phút, khóa N5 kéo dài khoảng 6 tháng. Nếu ôn bài đều mỗi ngày 20–30 phút với flashcard, bạn hoàn toàn có thể thi JLPT N5 ngay sau khóa học.",
      },
      {
        q: "Chưa biết chữ nào có học được khóa N5 không?",
        a: "Được. Tháng đầu tiên dành riêng cho bảng chữ cái và phát âm, thầy hướng dẫn từ cách viết từng nét.",
      },
      {
        q: "Học xong N5 có giao tiếp được không?",
        a: "Bạn sẽ giao tiếp được các tình huống đơn giản hằng ngày như giới thiệu bản thân, hỏi đường, mua sắm, hẹn gặp. Để giao tiếp tự nhiên hơn, bạn nên học tiếp khóa N4.",
      },
    ],
  },

  n4: {
    id: "n4",
    months: 6,
    metaTitle: "Học tiếng Nhật N4 tại Quy Nhơn – Luyện thi JLPT N4 | IMEJI日本語教室",
    metaDescription:
      "Khóa tiếng Nhật N4 tại Quy Nhơn cho người đã học xong N5: Minna no Nihongo bài 26–50, 300 Kanji, luyện nghe đọc và thi thử JLPT N4. Lớp dưới 6 bạn, học thử miễn phí 2 buổi.",
    h1: "Khóa học tiếng Nhật N4 tại Quy Nhơn – Luyện thi JLPT N4",
    intro: [
      "Khóa N4 Tăng Tốc dành cho bạn đã hoàn thành trình độ N5 (hoặc học xong 25 bài Minna no Nihongo). Trong 6 tháng, bạn học tiếp 25 bài sơ cấp còn lại, nâng vốn Kanji lên khoảng 300 chữ và luyện kỹ năng nghe, đọc để thi JLPT N4.",
      "N4 là giai đoạn chuyển từ câu đơn sang câu ghép và hội thoại tự nhiên. Lớp nhỏ dưới 6 bạn giúp mỗi học viên được nói nhiều, được sửa lỗi kịp thời và luyện phản xạ thay vì chỉ học lý thuyết.",
    ],
    forWhom: [
      "Người đã có chứng chỉ N5 hoặc học xong 25 bài Minna no Nihongo",
      "Sinh viên cần chứng chỉ N4 cho chuẩn đầu ra hoặc hồ sơ du học, thực tập",
      "Người chuẩn bị đi làm việc tại Nhật hoặc tại công ty Nhật cần nền tảng giao tiếp",
      "Người tự học N5 muốn hệ thống lại kiến thức và học có lộ trình",
    ],
    outcomes: [
      "Nắm ngữ pháp sơ cấp hoàn chỉnh (Minna no Nihongo bài 26–50), kể cả kính ngữ cơ bản",
      "Khoảng 300 chữ Kanji và khoảng 1.500 từ vựng",
      "Nghe hiểu hội thoại đời thường với tốc độ chậm và vừa",
      "Đọc hiểu đoạn văn ngắn về chủ đề quen thuộc",
      "Làm quen áp lực thời gian của bài thi JLPT N4 qua các đề thi thử",
    ],
    phases: [
      {
        period: "Tháng 1–2",
        title: "Câu ghép và cách nói tự nhiên",
        points: [
          "Minna no Nihongo bài 26–33: thể khả năng, thể ý chí, thể mệnh lệnh",
          "Nối câu, giải thích lý do, nói về dự định",
          "Kanji theo chủ đề với mẹo chiết tự",
        ],
      },
      {
        period: "Tháng 3–4",
        title: "Bị động, sai khiến và cho nhận",
        points: [
          "Minna no Nihongo bài 34–43: thể bị động, sai khiến, cho – nhận, phỏng đoán",
          "Luyện nghe hiểu theo chủ đề: trường học, công việc, du lịch",
          "Đọc hiểu đoạn văn ngắn và thông báo",
        ],
      },
      {
        period: "Tháng 5",
        title: "Kính ngữ và tổng hợp sơ cấp",
        points: [
          "Minna no Nihongo bài 44–50: kính ngữ, khiêm nhường ngữ cơ bản",
          "Hệ thống toàn bộ ngữ pháp sơ cấp",
          "Luyện viết đoạn văn ngắn",
        ],
      },
      {
        period: "Tháng 6",
        title: "Luyện thi JLPT N4",
        points: [
          "Đề thi thử có bấm giờ theo đúng cấu trúc đề thật",
          "Chữa đề chi tiết, phân tích lỗi sai thường gặp",
          "Chiến thuật làm phần đọc hiểu và nghe hiểu",
        ],
      },
    ],
    jlpt: {
      level: "N4",
      passMark: "Đỗ khi đạt từ 90/180 điểm, đồng thời phần Kiến thức ngôn ngữ – Đọc hiểu đạt tối thiểu 38/120 và phần Nghe đạt tối thiểu 19/60.",
      sections: "Kiến thức ngôn ngữ (từ vựng, chữ Hán), Ngữ pháp – Đọc hiểu, Nghe hiểu.",
    },
    materials: [
      "Giáo trình Minna no Nihongo sơ cấp (bài 26–50)",
      "Tài liệu tóm tắt ngữ pháp và Kanji do thầy biên soạn",
      "Bộ flashcard Anki từ vựng và Kanji N4",
      "Đề thi JLPT N4 thử có đáp án chi tiết",
    ],
    faqs: [
      {
        q: "Học N4 mất bao lâu?",
        a: "Khóa N4 kéo dài khoảng 6 tháng với lịch 2–3 buổi/tuần, mỗi buổi 90 phút.",
      },
      {
        q: "Tự học N5 rồi có vào thẳng lớp N4 được không?",
        a: "Được. Bạn làm trắc nghiệm chọn lớp trên trang hoặc đăng ký học thử 2 buổi miễn phí, thầy sẽ kiểm tra và tư vấn xem bạn nên vào thẳng N4 hay ôn lại một phần N5.",
      },
      {
        q: "Chứng chỉ N4 dùng để làm gì?",
        a: "N4 thường được dùng cho chuẩn đầu ra ngoại ngữ, hồ sơ du học và một số chương trình làm việc tại Nhật. Đây cũng là bước đệm cần thiết trước khi học N3.",
      },
    ],
  },

  n3: {
    id: "n3",
    months: 9,
    metaTitle: "Luyện thi JLPT N3 tại Quy Nhơn – Khóa tiếng Nhật N3 | IMEJI日本語教室",
    metaDescription:
      "Khóa tiếng Nhật N3 tại Quy Nhơn: 650 Kanji, ngữ pháp trung cấp, đọc hiểu văn bản dài, chiến thuật thi JLPT N3, hướng dẫn CV và phỏng vấn tiếng Nhật. Học thử miễn phí 2 buổi.",
    h1: "Khóa luyện thi JLPT N3 tại Quy Nhơn",
    intro: [
      "Khóa N3 Chuyên Sâu dành cho bạn đã hoàn thành trình độ N4. Trong 9 tháng, bạn chuyển từ sơ cấp sang trung cấp: ngữ pháp phức tạp hơn, khoảng 650 chữ Kanji, đọc hiểu văn bản dài và nghe hiểu ý ngầm trong hội thoại.",
      "N3 là trình độ nhiều doanh nghiệp Nhật dùng làm mức tối thiểu khi tuyển dụng. Ngoài luyện thi, khóa học còn hướng dẫn viết CV và luyện phỏng vấn bằng tiếng Nhật để bạn sẵn sàng ứng tuyển.",
    ],
    forWhom: [
      "Người đã có chứng chỉ N4 hoặc học xong 50 bài Minna no Nihongo",
      "Người muốn ứng tuyển vào công ty Nhật hoặc làm việc với khách hàng Nhật",
      "Sinh viên chuẩn bị du học, xin học bổng cần trình độ trung cấp",
      "Người đã thi N3 nhưng chưa đạt và muốn học lại có chiến thuật",
    ],
    outcomes: [
      "Khoảng 650 chữ Kanji và khoảng 3.700 từ vựng",
      "Nắm ngữ pháp trung cấp N3 và phân biệt các mẫu câu dễ nhầm",
      "Đọc hiểu bài báo, thông báo, văn bản công việc ở mức trung cấp",
      "Nghe hiểu hội thoại tự nhiên, nắm ý chính và ý ngầm",
      "Chiến thuật phân bổ thời gian và tránh bẫy đề JLPT N3",
      "Viết CV và trả lời phỏng vấn cơ bản bằng tiếng Nhật",
    ],
    phases: [
      {
        period: "Tháng 1–3",
        title: "Nền tảng trung cấp",
        points: [
          "Ngữ pháp N3 theo nhóm ý nghĩa, so sánh mẫu câu dễ nhầm",
          "Kanji N3 theo bộ thủ và âm Hán Việt",
          "Đọc hiểu đoạn văn trung bình",
        ],
      },
      {
        period: "Tháng 4–6",
        title: "Đọc hiểu và nghe hiểu chuyên sâu",
        points: [
          "Đọc văn bản dài: bài báo, thư từ, văn bản công việc",
          "Nghe hiểu ý chính, ý ngầm, câu trả lời nhanh",
          "Mở rộng từ vựng theo chủ đề xã hội và công việc",
        ],
      },
      {
        period: "Tháng 7–8",
        title: "Luyện đề và chiến thuật thi",
        points: [
          "Đề thi thử có bấm giờ theo cấu trúc đề thật",
          "Chiến thuật phân bổ thời gian cho từng phần",
          "Phân tích bẫy đề và lỗi sai thường gặp",
        ],
      },
      {
        period: "Tháng 9",
        title: "Tổng ôn và tiếng Nhật đi làm",
        points: [
          "Tổng ôn trọng tâm trước kỳ thi",
          "Hướng dẫn viết CV (履歴書) và luyện phỏng vấn tiếng Nhật",
          "Cách giao tiếp lịch sự nơi công sở",
        ],
      },
    ],
    jlpt: {
      level: "N3",
      passMark: "Đỗ khi đạt từ 95/180 điểm, đồng thời mỗi phần (Kiến thức ngôn ngữ, Đọc hiểu, Nghe) đạt tối thiểu 19/60.",
      sections: "Kiến thức ngôn ngữ (từ vựng, chữ Hán), Ngữ pháp – Đọc hiểu, Nghe hiểu.",
    },
    materials: [
      "Giáo trình chuẩn Nhật Bản cho N3 (Shinkanzen Master, Soumatome)",
      "Tài liệu tóm tắt ngữ pháp và Kanji N3 do thầy biên soạn",
      "Bộ flashcard Anki từ vựng và Kanji N3",
      "Đề thi JLPT N3 thử có đáp án chi tiết",
    ],
    faqs: [
      {
        q: "Luyện thi N3 mất bao lâu?",
        a: "Khóa N3 kéo dài khoảng 9 tháng với lịch 2–3 buổi/tuần, mỗi buổi 90 phút. N3 có lượng Kanji và ngữ pháp nhiều hơn hẳn N4 nên cần thời gian dài hơn.",
      },
      {
        q: "Kỳ thi JLPT tổ chức khi nào?",
        a: "Tại Việt Nam, JLPT thường được tổ chức 2 lần mỗi năm vào tháng 7 và tháng 12. Thầy sẽ tư vấn thời điểm thi phù hợp với tiến độ học của bạn.",
      },
      {
        q: "Có N3 thì xin việc công ty Nhật được không?",
        a: "Nhiều công ty Nhật và công ty có đối tác Nhật dùng N3 làm mức tối thiểu khi tuyển dụng. Khóa học có phần hướng dẫn viết CV và luyện phỏng vấn tiếng Nhật để bạn chuẩn bị tốt hơn.",
      },
    ],
  },
};
