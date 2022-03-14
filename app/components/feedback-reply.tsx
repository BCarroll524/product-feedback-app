// there should only be one text input for all replies in thread but message should start with @username
// of comment responsible for Reply button clicked

import clsx from "clsx";
import { useState, useRef, useEffect } from "react";
import { useFetcher } from "remix";
import { TextArea } from "./text-input";
import { H4, Paragraph } from "./typography";
import { Comment as DbReply } from "@prisma/client";

const Reply = ({
  comment,
  parentCommentId,
  hasMoreReplies,
}: {
  comment: DbReply;
  parentCommentId: number;
  hasMoreReplies: boolean;
}) => {
  const [showReply, setShowReply] = useState(false);
  const [formValues, setFormValues] = useState({
    reply: "",
  });
  const isFormValid = formValues.reply.length > 0;
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
    <div id={`reply-${comment.id}`} className="flex">
      <div
        className={clsx(
          "ml-5 pl-6 border-l-2 border-dark-gray",
          hasMoreReplies ? "" : "h-5"
        )}
      />
      <div className="flex-1">
        <div className="flex gap-6 items-center pb-4 sm:gap-4">
          <div className="w-10 h-10 rounded-full bg-navy-light" />
          <div className="mr-auto">
            <H4>Tony Stark</H4>
            <Paragraph size="2">@the-ironman</Paragraph>
          </div>
          <button
            onClick={() => setShowReply(!showReply)}
            className="text-xs font-semibold tracking-wider text-blue hover:underline underline-offset-1"
          >
            {showReply ? "Hide reply" : "Reply"}
          </button>
        </div>
        <div className={clsx("pl-16 sm:pl-0", showReply ? "pb-6" : "pb-8")}>
          <Paragraph size="1">{comment.content}</Paragraph>
        </div>
        {showReply ? (
          <fetcher.Form
            ref={formRef}
            method="post"
            className="pl-16 sm:pl-0 flex gap-4 pb-8 "
            onChange={(e) => {
              const form = e.currentTarget;
              setFormValues({
                reply: form.replyComment.value,
              });
            }}
          >
            <input type="hidden" name="commentId" value={parentCommentId} />
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
      </div>
    </div>
  );
};

export { Reply };
