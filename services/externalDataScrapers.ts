
import { supabase } from '../lib/supabase';
import { webScraper } from './webScraper';
import { GALLERY_NAMES, PUBLICATIONS } from '../lib/dataSources';

export class ExternalDataScrapersService {
  async scrapeAllExternalData(artistName: string) {
    const [auctions, galleries, press] = await Promise.all([
      this.scrapeAllAuctionResults(artistName),
      this.scrapeGalleryRepresentations(artistName),
      this.scrapePressCoverage(artistName)
    ]);
    return { auctionResults: auctions, galleryRepresentations: galleries, pressArticles: press };
  }

  async scrapeAllAuctionResults(artistName: string) {
    const results = await Promise.all([
      webScraper.scrapeChristiesArtist(artistName),
      webScraper.scrapeSothebysArtist(artistName)
    ]);
    return results.flat();
  }

  async scrapeGalleryRepresentations(artistName: string) {
    return [];
  }

  async scrapePressCoverage(artistName: string) {
    return [];
  }

  async scrapeArtFairParticipation(artistName: string) {
    return [];
  }
}

export const externalDataScrapers = new ExternalDataScrapersService();
