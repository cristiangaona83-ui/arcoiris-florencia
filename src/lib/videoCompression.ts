import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

// Núcleo de FFmpeg (WASM) servido desde un CDN versionado (no se agrega al
// repositorio ni al bundle: se descarga bajo demanda solo cuando se sube un
// video). Versión fija para evitar sorpresas si el CDN actualiza "latest".
const CORE_VERSION = "0.12.10";
const CORE_BASE_URL = `https://unpkg.com/@ffmpeg/core@${CORE_VERSION}/dist/esm`;

const MAX_LONG_EDGE = 1920;
const MAX_SHORT_EDGE = 1080;

let ffmpegPromise: Promise<FFmpeg> | null = null;

/** Carga (una sola vez por sesión) la instancia de FFmpeg WASM. */
async function loadFFmpeg(): Promise<FFmpeg> {
  if (!ffmpegPromise) {
    ffmpegPromise = (async () => {
      const ffmpeg = new FFmpeg();
      await ffmpeg.load({
        coreURL: await toBlobURL(`${CORE_BASE_URL}/ffmpeg-core.js`, "text/javascript"),
        wasmURL: await toBlobURL(`${CORE_BASE_URL}/ffmpeg-core.wasm`, "application/wasm"),
      });
      return ffmpeg;
    })();
  }
  return ffmpegPromise;
}

export interface VideoMetadata {
  width: number;
  height: number;
  durationSeconds: number;
}

/** Lee dimensiones y duración de un video usando un elemento <video> oculto. */
export function readVideoMetadata(source: Blob): Promise<VideoMetadata> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(source);
    const video = document.createElement("video");
    video.preload = "metadata";
    video.muted = true;
    video.src = url;
    video.onloadedmetadata = () => {
      const metadata = {
        width: video.videoWidth,
        height: video.videoHeight,
        durationSeconds: video.duration,
      };
      URL.revokeObjectURL(url);
      resolve(metadata);
    };
    video.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("No se pudo leer la información del video."));
    };
  });
}

/** Captura un fotograma del video como miniatura JPEG. */
export function captureVideoThumbnail(source: Blob): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(source);
    const video = document.createElement("video");
    video.preload = "metadata";
    video.muted = true;
    video.src = url;
    video.onloadeddata = () => {
      video.currentTime = Math.min(1, video.duration / 2);
    };
    video.onseeked = () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error("No se pudo generar la miniatura."));
        return;
      }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(url);
          if (blob) resolve(blob);
          else reject(new Error("No se pudo generar la miniatura."));
        },
        "image/jpeg",
        0.85
      );
    };
    video.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("No se pudo generar la miniatura."));
    };
  });
}

export interface VideoCompressionResult {
  blob: Blob;
  width: number;
  height: number;
  durationSeconds: number;
}

/**
 * Comprime/optimiza un video en el navegador con FFmpeg WASM: reduce a un
 * máximo de 1080p (sin agrandar videos ya menores) y reencoda a MP4/H.264
 * en calidad web. No se conserva el archivo original ni temporales: solo
 * se guarda el resultado final.
 */
export async function compressVideo(
  file: File,
  onProgress: (ratio: number) => void
): Promise<VideoCompressionResult> {
  const inputMeta = await readVideoMetadata(file);
  const needsScaling =
    Math.max(inputMeta.width, inputMeta.height) > MAX_LONG_EDGE ||
    Math.min(inputMeta.width, inputMeta.height) > MAX_SHORT_EDGE;

  const ffmpeg = await loadFFmpeg();
  const handleProgress = ({ progress }: { progress: number }) => {
    onProgress(Math.min(1, Math.max(0, progress)));
  };
  ffmpeg.on("progress", handleProgress);

  const inputName = "input" + (file.name.match(/\.\w+$/)?.[0] || ".mp4");
  const outputName = "output.mp4";

  try {
    await ffmpeg.writeFile(inputName, await fetchFile(file));

    const args = ["-i", inputName];
    if (needsScaling) {
      args.push(
        "-vf",
        `scale=w='if(gt(iw,ih),${MAX_LONG_EDGE},${MAX_SHORT_EDGE})':h='if(gt(iw,ih),${MAX_SHORT_EDGE},${MAX_LONG_EDGE})':force_original_aspect_ratio=decrease`
      );
    }
    args.push(
      "-c:v",
      "libx264",
      "-preset",
      "veryfast",
      "-crf",
      "26",
      "-c:a",
      "aac",
      "-b:a",
      "128k",
      "-movflags",
      "+faststart",
      outputName
    );

    await ffmpeg.exec(args);
    const data = await ffmpeg.readFile(outputName);
    // ffmpeg.readFile() tipa su resultado como Uint8Array<ArrayBufferLike>
    // (compatible con SharedArrayBuffer), pero Blob exige un ArrayBuffer
    // concreto: se copia a un Uint8Array respaldado por un buffer propio.
    const bytes = typeof data === "string" ? new TextEncoder().encode(data) : new Uint8Array(data);
    const blob = new Blob([bytes], { type: "video/mp4" });
    const outputMeta = await readVideoMetadata(blob);

    return {
      blob,
      width: outputMeta.width,
      height: outputMeta.height,
      durationSeconds: outputMeta.durationSeconds,
    };
  } finally {
    ffmpeg.off("progress", handleProgress);
    // No se conservan archivos temporales en el sistema de archivos virtual.
    await ffmpeg.deleteFile(inputName).catch(() => {});
    await ffmpeg.deleteFile(outputName).catch(() => {});
  }
}
