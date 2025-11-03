import { Dayjs } from "dayjs";

export interface CreateClassProps {
  key?: string;
  id?: string;
  instructor_id: string;
  instructor_name: string;
  start_time: Dayjs;
  end_time: Dayjs;
  slots: string;
}
export interface CreateInstructorProps {
  first_name: string;
  last_name: string;
  full_name: string;
  avatar_url?: string;
  avatar_path?: string;
}
export interface UserProps {
  first_name?: string;
  last_name?: string;
  email?: string;
  full_name?: string;
  contact_number?: string;
  avatar_url?: string;
  avatar_path?: string;
}

export interface CreatePackageProps {
  key?: string;
  name?: string;
  title?: string;
  price?: number;
  promo?: boolean;
  validity_period?: number;
}

export interface ChartData {
  label: string;
  start: number;
  end: number;
  color: string;
}
