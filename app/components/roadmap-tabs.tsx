import * as Tabs from "@radix-ui/react-tabs";
import { useState } from "react";
import { H3 } from "./typography";
import clsx from "clsx";
import { useLoaderData } from "remix";
import { RoadmapLoaderData } from "~/routes/roadmap";
import { RoadmapColumn } from "./roadmap-column";
import { H4 } from "~/components/typography";

const RoadmapTabs = () => {
  const data = useLoaderData<RoadmapLoaderData>();
  const [value, setValue] = useState("Planned");

  return (
    <Tabs.Root
      defaultValue="Planned"
      value={value}
      onValueChange={(val) => setValue(val)}
      className="hidden sm:block"
    >
      <Tabs.List className="flex border-b border-dark-gray">
        <Trigger
          value="Planned"
          count={data.planned.length}
          selected={value}
          className="border-orange"
        />
        <Trigger
          value="In-Progress"
          count={data.inProgress.length}
          selected={value}
          className="border-purple"
        />
        <Trigger
          value="Live"
          count={data.live.length}
          selected={value}
          className="border-light-blue"
        />
      </Tabs.List>
      <Tabs.Content value="Planned" className="px-6 py-8">
        <RoadmapColumn
          feedbacks={data.planned}
          title="Planned"
          description="Ideas prioritized for research"
        />
      </Tabs.Content>
      <Tabs.Content value="In-Progress" className="px-6 py-8">
        <RoadmapColumn
          feedbacks={data.inProgress}
          title="In-Progress"
          description="Currently being developed"
        />
      </Tabs.Content>
      <Tabs.Content value="Live" className="px-6 py-8">
        <RoadmapColumn
          feedbacks={data.live}
          title="Live"
          description="Released features"
        />
      </Tabs.Content>
    </Tabs.Root>
  );
};

export { RoadmapTabs };

const Trigger = ({
  value,
  count,
  selected,
  className,
}: {
  value: string;
  count: number;
  selected: string;
  className: string;
}) => {
  const isSelected = value === selected;

  return (
    <Tabs.Trigger
      value={value}
      className={clsx(
        "flex-1 pt-5 pb-4 border-b-4",
        isSelected ? className : "border-transparent"
      )}
    >
      <H4
        className={clsx(
          "text-center tabular-nums",
          isSelected ? "text-primary" : "!text-primary-disabled"
        )}
      >
        {value} ({count})
      </H4>
    </Tabs.Trigger>
  );
};
