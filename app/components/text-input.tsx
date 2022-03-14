import { Paragraph } from "./typography";
import clsx from "clsx";

const TextInput = ({
  defaultValue,
  placeholder,
  name,
  error,
  className,
}: {
  defaultValue?: string;
  placeholder: string;
  name: string;
  error?: string;
  className?: string;
}) => {
  return (
    <div>
      <input
        type="text"
        className={clsx(
          "w-full px-6 py-3 rounded-[5px] bg-background text-primary placeholder:text-navy-hover active:border-blue invalid:border-red",
          className
        )}
        defaultValue={defaultValue}
        placeholder={placeholder}
        name={name}
      />
      {error ? (
        <Paragraph size="2" className="text-red">
          {error}
        </Paragraph>
      ) : null}
    </div>
  );
};

const TextArea = ({
  defaultValue,
  placeholder,
  name,
  error,
  className,
  rows,
  maxLength,
}: {
  defaultValue?: string;
  placeholder: string;
  name: string;
  error?: string;
  className?: string;
  rows?: number;
  maxLength?: number;
}) => {
  return (
    <div>
      <textarea
        className={clsx(
          "w-full px-6 py-3 rounded-[5px] bg-background text-primary placeholder:text-navy-hover active:border-blue invalid:border-red",
          className
        )}
        defaultValue={defaultValue}
        placeholder={placeholder}
        name={name}
        rows={rows || 4}
        maxLength={maxLength || undefined}
      />
      {error ? (
        <Paragraph size="2" className="text-red">
          {error}
        </Paragraph>
      ) : null}
    </div>
  );
};

export { TextInput, TextArea };
