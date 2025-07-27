export interface CatalogDOMData {
  name: string;
  link: string;
  validTo: string | null;
}

export interface CatalogParseResult {
  id: number;
  parsed: {
    name: string;
    link: string;
    validUntil: string | null;
    text: string;
  };
}
