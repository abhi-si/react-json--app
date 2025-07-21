
import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { FieldRow } from "./FieldRow";

// Avoid recursive typing in useForm — define a simplified version
export type FieldType = "" | "string" | "number" | "nested";

export interface SchemaField {
  name: string;
  type: FieldType;
  toggle: boolean;
  fields?: any[];
}

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
    append({
      name: "",
      type: "",
      toggle: false,
      fields: [],
    });
  };

  const onSubmit = (data: { fields: SchemaField[] }) => {
    console.log("Submitted data", data);
  };

  const buildJson = (entries: SchemaField[]): Record<string, any> => {
    const json: Record<string, any> = {};
    for (const field of entries) {
      if (!field.name) continue;
      if (field.type === "nested") {
        json[field.name] = buildJson(field.fields || []);
      } else {
        json[field.name] = field.type.toUpperCase();
      }
    }
    return json;
  };

  const previewJson = buildJson(watch("fields") || []);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex gap-8 p-6">
        <div className="w-1/2 space-y-4">
          {fields.map((field, index) => (
            <FieldRow
              key={field.id}
              registerName={`fields.${index}`}
              remove={() => remove(index)}
            />
          ))}
          <div className="flex flex-col gap-2 pt-2">
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

        <div className="w-1/2 bg-gray-100 p-4 rounded min-h-[200px]">
          <h2 className="text-lg font-semibold mb-2">JSON Preview</h2>
          <pre className="text-sm whitespace-pre-wrap">
            {Object.keys(previewJson).length > 0
              ? JSON.stringify(previewJson, null, 2)
              : ""}
          </pre>
        </div>
      </form>
    </FormProvider>
  );
}
