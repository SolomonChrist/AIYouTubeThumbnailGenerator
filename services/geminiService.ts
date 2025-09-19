import { GoogleGenAI, Modality, Part } from "@google/genai";

const PROMPT_VARIATIONS = [
    "hyper-realistic, dramatic lighting, high contrast, cinematic",
    "minimalist, clean background, focus on subject, modern font",
    "energetic, explosive background, dynamic pose, bright popping colors",
    "professional, corporate style, subtle background graphics, clear typography",
    "vintage, retro filter, old-school font, grainy texture",
    "tech-focused, futuristic HUD elements, neon glow, dark background",
    "hand-drawn, cartoonish style, bold outlines, playful",
    "shocked expression, clickbait style, large arrows and circles, bold text",
    "luxurious, elegant theme, gold and black color palette, sophisticated font",
];

const getMimeType = (base64: string): string | null => {
    const signatures: { [key: string]: string } = {
        'R0lGOD': 'image/gif',
        'iVBORw0KGgo': 'image/png',
        '/9j/': 'image/jpeg'
    };
    for (const s in signatures) {
        if (base64.startsWith(s)) {
            return signatures[s];
        }
    }
    return 'image/png'; // Default
};


export const generateThumbnails = async (
  apiKey: string,
  headshotBase64: string,
  videoTopic: string,
  styleInspirationBase64: string | null
): Promise<string[]> => {
    if (!apiKey) {
        throw new Error("API Key is missing.");
    }
    const ai = new GoogleGenAI({ apiKey });

    const headshotMimeType = getMimeType(headshotBase64);

    if (!headshotMimeType) {
        throw new Error('Could not determine mime type of headshot image.');
    }

    const generationPromises = PROMPT_VARIATIONS.map(async (variation) => {
        const prompt = `
        You are an expert YouTube thumbnail designer. Your task is to create a viral, click-worthy 16:9 aspect ratio thumbnail.

        **Video Topic:** "${videoTopic}"

        **Style & Instructions:**
        - **Main Subject:** The person from the provided "Headshot Image" MUST be the central focus. Isolate them from their original background.
        - **Background:** Generate a new, clean, and contextually relevant background that matches the video topic.
        - **Text:** Incorporate the video topic or a catchy, related phrase as bold, high-contrast text. Use a font optimized for YouTube (e.g., thick, sans-serif).
        - **Composition:** Apply the principles of top-performing thumbnails: strong colors, clear subject, minimal clutter, and an emotionally engaging expression (excitement, shock, curiosity).
        - **Specific Style for this variation:** ${variation}.
        - **Inspiration:** If a "Style Inspiration Image" is provided, use it as a reference for color palette, text style, and overall mood.

        Generate ONLY the image. Do not output any text, markdown, or other commentary. Just the thumbnail image.
      `;

      const contents: Part[] = [
        { inlineData: { data: headshotBase64, mimeType: headshotMimeType }},
        { text: prompt },
      ];

      if (styleInspirationBase64) {
        const styleMimeType = getMimeType(styleInspirationBase64);
        if (styleMimeType) {
            contents.push({ inlineData: { data: styleInspirationBase64, mimeType: styleMimeType }});
        }
      }

      try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
            contents: { parts: contents },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });

        // The model can return both text and image, we only want the image.
        const imagePart = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
        if (imagePart && imagePart.inlineData) {
            return `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
        }
        throw new Error('No image was generated for one of the variations.');
      } catch (error) {
          console.error(`Error generating variation "${variation}":`, error);
          // Return a placeholder or re-throw to fail the whole batch
          throw new Error(`API call failed. Please check if your API key is valid and has permissions.`);
      }
    });

    return Promise.all(generationPromises);
};
