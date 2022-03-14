import { DbFeedback } from "~/types";
import { RoadmapItem } from "./roadmap-item";
import { H3, Paragraph } from "./typography";

const RoadmapColumn = ({
  feedbacks,
  ...rest
}: { feedbacks: DbFeedback[] } & Omit<TitleProps, "count">) => {
  return (
    <section>
      <RoadmapTitle
        {...rest}
        count={feedbacks.length}
        className="pb-8 md:pb-6"
      />
      <div className="flex flex-col gap-6">
        {feedbacks.map((feedback) => (
          <RoadmapItem key={feedback.id} feedback={feedback} />
        ))}
      </div>
    </section>
  );
};

export { RoadmapColumn };

type TitleProps = {
  title: string;
  description: string;
  count: number;
};

const RoadmapTitle = ({
  title,
  description,
  count,
  className,
}: TitleProps & { className?: string }) => {
  return (
    <div className={className}>
      <H3 className="sm:!text-lg">
        {title} ({count})
      </H3>
      <Paragraph size="1">{description}</Paragraph>
    </div>
  );
};
