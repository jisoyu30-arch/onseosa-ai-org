import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { parseTrackFolder } from './noah-audio';
import { mkdtempSync, writeFileSync, rmSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

describe('parseTrackFolder', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), 'noah-audio-test-'));
  });

  afterEach(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });

  it('WAV 파일을 트랙 번호 순으로 파싱한다', () => {
    writeFileSync(join(tempDir, '02. Second Track.wav'), '');
    writeFileSync(join(tempDir, '01. First Track.wav'), '');
    writeFileSync(join(tempDir, '03. Third Track.wav'), '');

    const tracks = parseTrackFolder(tempDir);

    expect(tracks).toHaveLength(3);
    expect(tracks[0].trackNumber).toBe(1);
    expect(tracks[0].title).toBe('First Track');
    expect(tracks[1].trackNumber).toBe(2);
    expect(tracks[2].trackNumber).toBe(3);
  });

  it('WAV가 아닌 파일은 무시한다', () => {
    writeFileSync(join(tempDir, '01. Track.wav'), '');
    writeFileSync(join(tempDir, '02. Track.mp3'), '');
    writeFileSync(join(tempDir, 'readme.txt'), '');

    const tracks = parseTrackFolder(tempDir);
    expect(tracks).toHaveLength(1);
  });

  it('파일명 형식이 맞지 않으면 건너뛴다', () => {
    writeFileSync(join(tempDir, '01. Valid.wav'), '');
    writeFileSync(join(tempDir, 'no-number.wav'), '');
    writeFileSync(join(tempDir, 'random.wav'), '');

    const tracks = parseTrackFolder(tempDir);
    expect(tracks).toHaveLength(1);
    expect(tracks[0].title).toBe('Valid');
  });

  it('빈 폴더는 빈 배열을 반환한다', () => {
    const tracks = parseTrackFolder(tempDir);
    expect(tracks).toEqual([]);
  });

  it('트랙 번호 앞 0을 올바르게 파싱한다', () => {
    writeFileSync(join(tempDir, '09. Ninth.wav'), '');
    writeFileSync(join(tempDir, '10. Tenth.wav'), '');

    const tracks = parseTrackFolder(tempDir);
    expect(tracks[0].trackNumber).toBe(9);
    expect(tracks[1].trackNumber).toBe(10);
  });

  it('제목에 마침표가 포함되어도 파싱한다', () => {
    writeFileSync(join(tempDir, '01. Dr. Dre Beat.wav'), '');

    const tracks = parseTrackFolder(tempDir);
    expect(tracks).toHaveLength(1);
    expect(tracks[0].title).toBe('Dr. Dre Beat');
  });

  it('filePath가 절대 경로다', () => {
    writeFileSync(join(tempDir, '01. Test.wav'), '');

    const tracks = parseTrackFolder(tempDir);
    expect(tracks[0].filePath).toContain(tempDir);
    expect(tracks[0].filePath).toContain('01. Test.wav');
  });
});
