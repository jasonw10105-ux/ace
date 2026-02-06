
export class RoomVisualizationService {
  async createRoomVisualization(artworkUrl: string, roomType: string) {
    console.log(`Rendering ${artworkUrl} in ${roomType} template...`);
    return artworkUrl;
  }
}

export const roomVisualizationService = new RoomVisualizationService();
