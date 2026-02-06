
class MediaPipelineService {
  async processImage(file: File, id: string) {
    console.log(`Injecting ${file.name} into media pipeline...`);
    return { originalUrl: URL.createObjectURL(file), dominantColors: ['#000'] };
  }
}

export const mediaPipeline = new MediaPipelineService();
