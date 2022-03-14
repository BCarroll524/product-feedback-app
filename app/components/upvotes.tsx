import { ChevronUpIcon } from "@heroicons/react/outline";
import clsx from "clsx";
import { Form, useLocation } from "remix";
import { H4 } from "./typography";

const Upvotes = ({
  id,
  upvotes,
  className,
  horizontal,
}: {
  id: number;
  upvotes: number;
  className?: string;
  horizontal?: boolean;
}) => {
  const location = useLocation();
  return (
    <Form method="post" action={`/feedback/${id}/upvote`}>
      <input type="hidden" name="redirect" value={location.pathname} />
      <input type="hidden" name="feedbackId" value={id} />
      <button
        className={clsx(
          "flex items-center",
          horizontal ? "flex-row gap-2" : "flex-col",
          "p-2 px-3 bg-background rounded-xl mr-10 h-fit self-center hover:bg-navy-light sm:flex-row sm:gap-2 sm:px-4 sm:py-2",
          className
        )}
      >
        <ChevronUpIcon className="w-6 h-6 md:w-4 md:h-4 flex-grow-0 text-blue flex-shrink-0 stroke-[3px]" />
        <H4 className="tabular-nums">{upvotes}</H4>
      </button>
    </Form>
  );
};

export { Upvotes };
