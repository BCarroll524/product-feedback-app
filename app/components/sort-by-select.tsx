import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/outline";
import * as Select from "@radix-ui/react-select";
import clsx from "clsx";
import { useState } from "react";
import { H4 } from "./typography";
import { Paragraph } from "~/components/typography";
import { Form, useSubmit, useSearchParams } from "remix";

const options = [
  {
    label: "Most Upvotes",
    value: "mostUpvotes",
  },
  {
    label: "Least Upvotes",
    value: "leastUpvotes",
  },
  {
    label: "Most Comments",
    value: "mostComments",
  },
  {
    label: "Least Comments",
    value: "leastComments",
  },
];

const Dropdown = ({ className }: { className?: string }) => {
  const submit = useSubmit();
  const [searchParams] = useSearchParams();

  const sortByParam = searchParams.get("sortBy");
  searchParams.delete("sortBy");

  const [value, setValue] = useState(sortByParam ?? options[0].value);

  return (
    <Form
      method="get"
      id="suggestions"
      replace
      action={`/?${searchParams.toString()}`}
      onChange={(e) => submit(e.currentTarget)}
    >
      <Select.Root
        name="sortBy"
        value={value}
        onValueChange={(v) => setValue(v)}
      >
        <Select.Trigger
          className={clsx(
            "flex items-center justify-between gap-1 bg-background rounded-xl px-6 py-3 text-primary text-base min-w-[160px] border-[1.5px] border-transparent focus:border-[1.5px] focus:border-blue focus:!outline-none",
            className
          )}
        >
          <Select.Value asChild>
            <span className="flex items-baseline gap-2">
              <Paragraph size="2" variant="light">
                Sort By :
              </Paragraph>
              <H4 variant="light" className="pr-4">
                {options.find((opt) => opt.value === value)?.label}
              </H4>
            </span>
          </Select.Value>
          <Select.Icon asChild>
            <ChevronDownIcon className="text-white stroke-2 w-4 h-4" />
          </Select.Icon>
        </Select.Trigger>

        <Select.Content className="bg-white rounded-xl shadow-md w-[255px]">
          <Select.ScrollUpButton className="ml-auto mr-auto p-1 m-4">
            <ChevronUpIcon className="text-navy stroke-2 w-4 h-4" />
          </Select.ScrollUpButton>
          <Select.Viewport>
            {options.map((option, index) => (
              <Item key={index} {...option} />
            ))}
          </Select.Viewport>
          <Select.ScrollDownButton className="ml-auto mr-auto p-1">
            <ChevronDownIcon className="text-navy stroke-2 w-4 h-4" />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Root>
    </Form>
  );
};

export { Dropdown };

const Item = ({ label, value }: { label: string; value: string }) => (
  <Select.Item
    value={value}
    className="mx-3 my-2 px-3 py-1 text-base text-secondary flex items-center justify-between  hover:text-purple cursor-pointer focus-visible:outline-none focus-visible:bg-background rounded-md"
  >
    <Select.ItemText>{label}</Select.ItemText>
    <Select.ItemIndicator>
      <CheckIcon className="text-purple w-4 h-4" />
    </Select.ItemIndicator>
  </Select.Item>
);
