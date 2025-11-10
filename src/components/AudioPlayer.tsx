import React, { useEffect, useMemo, useRef, useState } from 'react';

type AudioPlayerProps = {
  src: string;
  className?: string;
  onPlayChange?: (isPlaying: boolean) => void;
};

export default function AudioPlayer({ src, className, onPlayChange }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0..1
  const [levels, setLevels] = useState<number[] | null>(null); // 0..1 столбики "как в ТГ"

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      if (audio.duration > 0) {
        setProgress(audio.currentTime / audio.duration);
      }
    };
    const onEnded = () => {
      setIsPlaying(false);
      onPlayChange?.(false);
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);
    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEnded);
    };
  }, []);

  // Предварительный анализ громкости (RMS по сегментам) — «телеграм»-стиль
  useEffect(() => {
    let cancelled = false;
    async function analyze() {
      try {
        // Создаём/переиспользуем контекст
        const ctx = audioContextRef.current ?? new (window.AudioContext || (window as any).webkitAudioContext)();
        audioContextRef.current = ctx;
        // Загружаем и декодируем
        const resp = await fetch(src);
        const arrayBuf = await resp.arrayBuffer();
        const audioBuf = await ctx.decodeAudioData(arrayBuf.slice(0));
        const channelData = audioBuf.getChannelData(0); // берём 1 канал
        const samplesPerBar = Math.max(1, Math.floor(audioBuf.sampleRate * 0.03)); // 30 мс на столбик
        const barsCount = Math.ceil(channelData.length / samplesPerBar);
        const out: number[] = new Array(barsCount);
        for (let i = 0; i < barsCount; i++) {
          let sumSq = 0;
          let count = 0;
          const start = i * samplesPerBar;
          const end = Math.min(start + samplesPerBar, channelData.length);
          for (let j = start; j < end; j++) {
            const s = channelData[j];
            sumSq += s * s;
            count++;
          }
          const rms = Math.sqrt(sumSq / (count || 1)); // 0..1
          out[i] = rms;
        }
        // Нормализуем до 0..1 с лёгкой компрессией динамики
        const max = Math.max(...out, 0.001);
        const normalized = out.map(v => Math.pow(v / max, 0.8));
        if (!cancelled) setLevels(normalized);
      } catch {
        // Если анализ не удался — оставим levels null, UI всё равно отобразится
        setLevels(null);
      }
    }
    analyze();
    return () => {
      cancelled = true;
    };
  }, [src]);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      onPlayChange?.(false);
    } else {
      try {
        if (audioContextRef.current?.state === 'suspended') await audioContextRef.current.resume();
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          await playPromise;
        }
        setIsPlaying(true);
        onPlayChange?.(true);
      } catch {
        // Ignore play() promise rejection (autoplay policy)
      }
    }
  };

  const bars = useMemo(() => {
    // Static waveform bars that visually match a compact, modern audio scrubber
    // Heights are percentages of the viewBox height
    const heights = [20, 35, 55, 72, 82, 90, 82, 72, 55, 35, 20];
    const gap = 6;
    const barWidth = 4;
    return { heights, gap, barWidth };
  }, []);

  const Waveform = ({ color }: { color: string }) => {
    const { heights, gap, barWidth } = bars;
    const viewHeight = 100;
    const totalWidth = heights.length * barWidth + (heights.length - 1) * gap;

    return (
      <svg
        width="100%"
        viewBox={`0 0 ${totalWidth} ${viewHeight}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {heights.map((h, i) => {
          const x = i * (barWidth + gap);
          const barHeight = (h / 100) * viewHeight;
          const y = (viewHeight - barHeight) / 2;
          return (
            <rect
              key={i}
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              rx={2}
              fill={color}
            />
          );
        })}
      </svg>
    );
  };

  return (
    <div
      className={`w-full h-11 rounded-full bg-[#1f1f1f] text-white flex items-center px-3 gap-3 ${className ?? ''}`}
      role="group"
      aria-label="Аудиоплеер"
    >
      <button
        type="button"
        onClick={toggle}
        aria-label={isPlaying ? 'Пауза' : 'Воспроизвести'}
        className="w-7 h-7 rounded-full bg-white text-black flex items-center justify-center shrink-0"
      >
        {isPlaying ? (
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
            <rect x="1.5" y="1.5" width="3" height="9" rx="0.5" fill="black" />
            <rect x="7.5" y="1.5" width="3" height="9" rx="0.5" fill="black" />
          </svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
            <path d="M2 1.8L10 6L2 10.2V1.8Z" fill="black" />
          </svg>
        )}
      </button>

      <div className="relative flex-1 h-6">
        {/* Телеграм-стиль: статичные столбики. 
           База — светло-серая. Когда играет — накрываем тёмно-серым,
           а слева раскрываем обратно в светло-серый по мере прогресса. */}
        <Bars levels={levels} progress={progress} isPlaying={isPlaying} />
      </div>

      <audio ref={audioRef} src={src} className="hidden" />
    </div>
  );
}

function Bars({ levels, progress, isPlaying }: { levels: number[] | null; progress: number; isPlaying: boolean }) {
  // Если анализ не успел — покажем приятные placeholder-уровни
  const fallback = useMemo(() => {
    const n = 60;
    const arr = Array.from({ length: n }, (_, i) => 0.3 + 0.7 * Math.abs(Math.sin(i * 0.2)));
    return arr;
  }, []);
  const data = levels && levels.length > 0 ? levels : fallback;
  const gap = 4;
  const barWidth = 3;
  const viewHeight = 100;
  const totalWidth = data.length * barWidth + (data.length - 1) * gap;
  const clipWidth = Math.min(Math.max(progress, 0), 1) * totalWidth;

  return (
    <div className="absolute inset-0">
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${totalWidth} ${viewHeight}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {/* База: светло-серая, всегда видна */}
        {data.map((v, i) => {
          const x = i * (barWidth + gap);
          const h = Math.max(8, v * viewHeight);
          const y = (viewHeight - h) / 2;
          return <rect key={`base-${i}`} x={x} y={y} width={barWidth} height={h} rx={2} fill="#B0B7C3" />;
        })}

        {/* Оверлей при воспроизведении: тёмно-серый,
            но слева по прогрессу «стирается», возвращая светло-серый */}
        {isPlaying && (
          <>
            <defs>
              <clipPath id="remaining-clip">
                <rect x={clipWidth} y="0" width={Math.max(0, totalWidth - clipWidth)} height={viewHeight} />
              </clipPath>
            </defs>
            <g clipPath="url(#remaining-clip)">
              {data.map((v, i) => {
                const x = i * (barWidth + gap);
                const h = Math.max(8, v * viewHeight);
                const y = (viewHeight - h) / 2;
                return <rect key={`play-${i}`} x={x} y={y} width={barWidth} height={h} rx={2} fill="#4B5563" />;
              })}
            </g>
          </>
        )}
      </svg>
    </div>
  );
}


