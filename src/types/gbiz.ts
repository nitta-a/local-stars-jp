export interface GbizCertification {
  certification_name: string;
  certified_date: string;
}

export interface Enterprise {
  corporate_number: string;
  name: string;
  address: string;
  prefecture: string;
  certification: GbizCertification[];
}

export interface GbizApiResponse {
  "hojin-infos": Enterprise[];
}
