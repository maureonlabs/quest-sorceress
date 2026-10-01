/**
 * Quest descriptions are authored as a flavour line, a blank line, then numbered
 * steps. The UI renders those two parts very differently, so they are split here
 * rather than inside a component — and tested, because this parses bundled
 * content that nobody re-reads once it ships.
 */

export interface QuestText {
  flavor: string;
  steps: string[];
}

export function parseDescription(description: string): QuestText {
  const [head, ...rest] = description.split(/\n\s*\n/);
  const flavor = (head ?? '').trim();

  const steps = rest
    .join('\n')
    .split('\n')
    .map((line) => line.replace(/^\s*\d+\.\s*/, '').trim())
    .filter(Boolean);

  return { flavor, steps };
}
