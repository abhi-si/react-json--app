// src/utils/createNewField.ts
export const createNewField = () => ({
  id: Date.now().toString(),
  name: "",
  type: "",
  required: false,
  nestedFields: [],
});
