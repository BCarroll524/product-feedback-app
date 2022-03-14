import { Form, useSearchParams, useSubmit } from "remix";
import clsx from "clsx";

type ChipCardProps = {
  tags: string[];
  className?: string;
};

const ChipCard = ({ tags, className }: ChipCardProps) => {
  const submit = useSubmit();
  const [searchParams] = useSearchParams();
  const tagParams = searchParams.getAll("tag");
  searchParams.delete("tag");

  const noTagSelected = tagParams.length === 0;

  return (
    <Form
      method="get"
      replace
      action={`/?${searchParams.toString()}`}
      className={clsx(
        "flex justify-start flex-wrap gap-2 bg-white rounded-xl p-6",
        className
      )}
      onChange={(e) => submit(e.currentTarget)}
    >
      {tags.map((tag, index) => {
        let defaultChecked;
        if (tag === "All" && noTagSelected) {
          defaultChecked = true;
        } else {
          defaultChecked = tagParams.includes(tag);
        }
        return <Radio key={index} tag={tag} defaultChecked={defaultChecked} />;
      })}
    </Form>
  );
};

export { ChipCard };

const Radio = ({
  tag,
  defaultChecked,
}: {
  tag: string;
  defaultChecked: boolean;
}) => {
  return (
    <label htmlFor={tag} className="relative">
      <input
        id={tag}
        type="radio"
        name="tag"
        value={tag}
        defaultChecked={defaultChecked}
        className="peer absolute opacity-0 cursor-pointer h-0 w-0"
      />
      <div className="cursor-pointer bg-background rounded-xl px-4 py-2 hover:bg-navy-light transition-colors text-xs font-semibold tracking-wider text-secondary hover:text-blue peer-checked:!text-white peer-checked:!bg-blue">
        {tag}
      </div>
    </label>
  );
};
