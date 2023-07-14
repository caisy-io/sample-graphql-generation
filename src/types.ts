export interface IAttribute {
  id?: string;
  type: string;
  relationType?: string;
  relationContentTypeId?: string;
  multipleRelationContentTypeIds?: string[];
  multiple?: boolean;
}

export interface IContentType {
  name: string;
  uid: string;
  attributes: Record<string, IAttribute>;
}

export interface IFieldFilter {
  attributeName: string;
  value: string | number | boolean | null;
  operation: "equals";
}
export interface ISorting {
  attribute: string;
  direction: "asc" | "desc";
}

export interface IPagination {
  limit?: number;
  skip?: number;
}


export type IAllContentTypes = Record<string, IContentType>;
