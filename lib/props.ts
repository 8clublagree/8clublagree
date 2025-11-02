import { Dayjs } from "dayjs";

export interface CreateClassProps {
  key: string;
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

export interface CreatePackageProps {
  key: string;
  name: string;
  price: number;
  promo: boolean;
  validity_period: number;
}

export interface ChartData {
  label: string;
  start: number;
  end: number;
  color: string;
}
