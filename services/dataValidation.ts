
import { z } from 'zod';

export const artworkSchema = z.object({
  title: z.string().min(1),
  price: z.number().positive(),
  medium: z.string().min(1)
});

class DataValidationService {
  validateArtwork(data: any) {
    return artworkSchema.safeParse(data);
  }
}

export const dataValidation = new DataValidationService();
