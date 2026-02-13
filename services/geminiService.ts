import { GoogleGenAI, Type } from "@google/genai";

// Always use process.env.API_KEY directly for initialization.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateKnowledge = async () => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "请生成一条适合在'知识花园'应用中展示的学习卡片。内容应当是关于自然、心理学、历史、有趣冷知识或生活智慧的。要求：温暖、治愈、具有启发性。语言为中文。",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            content: { type: Type.STRING, description: "知识内容" },
            source: { type: Type.STRING, description: "来源或分类" },
            category: { type: Type.STRING, description: "标签" },
            reward: { type: Type.NUMBER, description: "赋予的阳光值(5-15之间)" }
          },
          required: ["content", "source", "category", "reward"]
        }
      }
    });

    const data = JSON.parse(response.text || '{}');
    return {
      id: Date.now().toString(),
      content: data.content || "大自然是最好的老师。",
      source: data.source || "生活智慧",
      category: data.category || "治愈",
      reward: data.reward || 10,
      date: new Date().toLocaleDateString()
    };
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      id: Date.now().toString(),
      content: "虽然暂时连接不上知识的海洋，但你的心依然在成长。",
      source: "系统提示",
      category: "提示",
      reward: 5,
      date: new Date().toLocaleDateString()
    };
  }
};

export const generateFlowerLanguage = async (knowledge: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `用户今天学习了：'${knowledge}'。请为他的虚拟植物生成一句诗意、治愈的“花语”。
      要求：
      1. 必须包含格式：“你学会了【${knowledge}】，你的植物【比喻或拟人化的成长描述】。”
      2. 语言风格：治愈、温暖、富有想象力。
      3. 长度控制在30字以内。`,
      config: {
        temperature: 0.8,
        topP: 0.95,
      }
    });

    return response.text.trim();
  } catch (error) {
    console.error("Gemini Flower Language Error:", error);
    return `你学会了【${knowledge}】，你的植物正在静静地吸收这份养分。`;
  }
};