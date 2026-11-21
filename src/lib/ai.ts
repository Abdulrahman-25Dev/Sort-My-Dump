import axios from "axios";
import { AiResponseSchema } from "./schema";
import { SYSTEM_PROMPT, USER_PROMPT_PREFIX } from "./prompt";
import { AiResponse } from "../types";

// تعريف الإعدادات التي سيستقبلها الملف من الواجهة
interface AiConfig {
  environment: "dev" | "prod";
  apiKey: string;
  localIp: string;
  modelName: string;
}

export async function analyzeBrainDump(
  text: string,
  config: AiConfig,
  retries = 2,
): Promise<AiResponse> {
  let url = "";
  let headers = {};
  let finalModel = config.modelName;

  // 1. تحديد المسار (تطوير أم إنتاج)
  if (config.environment === "dev") {
    url = `http://${config.localIp}:11434/v1/chat/completions`;
    finalModel = config.modelName || "qwen2.5:3b"; // افتراضي إذا كان الحقل فارغاً
    headers = { "Content-Type": "application/json" };
  } else {
    url = "https://openrouter.ai/api/v1/chat/completions";
    finalModel = config.modelName || "meta-llama/llama-3.2-3b-instruct:free";
    headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
      "HTTP-Referer": "https://sortmydump.app", // مطلوب من OpenRouter
      "X-Title": "SortMyDump",
    };
  }

  // 2. تجهيز الطلب
  const payload = {
    model: finalModel,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: USER_PROMPT_PREFIX + text },
    ],
    response_format: { type: "json_object" }, // إجبار النموذج على إرجاع JSON
    temperature: 0.1, // تقليل العشوائية
  };

  try {
    // إرسال الطلب
    const response = await axios.post(url, payload, {
      headers,
      timeout: 60000,
    }); // 60 ثانية لأن النماذج المحلية قد تتأخر

    const rawContent = response.data.choices[0].message.content;

    // تنظيف النص من أي علامات Markdown قد يضيفها النموذج بالخطأ (مثل ```json)
    const cleanedContent = rawContent
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // تحويل النص إلى كائن JSON
    const jsonResponse = JSON.parse(cleanedContent);

    // التحقق من أن الـ JSON يطابق المخطط (Schema)
    const validatedData = AiResponseSchema.parse(jsonResponse);

    // إضافة حقل isDone (لأن الذكاء الاصطناعي لا يعرفه) للاستخدام في الواجهة
    const finalData: AiResponse = {
      ...validatedData,
      categories: validatedData.categories.map((category) => ({
        ...category,
        ideas: category.ideas.map((idea) => ({
          ...idea,
          isDone: false as boolean,
        })), // التعديل هنا
      })),
    };

    return finalData;
  } catch (error: any) {
    // إذا فشل الاتصال أو كان الـ JSON غير صالح، نعيد المحاولة
    if (retries > 0) {
      console.warn(`AI request failed, retrying... (${retries} left)`);
      return analyzeBrainDump(text, config, retries - 1);
    }

    // إذا انتهت المحاولات، نرمي رسالة خطأ مفهومة للمستخدم
    console.error("AI Error:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.error?.message ||
        "فشل في تحليل النص. تأكد من اتصالك بالشبكة أو صحة المفتاح.",
    );
  }
}
