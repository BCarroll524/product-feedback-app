import { Link } from "remix";
import { Paragraph, H3 } from "./typography";
import { Upvotes } from "./upvotes";
import { CommentBubble } from "./comment-bubble";
import { motion } from "framer-motion";

const Feedback = ({
  id,
  title,
  category,
  detail,
  upvotes,
  numComments,
}: {
  id: number;
  title: string;
  category: string;
  detail: string;
  upvotes: number;
  numComments: number;
}) => {
  return (
    <motion.div
      layout
      // drag
      whileDrag={{ scale: 0.5 }}
      dragSnapToOrigin
      className="bg-white px-8 py-7 rounded-xl flex w-full"
    >
      <Upvotes id={id} upvotes={upvotes} className="sm:hidden" />
      <Link
        to={`/feedback/${id}`}
        className="group flex justify-between w-full cursor-pointer sm:flex-col"
      >
        <div className="flex flex-col pr-5">
          <H3 className="group-hover:underline underline-offset-1">{title}</H3>
          <Paragraph size="1" className="pb-3">
            {detail}
          </Paragraph>
          <Paragraph
            size="3"
            className="!text-blue bg-background flex justify-center items-center rounded-xl px-4 py-2  w-fit"
          >
            {category}
          </Paragraph>
        </div>
        <CommentBubble numComments={numComments} className="sm:hidden" />
        <div className="hidden justify-between items-center pt-3 sm:flex">
          <Upvotes id={id} upvotes={upvotes} />
          <CommentBubble numComments={numComments} />
        </div>
      </Link>
    </motion.div>
  );
};

export { Feedback };
