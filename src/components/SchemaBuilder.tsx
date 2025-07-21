import React from "react";
import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { FieldRow } from "./FieldRow";

type SchemaField = {
  name: string;
  type: "string" | "number" | "nested";
  toggle: boolean;
  fields?: SchemaField[];
};

export function SchemaBuilder() {
  const methods = useForm<{ fields: SchemaField[] }>({
    defaultValues: { fields: [] },
  });

  const { control, handleSubmit, watch } = methods;
  const { fields, append, remove } = useFieldArray({
    name: "fields",
    control,
  });

  const handleAddField = () => {
    append({ name: "", type: "", toggle: false, fields: [] });
  };

  const handleFormSubmit = (data: { fields: SchemaField[] }) => {
    console.log("Form Submitted:", data);
  };

  const createJson = (items: SchemaField[]): Record<string, any> => {
    const result: Record<string, any> = {};
    items.forEach((field) => {
      if (!field.name) return;
      if (field.type === "nested" && field.fields) {
        result[field.name] = createJson(field.fields);
      } else {
        result[field.name] = field.type.toUpperCase();
      }
    });
    return result;
  };

  const jsonPreview = createJson(watch("fields") || []);

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="flex gap-6 p-6"
      >
        <div className="w-1/2 space-y-4">
          {fields.map((item, idx) => (
            <FieldRow
              key={item.id}
              registerName={`fields.${idx}`}
              remove={() => remove(idx)}
            />
          ))}

          <div className="flex flex-col gap-3 pt-2">
            <button
              type="button"
              onClick={handleAddField}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              + Add Item
            </button>

            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Submit
            </button>
          </div>
        </div>

        <div className="w-1/2 bg-gray-100 rounded p-4 min-h-[200px]">
          <h2 className="text-lg font-semibold mb-2">JSON Preview</h2>
          <pre className="text-sm whitespace-pre-wrap">
            {Object.keys(jsonPreview).length > 0
              ? JSON.stringify(jsonPreview, null, 2)
              : ""}
          </pre>
        </div>
      </form>
    </FormProvider>
  );
}
