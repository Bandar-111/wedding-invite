export interface Guest {
  id: string;
  full_name: string;
  phone: string;
  number_of_guests: number;
  qr_token: string;
  checked_in: boolean;
  checked_in_at: string | null;
  notes: string | null;
  created_at: string;
}
