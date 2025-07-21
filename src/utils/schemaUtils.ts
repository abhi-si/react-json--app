import { SchemaField} from '@/types/schema';

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const createNewField = (name: string = '', type: SchemaField['type'] = 'string'): SchemaField => ({
  id: generateId(),
  name,
  type,
  ...(type === 'nested' ? { fields: [] } : {})
});

export const convertToJSONSchema = (fields: SchemaField[]): any => {
  if (!fields || !Array.isArray(fields)) {
    return {};
  }

  const properties: Record<string, any> = {};

  fields.forEach(field => {
    if (field.name && field.name.trim()) {
      if (field.type === 'nested' && field.fields) {
        properties[field.name] = convertToJSONSchema(field.fields);
      } else {
        properties[field.name] = field.type === 'string' ? 'STRING' : 'number';
      }
    }
  });

  return properties;
};

export const generateSampleData = (fields: SchemaField[]): Record<string, any> => {
  const data: Record<string, any> = {};

  fields.forEach(field => {
    if (field.name && field.name.trim()) {
      if (field.type === 'nested' && field.fields) {
        data[field.name] = generateSampleData(field.fields);
      } else {
        data[field.name] = field.type;
      }
    }
  });

  return data;
};