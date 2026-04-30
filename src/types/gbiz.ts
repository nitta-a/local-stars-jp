export interface GbizCertification {
  certification_name: string;
  certified_date: string;
  target: string;
  division: string;
  issuer: string;
  genre: string;
}

export interface LaborData {
  average_continuous_service_years_scope?: string;
  average_continuous_service_years_male?: string;
  average_continuous_service_years_female?: string;
  average_continuous_service_years_regular?: string;
  average_employee_age?: string;
  monthly_overtime_hours?: string;
  female_worker_ratio_scope?: string;
  female_worker_ratio?: string;
  female_manager_count?: string;
  manager_total_count?: string;
  female_officer_count?: string;
  officer_total_count?: string;
  childcare_leave_eligible_male?: string;
  childcare_leave_eligible_female?: string;
  childcare_leave_taken_male?: string;
  childcare_leave_taken_female?: string;
}

export interface Enterprise {
  corporate_number: string;
  name: string;
  address: string;
  prefecture: string;
  certification: GbizCertification[];
  labor_data?: LaborData;
  lat?: number;
  lng?: number;
}

export interface GbizApiResponse {
  "hojin-infos": Enterprise[];
}
