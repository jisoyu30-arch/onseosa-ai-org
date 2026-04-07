import OpenAI from 'openai';
import * as fs from 'fs';
import * as path from 'path';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface ImageGenerationRequest {
  prompt: string;
  size?: '1024x1024' | '1792x1024' | '1024x1792';
  quality?: 'standard' | 'hd';
  style?: 'vivid' | 'natural';
  outputDir?: string;
  filename?: string;
}

export interface ImageGenerationResult {
  success: boolean;
  url?: string;
  localPath?: string;
  revisedPrompt?: string;
  error?: string;
  cost?: string;
}

export async function generateImage(req: ImageGenerationRequest): Promise<ImageGenerationResult> {
  try {
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: req.prompt,
      n: 1,
      size: req.size || '1024x1024',
      quality: req.quality || 'standard',
      style: req.style || 'vivid',
    });

    const imageUrl = response.data[0]?.url;
    const revisedPrompt = response.data[0]?.revised_prompt;

    if (!imageUrl) {
      return { success: false, error: 'No image URL returned' };
    }

    // Download and save locally if outputDir specified
    let localPath: string | undefined;
    if (req.outputDir) {
      const dir = req.outputDir;
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      const filename = req.filename || `image-${Date.now()}.png`;
      localPath = path.join(dir, filename);

      const imgResponse = await fetch(imageUrl);
      const buffer = Buffer.from(await imgResponse.arrayBuffer());
      fs.writeFileSync(localPath, buffer);
    }

    const cost = req.quality === 'hd' ? '$0.08' : '$0.04';

    return {
      success: true,
      url: imageUrl,
      localPath,
      revisedPrompt,
      cost,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || 'Image generation failed',
    };
  }
}
