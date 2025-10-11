type LabelProps = {
  text: string;
  forInput: string;
  className?: string;
};

export function Label({ text, forInput, className }: LabelProps) {
  return (
    <label htmlFor={forInput} className={className}>
      {text}
    </label>
  );
}
