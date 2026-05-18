interface AdminCheckboxProps {
  name: string;
  label: string;
  defaultChecked?: boolean;
}

export function AdminCheckbox({ name, label, defaultChecked }: AdminCheckboxProps) {
  return (
    <label className="flex cursor-pointer items-center gap-3 font-sans text-[0.8125rem] text-[var(--maison-charcoal)]">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="h-3.5 w-3.5 accent-[var(--maison-charcoal)]"
      />
      {label}
    </label>
  );
}
