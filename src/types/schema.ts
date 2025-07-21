export type FieldType = 'string' | 'number' | 'nested';

export interface SchemaField {
  id: string;
  name: string;
  type: FieldType;
  fields?: SchemaField[];
}

export interface SchemaFormData {
  fields: SchemaField[];
}

export interface JSONSchemaProperty {
  type: string;
  properties?: Record<string, JSONSchemaProperty>;
}

export interface JSONSchema {
  type: 'object';
  properties: Record<string, JSONSchemaProperty>;
}