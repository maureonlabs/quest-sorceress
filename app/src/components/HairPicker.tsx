/**
 * The one thing a player with no items can still change.
 *
 * Eight colours, shown as the actual two tones each is built from rather than a
 * flat dot, so the swatch matches what lands on the figure.
 */

import * as sound from '../sound';
import { HAIR_COLORS, HAIR_SWATCHES, type HairColor } from '../types';

export function HairPicker({
  value,
  onChange,
}: {
  value: HairColor;
  onChange: (c: HairColor) => void;
}) {
  return (
    <div className="hair-picker" role="radiogroup" aria-label="Hair colour">
      {HAIR_COLORS.map((c) => {
        const { lit, dark } = HAIR_SWATCHES[c];
        return (
          <button
            key={c}
            type="button"
            role="radio"
            aria-checked={value === c}
            aria-label={c}
            className={value === c ? 'swatch on' : 'swatch'}
            style={{ background: `linear-gradient(145deg, ${lit}, ${dark})` }}
            onClick={() => {
              sound.play('select');
              onChange(c);
            }}
          />
        );
      })}
    </div>
  );
}
