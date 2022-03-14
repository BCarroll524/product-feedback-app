import { DbFeedback } from "~/types";
import { CommentBubble } from "./comment-bubble";
import { H3, Paragraph } from "./typography";
import { Upvotes } from "./upvotes";
import { Status } from "@prisma/client";
import clsx from "clsx";
import { Link } from "remix";

const borders = {
  [Status.Planned]: "border-t-orange",
  [Status.InProgress]: "border-t-purple",
  [Status.Live]: "border-t-light-blue",
  [Status.Suggestion]: "",
};

const colors = {
  [Status.Planned]: "bg-orange",
  [Status.InProgress]: "bg-purple",
  [Status.Live]: "bg-light-blue",
  [Status.Suggestion]: "",
};

const RoadmapItem = ({ feedback }: { feedback: DbFeedback }) => {
  return (
    <div
      className={clsx(
        "bg-white p-6 border-t-[6px] rounded-[5px]",
        borders[feedback.status]
      )}
    >
      <Link
        to={`/feedback/${feedback.id}?return=roadmap`}
        className="flex items-center gap-4 pb-6"
      >
        <span
          className={clsx("w-2 h-2 rounded-full mr-4", colors[feedback.status])}
        />
        <Paragraph variant="dark" size="1">
          {feedback.status}
        </Paragraph>
      </Link>
      <Link to={`/feedback/${feedback.id}?return=roadmap`}>
        <H3>{feedback.title}</H3>
        <Paragraph size="2" className="pb-4">
          {feedback.detail}
        </Paragraph>
        <Paragraph
          size="3"
          className="!text-blue bg-background rounded-xl px-4 py-2 mb-4 w-fit"
        >
          {feedback.category}
        </Paragraph>
      </Link>
      <div className="flex justify-between items-center">
        <Upvotes id={feedback.id} upvotes={feedback.upvotes} horizontal />
        <CommentBubble numComments={feedback._count.comments} />
      </div>
    </div>
  );
};

export { RoadmapItem };
