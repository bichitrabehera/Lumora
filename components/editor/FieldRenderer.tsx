import React from "react";

type FieldRendererProps = {
  field: { key: string; type: string; label: string };
  value: any;
  disabled: boolean;
  uploadingField: string | null;
  onChange: (key: string, value: any) => void;
  onUpload: (key: string, file: File) => Promise<void>;
};

function splitPhotos(value: any): string[] {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === "string" && value.trim()) {
    return value
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

const inputBase = "w-full px-4 py-3 rounded-md border border-border outline-none box-border text-base transition-all duration-200";

function inputStyle(disabled: boolean) {
  return `${inputBase} ${disabled ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-body cursor-text"}`;
}

export function FieldRenderer({
  field,
  value,
  disabled,
  uploadingField,
  onChange,
  onUpload,
}: FieldRendererProps) {

  if (field.type === "textarea") {
    return (
      <textarea
        value={value ?? ""}
        disabled={disabled}
        onChange={(e) => onChange(field.key, e.target.value)}
        rows={5}
        className={`${inputStyle(disabled)} resize-y min-h-[100px]`}
      />
    );
  }

  if (field.type === "audio") {
    return (
      <div className="grid gap-2.5">
        <input
          type="file"
          accept="audio/*"
          disabled={disabled}
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (file) await onUpload(field.key, file);
          }}
          className="text-sm"
        />
        <input
          value={value ?? ""}
          placeholder="Or paste an audio URL"
          disabled={disabled}
          onChange={(e) => onChange(field.key, e.target.value)}
          className={inputStyle(disabled)}
        />
        {uploadingField === field.key && (
          <span className="text-sm text-primary">
            Uploading audio file...
          </span>
        )}
        {value && (
          <audio controls className="w-full mt-1">
            <source src={value} />
          </audio>
        )}
      </div>
    );
  }

  if (field.type === "gallery") {
    return (
      <div className="grid gap-2.5">
        <input
          type="file"
          accept="image/*"
          multiple
          disabled={disabled}
          onChange={async (e) => {
            const files = Array.from(e.target.files ?? []);
            if (files.length > 0) await onUpload(field.key, files[0]);
          }}
          className="text-sm"
        />
        <textarea
          value={splitPhotos(value).join("\n")}
          placeholder="One image URL per line"
          rows={4}
          disabled={disabled}
          onChange={(e) =>
            onChange(
              field.key,
              e.target.value
                .split("\n")
                .map((item) => item.trim())
                .filter(Boolean),
            )
          }
          className={inputStyle(disabled)}
        />
        {uploadingField === field.key && (
          <span className="text-sm text-primary">
            Uploading images...
          </span>
        )}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(64px,1fr))] gap-2 mt-1">
          {splitPhotos(value).map((src: string, idx: number) => (
            <img
              key={`${src}-${idx}`}
              src={src}
              alt="gallery item"
              className="w-full aspect-square object-cover rounded-md border border-border"
            />
          ))}
        </div>
      </div>
    );
  }

  if (field.type === "image") {
    return (
      <div className="grid gap-2.5">
        <input
          type="file"
          accept="image/*"
          disabled={disabled}
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (file) await onUpload(field.key, file);
          }}
          className="text-sm"
        />
        <input
          value={value ?? ""}
          placeholder="Or paste an image URL"
          disabled={disabled}
          onChange={(e) => onChange(field.key, e.target.value)}
          className={inputStyle(disabled)}
        />
        {uploadingField === field.key && (
          <span className="text-sm text-primary">
            Uploading image...
          </span>
        )}
        {value && (
          <img
            src={value}
            alt="preview"
            className="max-w-full max-h-[180px] rounded-md object-cover mt-1 border border-border"
          />
        )}
      </div>
    );
  }

  return (
    <input
      value={value ?? ""}
      disabled={disabled}
      onChange={(e) => onChange(field.key, e.target.value)}
      className={inputStyle(disabled)}
    />
  );
}
