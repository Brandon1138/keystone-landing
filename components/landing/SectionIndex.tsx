/* Section index — the one repeating system across the site. Drafting-sheet
   title block: index and label on the left, annotation on the right,
   a hairline rule between. */
export function SectionIndex({
  index,
  label,
  annotation,
}: {
  index: string;
  label: string;
  annotation: string;
}) {
  return (
    <div className="section-index">
      <span>
        {index} · {label}
      </span>
      <span className="section-index-rule" aria-hidden />
      <span>{annotation}</span>
    </div>
  );
}
