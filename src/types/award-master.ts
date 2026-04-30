export type AwardCategory = string;

export interface AwardMaster {
  id: string;
  name: string;
  description: string;
  official_url: string;
  category: AwardCategory;
}

export interface AwardMasterFile {
  awards: AwardMaster[];
}
