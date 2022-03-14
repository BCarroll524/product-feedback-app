import clsx from "clsx";
import { useRef, useState, useEffect } from "react";
import { useFetcher } from "remix";
import { DbComment } from "~/types";
import { Reply } from "./feedback-reply";
import { TextArea } from "./text-input";
import { H4, Paragraph } from "./typography";

const Comment = ({ comment }: { comment: DbComment }) => {
  const [showReply, setShowReply] = useState(false);
  const [formValues, setFormValues] = useState({
    reply: "",
  });

  const isFormValid = formValues.reply.length > 0;
  const replies = comment.replies.length;

  const formRef = useRef<HTMLFormElement>(null);
  const fetcher = useFetcher();
  const isReplying =
    fetcher.state === "submitting" &&
    fetcher.submission.formData.get("_action") === "reply";

  useEffect(() => {
    if (!isReplying) {
      setFormValues({
        reply: "",
      });
      setShowReply(false);
      formRef.current?.reset();
    }
  }, [isReplying]);

  return (
    <div
      id={`comment-${comment.id}`}
      className="group border-b-2 border-dark-gray last:border-0 "
    >
      <div className="flex gap-6 items-center pb-4 sm:gap-4">
        <div className="w-10 h-10 rounded-full bg-navy-light" />
        <div className="mr-auto">
          <H4>Elijah Moss</H4>
          <Paragraph size="2">@hexagon.bestagon</Paragraph>
        </div>
        <button
          onClick={() => setShowReply(!showReply)}
          className="text-xs font-semibold tracking-wider text-blue hover:underline underline-offset-1"
        >
          {showReply ? "Hide reply" : "Reply"}
        </button>
      </div>
      <div
        className={clsx(
          replies ? "ml-5 pl-11 border-l-2 border-dark-gray" : "pl-16",
          showReply && replies < 1 ? "pb-6" : "pb-8",
          replies ? "sm:pl-6" : "sm:pl-0"
        )}
      >
        <Paragraph size="1">{comment.content}</Paragraph>
      </div>
      {showReply ? (
        <fetcher.Form
          ref={formRef}
          method="post"
          className={clsx(
            replies ? "ml-5 pl-6 border-l-2 border-dark-gray" : "pl-16",
            replies ? "sm:pl-6" : "sm:pl-0",
            replies ? "pb-8" : "pb-8 group-last:pb-0",
            "flex gap-4"
          )}
          onChange={(e) => {
            const form = e.currentTarget;
            setFormValues({
              reply: form.replyComment.value,
            });
          }}
        >
          <input type="hidden" name="commentId" value={comment.id} />
          <div className="flex-grow">
            <TextArea
              name="replyComment"
              placeholder="Reply to comment"
              rows={3}
            />
          </div>
          <div>
            <button
              name="_action"
              value="reply"
              disabled={!isFormValid}
              className="btn-purple"
            >
              {isReplying ? (
                "Replying..."
              ) : (
                <>
                  <span className="sm:hidden">Post </span>Reply
                </>
              )}
            </button>
          </div>
        </fetcher.Form>
      ) : null}
      {comment.replies.map((reply, index) => (
        <Reply
          key={reply.id}
          comment={reply}
          parentCommentId={comment.id}
          hasMoreReplies={replies > index + 1}
        />
      ))}
    </div>
  );
};

export { Comment };
