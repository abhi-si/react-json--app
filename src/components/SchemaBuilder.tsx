import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { FieldRow } from "./FieldRow";

type SchemaField = {
  name: string;
  type: string;
  toggle: boolean;
  fields?: SchemaField[];
};

export function SchemaBuilder() {
  const formUtils = useForm<{ fields: SchemaField[] }>({
    defaultValues: {
      fields: [],
    },
  });

  const { control, handleSubmit, watch } = formUtils;

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

  const handleFormSubmit = (formData: { fields: SchemaField[] }) => {
    console.log("Form Submitted:", formData);
  };

  const createJsonOutput = (items: SchemaField[]): Record<string, any> => {
    const output: Record<string, any> = {};

    items.forEach((entry) => {
      if (!entry.name) return;

      if (entry.type === "nested" && Array.isArray(entry.fields)) {
        output[entry.name] = createJsonOutput(entry.fields);
      } else {
        output[entry.name] =
          typeof entry.type === "string" ? entry.type.toUpperCase() : "";
      }
    });

    return output;
  };

  const currentSchema = createJsonOutput(watch("fields") || []);

  return (
    <FormProvider {...formUtils}>
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="flex flex-row items-start gap-8 p-6"
      >
        {/* Form Section */}
        <div className="w-1/2 space-y-4">
          {fields.map((item, idx) => (
            <FieldRow
              key={item.id}
              nestIndex={idx}
              registerName={`fields.${idx}`}
              remove={() => remove(idx)}
            />
          ))}

          {/* Add + Submit buttons */}
          <div className="flex flex-col gap-3 pt-2">
            <button
              type="button"
              onClick={handleAddField}
              className="bg-gray-200 text-gray-800 px-3 py-1 rounded hover:bg-gray-300 w-fit text-sm border"
            >
              + Add Item
            </button>

            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-fit text-sm"
            >
              Submit
            </button>
          </div>
        </div>

        {/* Preview Section */}
        <div className="w-1/2 bg-gray-100 rounded p-4 min-h-[200px]">
          <h2 className="text-lg font-semibold mb-2">JSON Preview</h2>
          <pre className="text-sm whitespace-pre-wrap">
            {Object.keys(currentSchema).length > 0
              ? JSON.stringify(currentSchema, null, 2)
              : ""}
          </pre>
        </div>
      </form>
    </FormProvider>
  );
}
