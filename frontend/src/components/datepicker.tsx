import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

export type DatePickerProps = {
  id: string;
  /** Selected value in `YYYY-MM-DD` format (empty string when nothing picked). */
  value: string;
  /** Receives the new `YYYY-MM-DD` string. */
  onChange: (value: string) => void;
  /** Optional label rendered above the field. */
  label?: string;
  /** Earliest selectable date, `YYYY-MM-DD`. */
  min?: string;
  /** Latest selectable date, `YYYY-MM-DD`. */
  max?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  name?: string;
  /** Class for the outer wrapper. */
  wrapperClassName?: string;
};

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const pad = (n: number) => String(n).padStart(2, "0");
const toISO = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`;

function parseISO(value: string): { y: number; m: number; d: number } | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value ?? "");
  if (!match) return null;
  const y = Number(match[1]);
  const m = Number(match[2]) - 1;
  const d = Number(match[3]);
  const probe = new Date(y, m, d);
  if (probe.getFullYear() !== y || probe.getMonth() !== m || probe.getDate() !== d) {
    return null;
  }
  return { y, m, d };
}

function formatDisplay(value: string): string {
  const parsed = parseISO(value);
  if (!parsed) return "";
  const date = new Date(parsed.y, parsed.m, parsed.d);
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const STYLE_ID = "app-datepicker-styles";
const STYLES = `
.dp { position: relative; width: 100%; }
.dp__field {
  display: flex; align-items: center; justify-content: space-between; gap: 10px;
  width: 100%; padding: 12px 14px; cursor: pointer;
  border: 1px solid #d9dee2; border-radius: 6px;
  background: var(--color-white, #fff); color: var(--color-text, #1f2d38);
  font-family: inherit; font-size: 0.95rem; line-height: 1.2; text-align: left;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.dp__field:hover:not(:disabled) { border-color: var(--color-teal, #0E7490); }
.dp__field:focus-visible,
.dp--open .dp__field {
  outline: none; border-color: var(--color-teal, #0E7490);
  box-shadow: 0 0 0 3px rgba(14, 116, 144, 0.15);
}
.dp__field:disabled { opacity: 0.55; cursor: not-allowed; }
.dp__value { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.dp__value--empty { color: var(--color-text-light, #5b6b76); }
.dp__icon { flex-shrink: 0; width: 18px; height: 18px; color: var(--color-teal, #0E7490); }
.dp__pop {
  position: absolute; z-index: 1000; left: 0; min-width: 280px;
  background: var(--color-white, #fff); border: 1px solid #e2edf1; border-radius: 10px;
  box-shadow: 0 12px 34px rgba(8, 47, 73, 0.18); padding: 14px;
}
.dp__pop--below { top: calc(100% + 6px); }
.dp__pop--above { bottom: calc(100% + 6px); }
.dp__head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
.dp__title { font-weight: 600; font-size: 0.95rem; color: var(--color-navy, #082F49); }
.dp__nav {
  display: inline-flex; align-items: center; justify-content: center;
  width: 30px; height: 30px; border: none; border-radius: 6px; cursor: pointer;
  background: var(--color-cream, #f4f8fa); color: var(--color-navy, #082F49); font-size: 1rem;
}
.dp__nav:hover:not(:disabled) { background: var(--color-cream-dark, #e2edf1); }
.dp__nav:disabled { opacity: 0.4; cursor: not-allowed; }
.dp__grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; }
.dp__wd {
  text-align: center; font-size: 0.72rem; font-weight: 600; padding: 6px 0;
  color: var(--color-text-light, #5b6b76); text-transform: uppercase;
}
.dp__day {
  display: flex; align-items: center; justify-content: center;
  height: 34px; border: none; border-radius: 6px; cursor: pointer;
  background: transparent; color: var(--color-text, #1f2d38); font-size: 0.85rem; font-family: inherit;
}
.dp__day:hover:not(:disabled) { background: var(--color-cream, #f4f8fa); }
.dp__day--muted { color: #b7c2c9; }
.dp__day--today { font-weight: 700; box-shadow: inset 0 0 0 1px var(--color-teal, #0E7490); }
.dp__day--selected,
.dp__day--selected:hover { background: var(--color-teal, #0E7490); color: #fff; font-weight: 700; }
.dp__day:disabled { opacity: 0.35; cursor: not-allowed; }
.dp__foot { display: flex; justify-content: space-between; margin-top: 10px; }
.dp__link {
  border: none; background: none; cursor: pointer; padding: 4px 6px;
  font-size: 0.8rem; font-family: inherit; color: var(--color-teal, #0E7490); font-weight: 600;
}
.dp__link:hover { text-decoration: underline; }
`;

function ensureStyles() {
  if (typeof document === "undefined") return;
  if (document.getElementById(STYLE_ID)) return;
  const el = document.createElement("style");
  el.id = STYLE_ID;
  el.textContent = STYLES;
  document.head.appendChild(el);
}

/**
 * Self-contained calendar date picker (no external library).
 * Same value contract as a native date input: `value` / `onChange`
 * exchange plain `YYYY-MM-DD` strings.
 */
export default function DatePicker({
  id,
  value,
  onChange,
  label,
  min,
  max,
  placeholder = "Select a date",
  required = false,
  disabled = false,
  name,
  wrapperClassName,
}: DatePickerProps) {
  ensureStyles();

  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState<"below" | "above">("below");

  const selected = useMemo(() => parseISO(value), [value]);
  const today = useMemo(() => {
    const now = new Date();
    return { y: now.getFullYear(), m: now.getMonth(), d: now.getDate() };
  }, []);

  const [view, setView] = useState(() => {
    const base = selected ?? parseISO(min ?? "") ?? today;
    return { y: base.y, m: base.m };
  });

  // Re-centre the calendar on the selected month each time it opens.
  useEffect(() => {
    if (!open) return;
    const base = selected ?? parseISO(min ?? "") ?? today;
    setView({ y: base.y, m: base.m });
  }, [open, selected, min, today]);

  // Close on outside click / Escape.
  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Flip above the field when there isn't room below.
  useLayoutEffect(() => {
    if (!open || !rootRef.current) return;
    const rect = rootRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    setPlacement(spaceBelow < 360 && rect.top > spaceBelow ? "above" : "below");
  }, [open]);

  const minParsed = useMemo(() => parseISO(min ?? ""), [min]);
  const maxParsed = useMemo(() => parseISO(max ?? ""), [max]);

  const isOutOfRange = (iso: string) => {
    if (min && iso < min) return true;
    if (max && iso > max) return true;
    return false;
  };

  const monthStartsAtViewLimit = (dir: -1 | 1) => {
    const probe = new Date(view.y, view.m + dir, 1);
    const py = probe.getFullYear();
    const pm = probe.getMonth();
    if (dir === -1 && minParsed) {
      return py < minParsed.y || (py === minParsed.y && pm < minParsed.m);
    }
    if (dir === 1 && maxParsed) {
      return py > maxParsed.y || (py === maxParsed.y && pm > maxParsed.m);
    }
    return false;
  };

  const shiftMonth = (dir: -1 | 1) => {
    setView((prev) => {
      const probe = new Date(prev.y, prev.m + dir, 1);
      return { y: probe.getFullYear(), m: probe.getMonth() };
    });
  };

  const pick = (iso: string) => {
    if (isOutOfRange(iso)) return;
    onChange(iso);
    setOpen(false);
  };

  const cells = useMemo(() => {
    const firstWeekday = new Date(view.y, view.m, 1).getDay();
    const start = new Date(view.y, view.m, 1 - firstWeekday);
    return Array.from({ length: 42 }, (_, i) => {
      const date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
      return {
        y: date.getFullYear(),
        m: date.getMonth(),
        d: date.getDate(),
        iso: toISO(date.getFullYear(), date.getMonth(), date.getDate()),
        inMonth: date.getMonth() === view.m,
      };
    });
  }, [view]);

  const onFieldKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!disabled) setOpen(true);
    }
  };

  const display = formatDisplay(value);

  return (
    <div
      ref={rootRef}
      className={`dp${open ? " dp--open" : ""}${wrapperClassName ? ` ${wrapperClassName}` : ""}`}
    >
      {label && (
        <label htmlFor={id} style={{ display: "block", marginBottom: 6 }}>
          {label}
        </label>
      )}

      <button
        type="button"
        id={id}
        className="dp__field"
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => !disabled && setOpen((o) => !o)}
        onKeyDown={onFieldKeyDown}
      >
        <span className={`dp__value${display ? "" : " dp__value--empty"}`}>
          {display || placeholder}
        </span>
        <svg className="dp__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
      </button>

      {/* Keep native form semantics (required / name / submission). */}
      <input type="hidden" name={name} value={value ?? ""} />
      {required && (
        <input
          tabIndex={-1}
          aria-hidden="true"
          required
          value={value ?? ""}
          onChange={() => {}}
          style={{
            position: "absolute",
            opacity: 0,
            width: 1,
            height: 1,
            pointerEvents: "none",
            bottom: 0,
            left: "50%",
          }}
        />
      )}

      {open && (
        <div className={`dp__pop dp__pop--${placement}`} role="dialog" aria-label="Choose date">
          <div className="dp__head">
            <button
              type="button"
              className="dp__nav"
              onClick={() => shiftMonth(-1)}
              disabled={monthStartsAtViewLimit(-1)}
              aria-label="Previous month"
            >
              ‹
            </button>
            <span className="dp__title">
              {MONTHS[view.m]} {view.y}
            </span>
            <button
              type="button"
              className="dp__nav"
              onClick={() => shiftMonth(1)}
              disabled={monthStartsAtViewLimit(1)}
              aria-label="Next month"
            >
              ›
            </button>
          </div>

          <div className="dp__grid">
            {WEEKDAYS.map((wd) => (
              <span key={wd} className="dp__wd">
                {wd}
              </span>
            ))}
            {cells.map((cell) => {
              const isSelected =
                !!selected &&
                selected.y === cell.y &&
                selected.m === cell.m &&
                selected.d === cell.d;
              const isToday =
                today.y === cell.y && today.m === cell.m && today.d === cell.d;
              return (
                <button
                  key={cell.iso}
                  type="button"
                  className={
                    "dp__day" +
                    (cell.inMonth ? "" : " dp__day--muted") +
                    (isToday ? " dp__day--today" : "") +
                    (isSelected ? " dp__day--selected" : "")
                  }
                  disabled={isOutOfRange(cell.iso)}
                  onClick={() => pick(cell.iso)}
                >
                  {cell.d}
                </button>
              );
            })}
          </div>

          <div className="dp__foot">
            <button
              type="button"
              className="dp__link"
              onClick={() => {
                const iso = toISO(today.y, today.m, today.d);
                if (!isOutOfRange(iso)) pick(iso);
                else {
                  setView({ y: today.y, m: today.m });
                }
              }}
            >
              Today
            </button>
            {value && (
              <button
                type="button"
                className="dp__link"
                onClick={() => {
                  onChange("");
                  setOpen(false);
                }}
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
