
export class WatermarkingService {
  async applyWatermark(imageFile: File, text: string): Promise<string> {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = await this.loadImage(imageFile);
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    ctx.font = '24px serif';
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.fillText(text, 20, canvas.height - 20);
    return canvas.toDataURL();
  }

  private loadImage(file: File): Promise<HTMLImageElement> {
    return new Promise(res => {
      const img = new Image();
      img.onload = () => res(img);
      img.src = URL.createObjectURL(file);
    });
  }
}

export const watermarkingService = new WatermarkingService();
