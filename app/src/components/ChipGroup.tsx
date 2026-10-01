/**
 * The one selection control, used by onboarding and preferences alike.
 *
 * Multi-select for settings and categories, single-select for difficulty —
 * the only difference is whether choosing one clears the others.
 */

interface Option<T extends string> {
  value: T;
  label: string;
  /** Second line — used to show the plain difficulty word under its title. */
  sub?: string;
}

interface Props<T extends string> {
  options: readonly Option<T>[];
  selected: readonly T[];
  onChange: (next: T[]) => void;
  /** Single-select behaves like radio buttons: choosing one replaces the rest. */
  single?: boolean;
  wide?: boolean;
}

export function ChipGroup<T extends string>({
  options,
  selected,
  onChange,
  single = false,
  wide = false,
}: Props<T>) {
  const toggle = (value: T) => {
    if (single) {
      onChange([value]);
      return;
    }
    onChange(
      selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value],
    );
  };

  return (
    <div className="chips">
      {options.map((o) => {
        const on = selected.includes(o.value);
        return (
          <button
            key={o.value}
            type="button"
            className={wide ? 'chip wide' : 'chip'}
            aria-pressed={on}
            onClick={() => toggle(o.value)}
          >
            {o.label}
            {o.sub ? <span className="sub">{o.sub}</span> : null}
          </button>
        );
      })}
    </div>
  );
}
