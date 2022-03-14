import { ChatAltIcon } from "@heroicons/react/outline";
import clsx from "clsx";
import { H3 } from "./typography";

const CommentBubble = ({
  numComments,
  className,
}: {
  numComments: number;
  className?: string;
}) => {
  return (
    <div
      className={clsx(
        "flex gap-3 items-center self-center flex-shrink-0",
        className
      )}
    >
      <ChatAltIcon className="text-primary w-5 h-5" />
      <H3>{numComments}</H3>
    </div>
  );
};

export { CommentBubble };
