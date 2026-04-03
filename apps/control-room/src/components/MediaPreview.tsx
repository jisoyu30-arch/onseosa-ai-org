import { Image as ImageIcon, Film, Download, ImageOff } from 'lucide-react';

interface MediaPreviewProps {
  coverImageUrl: string | null;
  videoUrl: string | null;
}

export function MediaPreview({ coverImageUrl, videoUrl }: MediaPreviewProps) {
  if (!coverImageUrl && !videoUrl) {
    return (
      <div className="bg-slate-800/60 rounded-xl p-5 border border-slate-700/50 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <ImageIcon size={16} className="text-violet-400" />
          <h2 className="text-sm font-bold text-slate-300 tracking-wide uppercase">Media</h2>
        </div>
        <div className="flex flex-col items-center justify-center py-8 text-slate-600">
          <ImageOff size={40} strokeWidth={1} />
          <p className="text-xs mt-2">미디어 도메인 작업 시 이미지/영상이 여기에 표시됩니다</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/60 rounded-xl p-5 border border-slate-700/50 mb-6 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <ImageIcon size={16} className="text-violet-400" />
        <h2 className="text-sm font-bold text-slate-300 tracking-wide uppercase">Media</h2>
      </div>

      <div className="flex gap-5 flex-wrap">
        {/* 커버 이미지 */}
        {coverImageUrl && (
          <div className="group relative">
            <div className="relative overflow-hidden rounded-lg border border-slate-700/50">
              <img
                src={coverImageUrl}
                alt="커버 이미지"
                className="w-52 h-52 object-cover img-zoom"
              />
              {/* 호버 오버레이 */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                <span className="text-[10px] text-slate-300 font-mono">3000 x 3000 JPG</span>
                <button className="flex items-center gap-1 text-xs text-white bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded-lg transition-colors">
                  <Download size={12} />
                  다운로드
                </button>
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-2">
              <ImageIcon size={12} className="text-violet-400" />
              <span className="text-[11px] text-slate-400">앨범 커버</span>
            </div>
          </div>
        )}

        {/* 비디오 */}
        {videoUrl && (
          <div className="group relative">
            <div className="relative overflow-hidden rounded-lg border border-slate-700/50">
              <video
                src={videoUrl}
                controls
                className="w-80 rounded-lg"
                style={{ maxHeight: '208px' }}
              />
            </div>
            <div className="flex items-center gap-1.5 mt-2">
              <Film size={12} className="text-blue-400" />
              <span className="text-[11px] text-slate-400">루프 영상</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
