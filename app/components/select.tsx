import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/outline";
import * as Select from "@radix-ui/react-select";
import clsx from "clsx";

const Dropdown = ({
  options,
  defaultValue,
  name,
  className,
}: {
  options: string[];
  defaultValue?: string;
  name: string;
  className?: string;
}) => (
  <Select.Root name={name} defaultValue={defaultValue ?? options[0]}>
    <Select.Trigger
      className={clsx(
        "flex items-center justify-between gap-1 bg-background rounded-xl px-6 py-3 text-primary text-base min-w-[160px] border-[1px] border-transparent focus:border-[1px] focus:border-blue focus:!outline-none",
        className
      )}
    >
      <Select.Value />
      <Select.Icon asChild>
        <ChevronDownIcon className="text-blue stroke-2 w-4 h-4" />
      </Select.Icon>
    </Select.Trigger>

    <Select.Content className="bg-white rounded-xl shadow-md w-[255px]">
      <Select.ScrollUpButton className="ml-auto mr-auto p-1">
        <ChevronUpIcon className="text-blue stroke-2 w-4 h-4" />
      </Select.ScrollUpButton>
      <Select.Viewport>
        {options.map((option, index) => (
          <Item key={index} value={option} />
        ))}
      </Select.Viewport>
      <Select.ScrollDownButton className="ml-auto mr-auto p-1">
        <ChevronDownIcon className="text-blue stroke-2 w-4 h-4" />
      </Select.ScrollDownButton>
    </Select.Content>
  </Select.Root>
);

export { Dropdown };

const Item = ({ value }: { value: string }) => (
  <Select.Item
    value={value}
    className="mx-3 my-2 px-3 py-1 text-base text-secondary flex items-center justify-between  hover:text-purple cursor-pointer focus-visible:outline-none focus-visible:bg-background rounded-md"
  >
    <Select.ItemText>{value}</Select.ItemText>
    <Select.ItemIndicator>
      <CheckIcon className="text-purple w-4 h-4" />
    </Select.ItemIndicator>
  </Select.Item>
);
