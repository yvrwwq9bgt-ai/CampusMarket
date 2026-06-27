const MAX_FILE_SIZE = 8 * 1024 * 1024;
const MAX_IMAGE_SIDE = 1000;
const IMAGE_QUALITY = 0.78;
const supportedTypes = ["image/jpeg", "image/png", "image/webp"];

export type UploadedImage = {
  dataUrl: string;
  fileName: string;
};

const loadImage = (file: File) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("画像を読み込めませんでした。別の画像を選んでください。"));
    };
    image.src = objectUrl;
  });

export const readProductImage = async (file: File): Promise<UploadedImage> => {
  if (!supportedTypes.includes(file.type)) {
    throw new Error("JPEG、PNG、WebP の画像を選択してください。");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("画像サイズは8MB以下にしてください。");
  }

  const image = await loadImage(file);
  const scale = Math.min(1, MAX_IMAGE_SIDE / Math.max(image.width, image.height));
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("画像を処理できませんでした。");
  }

  canvas.width = width;
  canvas.height = height;
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, width, height);
  context.drawImage(image, 0, 0, width, height);

  return {
    dataUrl: canvas.toDataURL("image/jpeg", IMAGE_QUALITY),
    fileName: file.name,
  };
};
