export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  image_url: string;
  external_link: string;
  category: string;
  is_claimed: boolean;
  claimed_by_real: string | null;
  claimed_by_display: string | null;
  claimed_at: string | null;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  sort_order: number;
}

export type ClaimFormData = {
  firstName: string;
  lastName: string;
};
