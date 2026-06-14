export type ItemStatus = 'AVAILABLE' | 'NEGOTIATION' | 'SOLD';

export type Item = {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  image_url: string | null;
  status: ItemStatus;
  created_at: string;
  updated_at: string;
};

export const ITEM_STATUS_LABEL: Record<ItemStatus, string> = {
  AVAILABLE: 'Disponibile',
  NEGOTIATION: 'In trattativa',
  SOLD: 'Venduto',
};