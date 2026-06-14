export type CreateOfferState = {
  ok: boolean;
  message: string;
  errors?: Record<string, string[] | undefined>;
};

export const initialCreateOfferState: CreateOfferState = {
  ok: false,
  message: '',
};

export type UpdateOfferStatusState = {
  ok: boolean;
  message: string;
  errors?: Record<string, string[] | undefined>;
};

export const initialUpdateOfferStatusState: UpdateOfferStatusState = {
  ok: false,
  message: '',
};