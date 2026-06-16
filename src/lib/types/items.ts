export type ItemStatus = 'AVAILABLE' | 'NEGOTIATION' | 'SOLD';

export type Item = {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  highest_offer_price: number | null;
  races: ItemRace[];
  item_type: ItemType;
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

export type ItemRace = 'WARRIOR' | 'SURA' | 'SHAMAN' | 'NINJA' | 'LYCAN';

export type ItemType =
  | 'WEAPONS'
  | 'ARMORS'
  | 'SHIELDS'
  | 'BRACELETS'
  | 'NECKLACES'
  | 'EARRINGS'
  | 'TALISMANS'
  | 'BELTS'
  | 'HELMETS'
  | 'SHOES'
  | 'GLOVES'
  | 'SASHES'
  | 'AURA_OUTFITS'
  | 'COSTUMES'
  | 'OBJECTS'
  | 'PETS';

export const ITEM_RACE_LABEL: Record<ItemRace, string> = {
  WARRIOR: 'Guerriero',
  SURA: 'Sura',
  SHAMAN: 'Shamano',
  NINJA: 'Ninja',
  LYCAN: 'Lycan',
};

export const ITEM_TYPE_LABEL: Record<ItemType, string> = {
  WEAPONS: 'Armi',
  ARMORS: 'Armature',
  SHIELDS: 'Scudi',
  BRACELETS: 'Bracciali',
  NECKLACES: 'Collane',
  EARRINGS: 'Orecchini',
  TALISMANS: 'Talismani',
  BELTS: 'Cinture',
  HELMETS: 'Elmi',
  SHOES: 'Scarpe',
  GLOVES: 'Guanti',
  SASHES: 'Stole',
  AURA_OUTFITS: 'Veste Aura',
  COSTUMES: 'Costumi',
  OBJECTS: 'Oggetti',
  PETS: 'Pet',
};