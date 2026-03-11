"use client";

type ConfirmDeleteButtonProps = {
  label?: string;
  message: string;
  className?: string;
};

export function ConfirmDeleteButton({
  label = "Delete",
  message,
  className,
}: ConfirmDeleteButtonProps) {
  return (
    <button
      type="submit"
      onClick={(e) => {
        if (!window.confirm(message)) {
          e.preventDefault();
        }
      }}
      className={
        className ||
        "rounded-xl border border-rose-200 px-3 py-2 text-sm text-rose-700 transition hover:bg-rose-50"
      }
    >
      {label}
    </button>
  );
}