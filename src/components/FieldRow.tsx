import React from "react";
import { useFormContext, useFieldArray, Controller } from "react-hook-form";

interface FieldRowProps {
  registerName: string;
  remove: () => void;
}

export const FieldRow: React.FC<FieldRowProps> = ({ registerName, remove }) => {
  const { control, register, watch } = useFormContext();
  const type = watch(`${registerName}.type`);

  const nestedFieldArray = useFieldArray({
    control,
    name: `${registerName}.fields`,
  });

  const handleAddNested = () => {
    nestedFieldArray.append({
      name: "",
      type: "",
      toggle: false,
      fields: [],
    });
  };

  return (
    <div className="ml-4 border-l-2 pl-4 mt-2">
      <div className="flex items-center gap-4">
        <input
          {...register(`${registerName}.name`)}
          placeholder="Field name"
          className="border px-2 py-1 rounded w-1/4"
        />

        <select
          {...register(`${registerName}.type`)}
          className="border px-2 py-1 rounded"
        >
          <option value="">Select Type</option>
          <option value="string">string</option>
          <option value="number">number</option>
          <option value="nested">nested</option>
        </select>

        <Controller
          control={control}
          name={`${registerName}.toggle`}
          render={({ field }) => (
            <button
              type="button"
              onClick={() => field.onChange(!field.value)}
              className={`w-12 h-6 rounded-full transition ${
                field.value ? "bg-green-500" : "bg-gray-400"
              } relative`}
            >
              <span
                className={`absolute left-0 top-0 h-6 w-6 bg-white rounded-full shadow-md transform transition ${
                  field.value ? "translate-x-full" : "translate-x-0"
                }`}
              />
            </button>
          )}
        />

        <button
          type="button"
          onClick={remove}
          className="text-red-500 font-bold ml-2"
        >
          ×
        </button>
      </div>

      {type === "nested" && (
        <div className="ml-4 mt-3">
          {nestedFieldArray.fields.map((subField, i) => (
            <FieldRow
              key={subField.id}
              registerName={`${registerName}.fields.${i}`}
              remove={() => nestedFieldArray.remove(i)}
            />
          ))}
          <button
            type="button"
            onClick={handleAddNested}
            className="mt-2 px-4 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
          >
            + Add Item
          </button>
        </div>
      )}
    </div>
  );
};
