/**
 * The one selection control, used by onboarding and preferences alike.
 *
 * Multi-select for settings and categories, single-select for difficulty —
 * the only difference is whether choosing one clears the others.
 */

import * as sound from '../sound';

interface Option<T extends string> {
  value: T;
  label: string;
  /** Second line — used to show the plain difficulty word under its title. */
  sub?: string;
}

interface Props<T extends string> {
  options: readonly Option<T>[];
  selected: readonly T[];
  /**
   * Receives an updater, not a value.
   *
   * Computing the next selection from the `selected` prop loses taps: two
   * presses landing before React re-renders both read the same stale array, and
   * the first is discarded. Handing back a function means the parent applies it
   * against whatever the current state really is.
   */
  onChange: (update: (current: readonly T[]) => T[]) => void;
  /** Single-select behaves like radio buttons: choosing one replaces the rest. */
  single?: boolean;
  wide?: boolean;
  /**
   * A value that means "all of them". Pressing it selects everything; pressing
   * it again when everything is already selected clears back to just itself.
   */
  selectAll?: T;
}

export function ChipGroup<T extends string>({
  options,
  selected,
  onChange,
  single = false,
  wide = false,
  selectAll,
}: Props<T>) {
  const everything = options.map((o) => o.value);
  const allOn = selectAll !== undefined && everything.every((v) => selected.includes(v));

  const toggle = (value: T) => {
    sound.play('select');

    if (single) {
      onChange(() => [value]);
      return;
    }

    if (selectAll !== undefined && value === selectAll) {
      onChange((current) =>
        everything.every((v) => current.includes(v)) ? [selectAll] : everything,
      );
      return;
    }

    onChange((current) =>
      current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value],
    );
  };

  return (
    <div className="chips">
      {options.map((o) => {
        const isAll = selectAll !== undefined && o.value === selectAll;
        const on = isAll ? allOn : selected.includes(o.value);
        return (
          <button
            key={o.value}
            type="button"
            className={[wide ? 'chip wide' : 'chip', isAll ? 'chip-all' : ''].filter(Boolean).join(' ')}
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
