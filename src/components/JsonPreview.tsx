// src/components/JsonPreview.tsx
import React from "react";

export const JsonPreview = ({ data }: { data: any }) => {
  return (
    <div className="bg-gray-100 p-4 mt-6 rounded-md">
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};


