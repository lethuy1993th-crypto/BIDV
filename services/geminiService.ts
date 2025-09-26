import { GoogleGenAI, Type } from "@google/genai";
import type { FormData, GenerationResult } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const encoded = reader.result?.toString().split(',')[1];
      if (encoded) {
        resolve(encoded);
      } else {
        reject(new Error("Failed to convert file to base64"));
      }
    };
    reader.onerror = error => reject(error);
  });
};


const schema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: 'Tiêu đề ngắn gọn, hấp dẫn, tối ưu SEO.'
    },
    post: {
      type: Type.STRING,
      description: 'Nội dung bài viết hoàn chỉnh, phù hợp với nền tảng, có chèn icon/emoji hợp lý và định dạng markdown cho xuống dòng.'
    },
    hashtags: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Một mảng chứa 3-5 hashtag chuẩn SEO.'
    }
  },
  required: ['title', 'post', 'hashtags']
};

export async function generateContent(data: FormData, file: File | null): Promise<GenerationResult> {
  let promptContext = data.context;
  let filePart = null;

  if (file) {
    if (file.type.startsWith('text/')) {
      const textContent = await file.text();
      promptContext += `\n\n[Dữ liệu từ tệp đính kèm ${file.name}]:\n${textContent}`;
    } else if (file.type.startsWith('image/') || file.type === 'application/pdf') {
      const base64Data = await fileToBase64(file);
      filePart = {
        inlineData: {
          mimeType: file.type,
          data: base64Data,
        },
      };
    }
  }
  
  const prompt = `
    Bạn là một chuyên gia sáng tạo nội dung truyền thông cho ngân hàng BIDV.
    Dựa vào các thông tin sau và phân tích tệp đính kèm (nếu có):
    - Dữ liệu bối cảnh (từ người dùng nhập): ${promptContext || 'Không có'}
    - Mục tiêu bài viết: ${data.goal}
    - Nền tảng đăng tải: ${data.platform}
    - Đối tượng khách hàng: ${data.audience}
    - Phong cách mong muốn: ${data.tone}

    Hãy tạo ra nội dung truyền thông tuân thủ các yêu cầu sau:
    1. Tuân thủ nghiêm ngặt bộ nhận diện thương hiệu BIDV: Văn phong phải thể hiện sự nghiêm túc, trách nhiệm, nhưng vẫn gần gũi và đáng tin cậy.
    2. Tạo Tiêu đề: Một tiêu đề ngắn gọn, hấp dẫn, thu hút sự chú ý và tối ưu cho SEO.
    3. Viết Bài đăng:
        - Nếu có tệp đính kèm, hãy phân tích nội dung của tệp đó để làm nguồn thông tin chính cho bài viết.
        - Nội dung mạch lạc, súc tích, và có cấu trúc rõ ràng. Sử dụng markdown cho xuống dòng (\\n).
        - Độ dài phải phù hợp với nền tảng đăng tải đã chọn (${data.platform}). Ví dụ: TikTok cần ngắn gọn, Website có thể dài hơn.
        - Sử dụng ngôn ngữ phù hợp với đối tượng khách hàng (${data.audience}).
        - Chèn các icon hoặc emoji một cách tinh tế, phù hợp để tăng tính tương tác và làm bài viết sinh động hơn.
    4. Tạo Hashtags: Đề xuất 3 đến 5 hashtags liên quan, chuẩn SEO, bao gồm cả hashtag thương hiệu như #BIDV.

    Vui lòng trả về kết quả dưới dạng một đối tượng JSON.
  `;

  const contents = filePart ? { parts: [{ text: prompt }, filePart] } : prompt;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.7,
      },
    });

    const jsonText = response.text.trim();
    const parsedResult = JSON.parse(jsonText);
    
    // Ensure the result conforms to the GenerationResult interface
    if (
      typeof parsedResult.title === 'string' &&
      typeof parsedResult.post === 'string' &&
      Array.isArray(parsedResult.hashtags) &&
      parsedResult.hashtags.every((h: unknown) => typeof h === 'string')
    ) {
      return parsedResult as GenerationResult;
    } else {
      throw new Error("AI response did not match the expected format.");
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate content. Please check your input and try again.");
  }
}
