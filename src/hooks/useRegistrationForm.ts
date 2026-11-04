import { useState } from "react";
import type { CourseData } from "../data/courseData";

export interface RegistrationForm {
  fullName: string;
  phone: string;
  currentLevel: string;
  targetJlpt: string;
  notes: string;
}

const LEVEL_BY_COURSE: Record<CourseData["id"], { level: string; target: string }> = {
  n5: { level: "Chưa biết gì (Người mới)", target: "JLPT N5" },
  n4: { level: "Đã hoàn thành N5", target: "JLPT N4" },
  n3: { level: "Đã hoàn thành N4", target: "JLPT N3" },
};

function scrollToForm() {
  document.getElementById("register")?.scrollIntoView({ behavior: "smooth" });
}

// Trạng thái form đăng ký + các hành động điền sẵn (chọn khóa, kết quả trắc nghiệm)
export function useRegistrationForm(initialCourse?: CourseData) {
  const [formData, setFormData] = useState<RegistrationForm>(() => ({
    fullName: "",
    phone: "",
    currentLevel: initialCourse ? LEVEL_BY_COURSE[initialCourse.id].level : "Chưa biết gì (Người mới)",
    targetJlpt: initialCourse ? LEVEL_BY_COURSE[initialCourse.id].target : "JLPT N5",
    notes: initialCourse ? `Đăng ký học thử: ${initialCourse.title}` : "",
  }));

  const selectCourse = (course: CourseData) => {
    const { level, target } = LEVEL_BY_COURSE[course.id];
    setFormData((prev) => ({
      ...prev,
      currentLevel: level,
      targetJlpt: target,
      notes: `Đăng ký học thử: ${course.title}`,
    }));
    scrollToForm();
  };

  const applyQuizResult = (level: string, targetJlpt: string) => {
    setFormData((prev) => ({
      ...prev,
      currentLevel: level,
      targetJlpt,
      notes: `Kết quả trắc nghiệm phân loại: ${level} -> Mục tiêu ${targetJlpt}`,
    }));
  };

  return { formData, setFormData, selectCourse, applyQuizResult };
}
