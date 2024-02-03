import Compressor from 'compressorjs';
import { blobToWebP } from 'webp-converter-browser';

export const compressImage = async (file: File) => {
  const compressed = await new Promise<File | Blob>(
    resolve =>
      new Compressor(file, {
        quality: 0.6,
        success: resolve,
      })
  );
  return await blobToWebP(compressed);
};
