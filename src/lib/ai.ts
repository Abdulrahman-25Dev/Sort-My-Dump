import axios, { isAxiosError } from "axios";
import { AiResponseSchema } from "./schema";
import { getSystemPrompt, getUserPromptPrefix } from "./prompt";
import { AiResponse } from "../types";

// تعريف الإعدادات التي سيستقبلها الملف من الواجهة
interface AiConfig {
  environment: "dev" | "prod";
  apiKey: string;
  localIp: string;
  modelName: string;
  language: "ar" | "en";
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
    finalModel = config.modelName || "qwen2.5:3b";
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
      { role: "system", content: getSystemPrompt(config.language) },
      { role: "user", content: getUserPromptPrefix(config.language) + text },
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

    const message = response.data?.choices?.[0]?.message;
    const rawContent = message?.content;
    if (typeof rawContent !== "string" || !rawContent.trim()) {
      const detail =
        response.data?.error?.message ??
        message?.refusal ??
        "أعاد النموذج استجابة فارغة. تحقق من توفر النموذج وإعداداته في OpenRouter.";
      throw new Error(detail);
    }

    // تنظيف النص من أي علامات Markdown قد يضيفها النموذج بالخطأ (مثل ```json)
    // استخراج كائن JSON من أول قوس مفتوح إلى آخر قوس مغلق
    const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
    const cleanedContent = jsonMatch ? jsonMatch[0] : rawContent.trim();

    // تحويل النص إلى كائن JSON
    let jsonResponse: unknown;
    try {
      jsonResponse = JSON.parse(cleanedContent);
    } catch {
      throw new Error("أعاد النموذج نتيجة بتنسيق غير صالح. جرّب نموذجًا آخر.");
    }

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
  } catch (error: unknown) {
    if (!(error instanceof Error) || !isAxiosError(error)) {
      throw error;
    }

    const status = error.response?.status;
    const providerMessage =
      error.response?.data?.error?.message ??
      error.response?.data?.message;

    if (status === 401 || status === 403) {
      throw new Error(
        "رفض OpenRouter المفتاح. تأكد من صحة المفتاح وأنه مفعّل في حسابك.",
      );
    }

    if (status === 402) {
      throw new Error(
        "رصيدك في OpenRouter غير كافٍ. يرجى شحن الرصيد من موقع OpenRouter.",
      );
    }

    if (status === 429) {
      if (retries > 0) {
        console.warn("AI request rate-limited, retrying once...");
        return analyzeBrainDump(text, config, 0);
      }

      throw new Error(
        "لقد وصلت للحد اليومي للنموذج المجاني. حاول غداً أو جرب نموذجاً آخر.",
      );
    }

    if (retries > 0 && (!status || status >= 500)) {
      console.warn(`AI request failed, retrying... (${retries} left)`);
      return analyzeBrainDump(text, config, retries - 1);
    }

    console.error("AI request failed:", providerMessage || error.message);
    throw new Error(
      providerMessage ||
        (status
          ? `فشل طلب OpenRouter (HTTP ${status}). تحقق من إعدادات المفتاح والنموذج.`
          : "تعذّر الاتصال بخدمة الذكاء الاصطناعي. تحقق من اتصالك بالإنترنت."),
    );
  }
}
