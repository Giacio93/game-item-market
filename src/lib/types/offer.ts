import { Item } from './items';

export type OfferStatus = 'NEW' | 'NEGOTIATION' | 'ACCEPTED' | 'REJECTED';

export type Offer = {
  id: string;
  item_id: string;
  nickname: string;
  contact: string;
  amount: number;
  message: string | null;
  status: OfferStatus;
  created_at: string;
  updated_at: string;
};

export type OfferWithItem = Offer & {
  item: Pick<
    Item,
    'id' | 'title' | 'slug' | 'image_url' | 'status' | 'price'
  > | null;
};

export const OFFER_STATUS_LABEL: Record<OfferStatus, string> = {
  NEW: 'Nuova',
  NEGOTIATION: 'In trattativa',
  ACCEPTED: 'Accettata',
  REJECTED: 'Rifiutata',
};