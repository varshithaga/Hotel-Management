import { type InputHTMLAttributes } from "react";

type NativeInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "value" | "onChange" | "id"
>;

export type DateTimePickerProps = NativeInputProps & {
  id: string;
  /** Value in `YYYY-MM-DDTHH:mm` format. */
  value: string;
  /** Receives the new `YYYY-MM-DDTHH:mm` string. */
  onChange: (value: string) => void;
  /** Optional label rendered above the input. */
  label?: string;
  /** Class for the wrapper div (only rendered when `label` is set). */
  wrapperClassName?: string;
};

/**
 * Dependency-free date + time picker built on the native
 * `<input type="datetime-local">`. Drop-in replacement for a raw
 * datetime input: `value` / `onChange` work with plain strings.
 */
export default function DateTimePicker({
  id,
  value,
  onChange,
  label,
  wrapperClassName,
  ...rest
}: DateTimePickerProps) {
  const input = (
    <input
      id={id}
      type="datetime-local"
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      {...rest}
    />
  );

  if (!label) return input;

  return (
    <div className={wrapperClassName ?? "datepicker-field"}>
      <label htmlFor={id}>{label}</label>
      {input}
    </div>
  );
}
