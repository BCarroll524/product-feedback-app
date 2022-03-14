import { Link } from "remix";
import { H3, Paragraph } from "~/components/typography";
import { ReactNode } from "react";
import clsx from "clsx";
import { Status } from "@prisma/client";

type RoadmapStatus = Exclude<Status, "Suggestion">;

const colors = {
  [Status.Planned]: "bg-orange",
  [Status.InProgress]: "bg-purple",
  [Status.Live]: "bg-light-blue",
};

const RoadmapCard = ({
  items,
  className,
}: {
  items: Record<RoadmapStatus, number>;
  className?: string;
}) => {
  return (
    <div className={clsx("p-6 rounded-xl bg-white", className)}>
      <div className="flex justify-between items-baseline pb-6">
        <H3 variant="dark">Roadmap</H3>
        <Link to="/roadmap">
          <Paragraph variant="dark" size="2" className="underline">
            View
          </Paragraph>
        </Link>
      </div>
      <div className="flex flex-col gap-2">
        {Object.entries(items).map(([status, count], index) => (
          <RoadmapItem
            key={index}
            count={count}
            className={colors[status as RoadmapStatus]}
          >
            {status}
          </RoadmapItem>
        ))}
      </div>
    </div>
  );
};

export { RoadmapCard as Roadmap };

const RoadmapItem = ({
  children,
  className,
  count,
}: {
  children: ReactNode;
  className?: string;
  count: number;
}) => {
  return (
    <div className="flex items-center flex-1">
      <div className={clsx("w-2 h-2 rounded-full mr-4", className)} />
      <Paragraph variant="dark" size="1">
        {children}
      </Paragraph>
      <H3 variant="dark" className="ml-auto">
        {count}
      </H3>
    </div>
  );
};
