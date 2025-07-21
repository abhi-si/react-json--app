export type SchemaField = {
  name: string;
  type: "string" | "number" | "nested";
  toggle: boolean;
  fields?: SchemaField[]; // Recursive reference here is okay in type alias
};
