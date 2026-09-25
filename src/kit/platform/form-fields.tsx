import type { FormTarget } from '../types';

/**
 * Versteckte Felder eines Formularziels. Jedes Formular so aufbauen:
 *
 *   <form method="post" action={target.action}>
 *     <FormFields target={target} />
 *     …sichtbare Felder…
 *   </form>
 */
export function FormFields({ target }: { target: FormTarget }) {
  return (
    <>
      {Object.entries(target.hidden).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
    </>
  );
}
