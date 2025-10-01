import { Provider } from "src/enum/appEnums";

export interface NormalizedList {
  provider:Provider;
  id: string;
  name: string;
  memberCount?: number;
  raw: any;
}

export interface NormalizedListResponse {
  lists: NormalizedList[];
  meta: { total: number; page: number; perPage: number };
}
