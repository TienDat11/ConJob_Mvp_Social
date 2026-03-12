"use server";

import { generateResumeContent } from "@/lib/groq";
import {
  GenerateSummaryInput,
  generateSummarySchema,
  GenerateWorkExperienceInput,
  generateWorkExperienceSchema,
  WorkExperience,
} from "@/lib/validation";

type Language = "en" | "vi";

// ─── English Prompts ──────────────────────────────────────────────────────────

const EN_RESUME_WRITER_SYSTEM_PROMPT = `You are a professional resume writer helping job seekers create accurate, impactful resumes in ENGLISH.

LANGUAGE RULE: ALL output MUST be written in English. Do NOT use Vietnamese or any other language.

CRITICAL RULES:
- DO NOT fake metrics or statistics unless user provides them
- DO NOT inflate job titles (add "Senior", "Lead" unless explicitly stated)
- DO NOT invent company names (use "as learning project" if no company provided)
- DO include specific technologies, frameworks, and tools actually used
- DO describe what was actually built and implemented
- DO keep descriptions factual and verifiable
- DO focus on skills demonstrated rather than business impact metrics

UNIVERSAL FORMULA (use this exact structure):
Action Verb + Specific Task/Accomplishment + Tools/Methods Used + Scope/Context

Example Templates:
1. Developer: "Developed [PROJECT TYPE] [CONTEXT]. Implemented [FEATURE 1] using [TOOLS 1], [FEATURE 2] using [TOOLS 2], and [FEATURE 3] using [TOOLS 3]."
2. Marketing: "Developed marketing campaign [CONTEXT]. Implemented [STRATEGY 1] using [TOOLS 1], [STRATEGY 2] using [TOOLS 2]."

STAR METHOD (for work experience):
- Situation: What was the context?
- Task: What did you need to do?
- Action: What steps did you take?
- Result: What was the outcome?

Create bullet points following the STAR framework with quantifiable results.`;

const EN_SUMMARY_EXAMPLES = `
EXAMPLE 1 - Software Engineer:
Results-driven Software Engineer with experience developing scalable web applications. Expert in React, Node.js, and cloud technologies with a track record of implementing full-stack features including authentication, database design, and API integration. Led teams of developers through multiple product launches, applying modern development practices and version control.

EXAMPLE 2 - Frontend Developer:
Frontend Developer with experience building user interfaces using React and TypeScript. Implemented form validation with Zod and state management with React Context. Created responsive components using Tailwind CSS and integrated third-party UI library (Radix UI) for accessible interface elements. Applied modern React patterns including hooks, context providers, and error boundaries.

EXAMPLE 3 - Full-Stack Developer:
Full-Stack Developer with experience developing end-to-end applications from frontend to backend. Designed PostgreSQL database schema with Prisma ORM, implementing CRUD operations and RESTful APIs. Built responsive user interface using Next.js and Tailwind CSS, integrating authentication systems and real-time features.
`;

const EN_WORK_EXPERIENCE_EXAMPLES = `
EXAMPLE - Input: "worked at Acme Corp as frontend dev from jan 2024, built React dashboard with TypeScript and TanStack Query for state management"
Output: {"position": "Frontend Developer", "company": "Acme Corp", "startDate": "2024-01-01", "endDate": null, "description": "Developed React dashboard application using TypeScript and TanStack Query for state management."}

Note how ALL technologies from input are preserved in output.
`;

// ─── Vietnamese Prompts ───────────────────────────────────────────────────────

const VI_RESUME_WRITER_SYSTEM_PROMPT = `Bạn là một chuyên gia viết CV giúp người tìm việc tạo ra hồ sơ chuyên nghiệp, chính xác và có sức thuyết phục BẰNG TIẾNG VIỆT.

QUY TẮC NGÔN NGỮ: Toàn bộ nội dung đầu ra PHẢI được viết bằng Tiếng Việt chuẩn. KHÔNG sử dụng Tiếng Anh hoặc ngôn ngữ khác (ngoại trừ tên công nghệ kỹ thuật như React, Node.js, v.v.).

QUY TẮC BẮT BUỘC:
- KHÔNG bịa đặt số liệu hay thống kê trừ khi người dùng cung cấp
- KHÔNG thổi phồng chức danh (chỉ thêm "Senior", "Trưởng" khi được nêu rõ)
- KHÔNG bịa tên công ty (dùng "dự án cá nhân" nếu không có công ty)
- CÓ ghi rõ các công nghệ, framework, công cụ thực sự đã sử dụng
- CÓ mô tả những gì đã thực sự xây dựng và triển khai
- CÓ giữ mô tả trung thực và có thể kiểm chứng
- CÓ tập trung vào kỹ năng được thể hiện thay vì chỉ số tác động kinh doanh

CÔNG THỨC CHUẨN (áp dụng cấu trúc này):
Động từ hành động + Công việc/Thành tựu cụ thể + Công cụ/Phương pháp sử dụng + Phạm vi/Bối cảnh

Ví dụ mẫu:
1. Lập trình viên: "Phát triển [LOẠI DỰ ÁN] [BỐI CẢNH]. Triển khai [TÍNH NĂNG 1] sử dụng [CÔNG CỤ 1], [TÍNH NĂNG 2] sử dụng [CÔNG CỤ 2]."
2. Marketing: "Xây dựng chiến dịch marketing [BỐI CẢNH]. Áp dụng [CHIẾN LƯỢC 1] sử dụng [CÔNG CỤ 1], [CHIẾN LƯỢC 2] sử dụng [CÔNG CỤ 2]."

PHƯƠNG PHÁP STAR (cho kinh nghiệm làm việc):
- Tình huống: Bối cảnh là gì?
- Nhiệm vụ: Bạn cần làm gì?
- Hành động: Bạn đã thực hiện những bước nào?
- Kết quả: Kết quả đạt được là gì?

Viết các gạch đầu dòng theo khung STAR với kết quả có thể định lượng.`;

const VI_SUMMARY_EXAMPLES = `
VÍ DỤ 1 - Kỹ sư phần mềm:
Kỹ sư phần mềm có kinh nghiệm phát triển các ứng dụng web có khả năng mở rộng. Thành thạo React, Node.js và công nghệ đám mây với thành tích triển khai các tính năng full-stack bao gồm xác thực, thiết kế cơ sở dữ liệu và tích hợp API. Dẫn dắt nhóm lập trình viên qua nhiều lần ra mắt sản phẩm, áp dụng các phương pháp phát triển hiện đại và quản lý phiên bản.

VÍ DỤ 2 - Lập trình viên Frontend:
Lập trình viên Frontend có kinh nghiệm xây dựng giao diện người dùng bằng React và TypeScript. Triển khai xác thực biểu mẫu với Zod và quản lý trạng thái với React Context. Tạo các component responsive bằng Tailwind CSS và tích hợp thư viện UI bên thứ ba (Radix UI) cho các phần tử giao diện có khả năng tiếp cận. Áp dụng các pattern React hiện đại bao gồm hooks, context providers và error boundaries.

VÍ DỤ 3 - Lập trình viên Full-Stack:
Lập trình viên Full-Stack có kinh nghiệm phát triển ứng dụng toàn diện từ frontend đến backend. Thiết kế schema cơ sở dữ liệu PostgreSQL với Prisma ORM, triển khai các thao tác CRUD và RESTful API. Xây dựng giao diện người dùng responsive bằng Next.js và Tailwind CSS, tích hợp hệ thống xác thực và các tính năng thời gian thực.
`;

const VI_WORK_EXPERIENCE_EXAMPLES = `
VÍ DỤ - Đầu vào: "làm việc tại Acme Corp vị trí frontend dev từ tháng 1 năm 2024, xây dựng dashboard React với TypeScript và TanStack Query cho state management"
Đầu ra: {"position": "Lập trình viên Frontend", "company": "Acme Corp", "startDate": "2024-01-01", "endDate": null, "description": "Phát triển ứng dụng dashboard React sử dụng TypeScript và TanStack Query cho quản lý trạng thái."}

Lưu ý: Toàn bộ công nghệ từ đầu vào phải được giữ nguyên trong đầu ra.
`;

// ─── Server Actions ───────────────────────────────────────────────────────────

export async function generateSummary(
  input: GenerateSummaryInput,
  language: Language = "en",
) {
  const { jobTitle, workExperiences, educations, skills } =
    generateSummarySchema.parse(input);

  const isVi = language === "vi";
  const systemPrompt = isVi
    ? VI_RESUME_WRITER_SYSTEM_PROMPT
    : EN_RESUME_WRITER_SYSTEM_PROMPT;
  const summaryExamples = isVi ? VI_SUMMARY_EXAMPLES : EN_SUMMARY_EXAMPLES;

  const userPrompt = isVi
    ? `Tạo phần tóm tắt CV chuyên nghiệp (2-3 câu) bằng TIẾNG VIỆT dựa trên dữ liệu CV được cung cấp.

Chức danh: ${jobTitle || "Không xác định"}

Kinh nghiệm làm việc:
${workExperiences?.map(exp =>
  `• ${exp.position || "N/A"} tại ${exp.company || "N/A"} (${exp.startDate || "N/A"} - ${exp.endDate || "Hiện tại"})`
).join("\n") || "Không có"}

Học vấn:
${educations?.map(edu =>
  `• ${edu.degree || "N/A"} tại ${edu.school || "N/A"}`
).join("\n") || "Không có"}

Kỹ năng: ${skills || "Không xác định"}

QUY TẮC BẮT BUỘC:
- TOÀN BỘ nội dung phải viết bằng Tiếng Việt
- KHÔNG thổi phồng cấp bậc hay kinh nghiệm
- KHÔNG thêm số liệu hay thống kê bịa đặt
- CÓ tập trung vào kỹ năng, công nghệ và kinh nghiệm thực tế được mô tả

Cấu trúc gợi ý:
"[CẤP BẬC/VAI TRÒ] với chuyên môn về [BỘ KỸ NĂNG 1], [BỘ KỸ NĂNG 2] và [BỘ KỸ NĂNG 3]. Có kinh nghiệm [LOẠI THÀNH TÍCH] sử dụng [CÔNG NGHỆ]."

Tham khảo ví dụ về giọng văn và cấu trúc (KHÔNG sao chép nguyên văn):
${summaryExamples}

Dữ liệu CV:
${JSON.stringify({
  skills: skills,
  workExperiences: workExperiences,
  educations: educations,
}, null, 2)}

Tạo phần tóm tắt phản ánh chính xác dữ liệu được cung cấp, không bịa đặt hay thổi phồng.`
    : `Generate a professional resume summary (2-3 sentences) in ENGLISH based on the provided resume data.

Job Title: ${jobTitle || "Not specified"}

Work Experience:
${workExperiences?.map(exp =>
  `• ${exp.position || "N/A"} at ${exp.company || "N/A"} (${exp.startDate || "N/A"} - ${exp.endDate || "Present"})`
).join("\n") || "None provided"}

Education:
${educations?.map(edu =>
  `• ${edu.degree || "N/A"} from ${edu.school || "N/A"}`
).join("\n") || "None provided"}

Skills: ${skills || "Not specified"}

CRITICAL RULES:
- ALL output MUST be in English
- DO NOT inflate seniority or experience level
- DO NOT include fake statistics or metrics
- DO focus on actual skills, technologies, and experience described
- DO create a concise 2-3 sentence summary highlighting key competencies

Follow this structure:
"[ROLE LEVEL] with expertise in [SKILL SET 1], [SKILL SET 2], and [SKILL SET 3]. Proven track record of [ACHIEVEMENT TYPE] using [TECHNOLOGIES]."

Reference examples for tone and structure (DO NOT copy verbatim):
${summaryExamples}

Resume Data:
${JSON.stringify({
  skills: skills,
  workExperiences: workExperiences,
  educations: educations,
}, null, 2)}

Generate a summary that accurately represents the provided data without fabrication or exaggeration.`;

  try {
    const summary = await generateResumeContent(systemPrompt, userPrompt);

    if (!summary) throw new Error("Failed to generate summary");
    return summary;
  } catch (error) {
    console.error("Summary generation error:", error);
    throw error instanceof Error
      ? new Error(`Summary generation failed: ${error.message}`)
      : new Error("Failed to generate summary");
  }
}

export async function generateWorkExperience(
  input: GenerateWorkExperienceInput,
  language: Language = "en",
) {
  const { description } = generateWorkExperienceSchema.parse(input);

  const isVi = language === "vi";
  const systemPrompt = isVi
    ? VI_RESUME_WRITER_SYSTEM_PROMPT
    : EN_RESUME_WRITER_SYSTEM_PROMPT;
  const workExperienceExamples = isVi
    ? VI_WORK_EXPERIENCE_EXAMPLES
    : EN_WORK_EXPERIENCE_EXAMPLES;

  const userPrompt = isVi
    ? `Trích xuất dữ liệu kinh nghiệm làm việc có cấu trúc từ mô tả sau và trả về dạng JSON.

Đầu vào: "${description}"

QUY TẮC TRÍCH XUẤT:
- Trích xuất chức danh/vị trí, tên công ty, ngày bắt đầu, ngày kết thúc từ đầu vào nếu được đề cập
- Trường description: cải thiện cấu trúc cho chuyên nghiệp nhưng GIỮ NGUYÊN MỌI chi tiết kỹ thuật
- Giữ NGUYÊN tên công nghệ, pattern, framework và công cụ đúng như đề cập
- Giữ NGUYÊN mọi từ đặc tả (VD: "interceptor-based", "cross-platform", "type-safe")
- KHÔNG tóm tắt, rút gọn hoặc bỏ sót bất kỳ chi tiết kỹ thuật nào từ đầu vào
- KHÔNG thay đổi vai trò hay mục đích của công nghệ
- KHÔNG bịa đặt số liệu, thống kê hay thành tích không có trong đầu vào
- Chỉ cải thiện ngữ pháp, cấu trúc câu và giọng văn chuyên nghiệp bằng Tiếng Việt
- Sử dụng động từ hành động (Phát triển, Triển khai, Tích hợp, Cấu hình, Áp dụng, Thiết kế)
- Phần description phải viết bằng Tiếng Việt, nhưng tên công nghệ giữ nguyên tiếng Anh

ĐỊNH DẠNG ĐẦU RA - Chỉ trả về một JSON object hợp lệ:
{
  "position": "Chức danh (nếu được đề cập, không thì để chuỗi rỗng)",
  "company": "Tên công ty (nếu được đề cập, không thì để chuỗi rỗng)",
  "startDate": "Định dạng YYYY-MM-DD (nếu được đề cập, không thì null)",
  "endDate": "Định dạng YYYY-MM-DD hoặc null nếu hiện tại/đang làm",
  "description": "Mô tả chuyên nghiệp bằng Tiếng Việt, giữ nguyên TẤT CẢ chi tiết kỹ thuật từ đầu vào"
}

Tham khảo ví dụ:
${workExperienceExamples}`
    : `Extract structured work experience data from the following description and return as JSON.

Input: "${description}"

EXTRACTION RULES:
- Extract position/job title, company name, start date, end date from the input if mentioned
- For the description field: restructure for professional clarity but PRESERVE EVERY technical detail
- Keep ALL technology names, patterns, frameworks, and tools EXACTLY as mentioned
- Keep ALL specific qualifiers (e.g., "interceptor-based", "cross-platform", "type-safe")
- Do NOT summarize, compress, or omit any technical details from the input
- Do NOT change the role or purpose of technologies (e.g., if input says "dependency injection with GetIt", do NOT change it to "designed data models using GetIt")
- Do NOT invent metrics, statistics, or achievements not in the input
- Only improve grammar, sentence structure, and professional tone in English
- Use action verbs (Developed, Implemented, Integrated, Configured, Applied, Designed)

OUTPUT FORMAT - Return ONLY a valid JSON object:
{
  "position": "Job title (if mentioned, otherwise empty string)",
  "company": "Company name (if mentioned, otherwise empty string)",
  "startDate": "YYYY-MM-DD format (if mentioned, otherwise null)",
  "endDate": "YYYY-MM-DD format or null if current/present",
  "description": "Professional description in English preserving ALL technical details from input"
}

Reference examples:
${workExperienceExamples}`;

  try {
    const response = await generateResumeContent(
      systemPrompt,
      userPrompt,
      { jsonMode: true, temperature: 0.2 },
    );

    if (!response) throw new Error("Failed to generate work experience");

    const parsed = JSON.parse(response);

    return {
      position: parsed.position || "",
      company: parsed.company || "",
      description: parsed.description || "",
      startDate: parsed.startDate || undefined,
      endDate: parsed.endDate || undefined,
    } satisfies WorkExperience;
  } catch (error) {
    console.error("Work experience generation error:", error);
    throw error instanceof Error
      ? new Error(`Work experience generation failed: ${error.message}`)
      : new Error("Failed to generate work experience");
  }
}
