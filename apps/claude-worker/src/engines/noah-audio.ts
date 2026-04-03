import { GoogleGenerativeAI } from '@google/generative-ai';
import { readFileSync, readdirSync } from 'fs';
import { resolve, basename, extname } from 'path';
import type { EngineOutput } from '@ons/engine-contracts';
import { loadPrompt } from '../utils/prompt-loader';

export interface AudioTrackInfo {
  filePath: string;
  trackNumber: number;
  title: string;
}

export interface AudioAnalysisResult {
  trackNumber: number;
  title: string;
  instruments: string[];
  genre: string;
  tempo: string;
  bpm?: number;
  mood: string[];
  structure: string;
  description_hints: string;
  vocal: string;
}

/**
 * 폴더에서 WAV 파일 목록을 파싱한다.
 * 파일명 형식: "01. Track Title.wav" 또는 "01.Track Title.wav"
 */
export function parseTrackFolder(folderPath: string): AudioTrackInfo[] {
  const files = readdirSync(folderPath)
    .filter(f => extname(f).toLowerCase() === '.wav')
    .sort();

  return files
    .map(filename => {
      const match = filename.match(/^(\d+)\.\s*(.+)\.wav$/i);
      if (!match) return null;
      return {
        filePath: resolve(folderPath, filename),
        trackNumber: parseInt(match[1], 10),
        title: match[2].trim(),
      };
    })
    .filter((t): t is AudioTrackInfo => t !== null)
    .sort((a, b) => a.trackNumber - b.trackNumber);
}

/**
 * 단일 트랙을 Gemini에 보내서 분석한다.
 */
export async function analyzeAudioTrack(track: AudioTrackInfo): Promise<AudioAnalysisResult> {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
  const systemPrompt = loadPrompt('noah-audio');

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction: systemPrompt,
    generationConfig: {
      temperature: 0.1,
      maxOutputTokens: 1000,
    },
  });

  // WAV 파일을 base64로 인코딩
  const audioData = readFileSync(track.filePath);
  const base64Audio = audioData.toString('base64');

  console.log(`[noah-audio] Sending track ${track.trackNumber} "${track.title}" (${(audioData.length / 1024 / 1024).toFixed(1)}MB)`);

  const result = await model.generateContent([
    {
      inlineData: {
        mimeType: 'audio/wav',
        data: base64Audio,
      },
    },
    {
      text: `트랙 번호: ${track.trackNumber}\n트랙 제목: "${track.title}"\n\n이 음원을 분석해주세요.`,
    },
  ]);

  const rawText = result.response.text();

  // markdown 코드블록 제거 후 JSON 파싱
  const cleanText = rawText.replace(/```json?/g, '').replace(/```/g, '').trim();
  let data: Record<string, unknown>;
  try {
    data = JSON.parse(cleanText);
  } catch {
    const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        data = JSON.parse(jsonMatch[0]);
      } catch {
        throw new Error(`JSON parse failed for track ${track.trackNumber}`);
      }
    } else {
      throw new Error(`No JSON found for track ${track.trackNumber}`);
    }
  }

  return {
    trackNumber: track.trackNumber,
    title: track.title,
    instruments: (data.instruments as string[]) || [],
    genre: (data.genre as string) || 'unknown',
    tempo: (data.tempo as string) || 'unknown',
    bpm: data.bpm as number | undefined,
    mood: (data.mood as string[]) || [],
    structure: (data.structure as string) || '',
    description_hints: (data.description_hints as string) || '',
    vocal: (data.vocal as string) || 'none',
  };
}

/**
 * 앨범 전체를 분석한다. 곡별로 순차 처리 (API 레이트 리밋 고려).
 */
export async function analyzeAlbum(
  folderPath: string,
  onProgress?: (current: number, total: number, title: string) => void,
): Promise<EngineOutput> {
  const tracks = parseTrackFolder(folderPath);

  if (tracks.length === 0) {
    return {
      engine: 'noah',
      status: 'fail',
      summary: `WAV 파일을 찾을 수 없습니다: ${folderPath}`,
      data: {},
    };
  }

  console.log(`[noah-audio] Found ${tracks.length} tracks in ${folderPath}`);

  const results: AudioAnalysisResult[] = [];
  const errors: string[] = [];

  for (const track of tracks) {
    onProgress?.(track.trackNumber, tracks.length, track.title);

    try {
      const analysis = await analyzeAudioTrack(track);
      results.push(analysis);
      console.log(`[noah-audio] ✓ Track ${track.trackNumber}/${tracks.length}: ${track.title} — ${analysis.instruments.join(', ')}`);
    } catch (err) {
      const msg = `Track ${track.trackNumber} "${track.title}" failed: ${(err as Error).message}`;
      console.error(`[noah-audio] ✗ ${msg}`);
      errors.push(msg);

      // 실패해도 빈 결과로 채운다
      results.push({
        trackNumber: track.trackNumber,
        title: track.title,
        instruments: [],
        genre: 'unknown',
        tempo: 'unknown',
        mood: [],
        structure: '',
        description_hints: '',
        vocal: 'unknown',
      });
    }
  }

  // 앨범 전체 요약
  const allInstruments = [...new Set(results.flatMap(r => r.instruments))];
  const allMoods = [...new Set(results.flatMap(r => r.mood))];
  const allGenres = [...new Set(results.map(r => r.genre).filter(g => g !== 'unknown'))];
  const avgBpm = Math.round(
    results.filter(r => r.bpm).reduce((sum, r) => sum + (r.bpm || 0), 0) /
    (results.filter(r => r.bpm).length || 1)
  );

  return {
    engine: 'noah',
    status: errors.length < tracks.length ? 'pass' : 'fail',
    summary: `앨범 분석 완료: ${results.length}곡 / 악기 ${allInstruments.length}종 / 평균 BPM ${avgBpm}`,
    data: {
      tracks: results,
      album_overview: {
        total_tracks: results.length,
        successful: results.length - errors.length,
        failed: errors.length,
        instruments_used: allInstruments,
        genres: allGenres,
        mood_spectrum: allMoods,
        average_bpm: avgBpm,
      },
      errors: errors.length > 0 ? errors : undefined,
    },
    nextHints: [
      `전체 ${allInstruments.length}종 악기: ${allInstruments.join(', ')}`,
      `주요 무드: ${allMoods.join(', ')}`,
      `장르: ${allGenres.join(', ')}`,
    ],
  };
}
