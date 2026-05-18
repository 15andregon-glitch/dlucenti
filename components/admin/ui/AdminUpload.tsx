"use client";

import { useRef, useState, useTransition } from "react";
import { AdminButton } from "./AdminButton";
import { cn } from "@/lib/cn";

interface AdminUploadProps {
  label?: string;
  accept?: string;
  onUpload: (formData: FormData) => Promise<{ ok: boolean; error?: string }>;
  disabled?: boolean;
}

export function AdminUpload({
  label = "Upload file",
  accept = "image/*",
  onUpload,
  disabled,
}: AdminUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fd = new FormData();
    fd.set("file", file);

    startTransition(async () => {
      setError(null);
      const result = await onUpload(fd);
      if (!result.ok) setError(result.error ?? "Upload failed");
      if (inputRef.current) inputRef.current.value = "";
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        disabled={disabled || pending}
        onChange={handleChange}
      />
      <AdminButton
        type="button"
        disabled={disabled || pending}
        onClick={() => inputRef.current?.click()}
        className={cn(pending && "opacity-60")}
      >
        {pending ? "Uploading…" : label}
      </AdminButton>
      {error && (
        <p className="text-[0.75rem] text-[var(--maison-gray)]" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
