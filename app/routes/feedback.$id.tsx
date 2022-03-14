import { ArrowLeftIcon } from "@heroicons/react/outline";
import { ActionFunction, LoaderFunction, useSearchParams } from "remix";
import { Link, Form, redirect, useActionData } from "remix";
import { json, useLoaderData } from "remix";
import { Feedback } from "~/components/feedback";
import { H3, Paragraph } from "~/components/typography";
import { TextArea } from "~/components/text-input";
import {
  commentOnFeedback,
  fetchFeedbackById,
  replyToComment,
} from "~/utils/feedback.server";
import { useEffect, useState } from "react";
import invariant from "tiny-invariant";
import { badRequest, getErrorMessage } from "~/utils/misc";
import { DbFeedback, DbComment } from "~/types";
import { Comment } from "~/components/feedback-comment";

type LoaderData = {
  feedback: DbFeedback | null;
};

export const loader: LoaderFunction = async ({ params }) => {
  const feedback = await fetchFeedbackById(params.id);

  const data: LoaderData = {
    feedback,
  };

  return json(data);
};

type ActionData = {
  fieldErrors: {
    comment?: string;
    reply?: string;
  };
  fields: {
    comment?: string;
    reply?: string;
  };
};

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();
  const action = formData.get("_action");

  if (action === "comment") {
    const comment = formData.get("comment");
    invariant(typeof comment === "string", "comment must be a string");

    try {
      const newComment = await commentOnFeedback({
        id: params.id,
        content: comment,
      });

      return redirect(`/feedback/${params.id}?=comment-${newComment.id}`);
    } catch (error) {
      return badRequest<ActionData>({
        fieldErrors: {
          comment: getErrorMessage(error),
        },
        fields: {
          comment,
        },
      });
    }
  }

  if (action === "reply") {
    const replyComment = formData.get("replyComment");
    const commentId = formData.get("commentId");
    invariant(
      typeof replyComment === "string",
      "replyComment must be a string"
    );
    invariant(typeof commentId === "string", "commentId must be a string");

    try {
      const reply = await replyToComment({
        feedbackId: params.id,
        commentId,
        content: replyComment,
      });

      return redirect(`/feedback/${params.id}?id=reply-${reply.id}`);
    } catch (error) {
      return badRequest<ActionData>({
        fieldErrors: {
          reply: getErrorMessage(error),
        },
        fields: {
          reply: replyComment,
        },
      });
    }
  }
};

export default function FeedbackPage() {
  const data = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();
  const [searchParams] = useSearchParams();
  const href = searchParams.get("return");
  const localLink = searchParams.get("id");

  useEffect(() => {
    if (localLink) {
      const anchor = document.querySelector(`#${localLink}`);
      if (anchor) {
        const yOffset = -200;
        const yPosition =
          anchor.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: yPosition });
      }
    }
  }, [localLink]);

  const [formValues, setFormValues] = useState({
    comment: "",
  });
  const isFormValid = formValues.comment.length > 0;

  return (
    <section
      className="flex flex-col justify-center items-center pt-14 px-8 pb-10 ml-auto mr-auto sm:pt-8 "
      style={{
        width: "min(100%, 750px)",
      }}
    >
      <header className="flex justify-between pb-6 items-baseline w-full">
        <Link
          to={href ? `/${href}` : "/"}
          className="btn-ghost self-start flex items-center gap-2 !px-0"
        >
          <ArrowLeftIcon className="w-4 h-4 text-navy" />
          Go Back
        </Link>
        {data.feedback ? (
          <Link to={`/feedback/${data.feedback?.id}/edit`} className="btn-blue">
            Edit Feedback
          </Link>
        ) : null}
      </header>

      {data.feedback ? (
        <div className="flex flex-col gap-6 w-full">
          <Feedback
            id={data.feedback.id}
            title={data.feedback.title}
            category={data.feedback.category}
            detail={data.feedback.detail}
            upvotes={data.feedback.upvotes}
            numComments={data.feedback._count.comments}
          />
          <Comments
            comments={data.feedback?.comments}
            numComments={data.feedback._count.comments}
          />
          <Form
            method="post"
            className="bg-white rounded-xl p-6"
            onChange={(e) => {
              const form = e.currentTarget;
              setFormValues({
                comment: form.comment.value,
              });
            }}
          >
            <H3 className="pb-6">Add Comment</H3>
            {actionData?.fieldErrors.comment ? (
              <H3 className="text-red pb-2">
                {actionData.fieldErrors.comment}
              </H3>
            ) : null}
            <div className="pb-3">
              <TextArea
                name="comment"
                defaultValue={actionData?.fields?.comment || ""}
                placeholder="Add a comment to this feedback"
                rows={3}
                maxLength={255}
              />
            </div>
            <div className="flex justify-between items-baseline">
              <Paragraph size="2" className="tabular-nums">
                {225 - formValues.comment.length} characters left
              </Paragraph>
              <button
                name="_action"
                value="comment"
                disabled={!isFormValid}
                className="btn-purple"
              >
                Post Comment
              </button>
            </div>
          </Form>
        </div>
      ) : null}
    </section>
  );
}

const Comments = ({
  comments,
  numComments,
}: {
  comments: DbComment[] | undefined;
  numComments: number;
}) => {
  return comments && numComments > 0 ? (
    <section className="bg-white rounded-xl px-8 py-6 sm:px-6">
      <H3 className="pb-7">
        {numComments} Comment{numComments > 1 ? "s" : ""}
      </H3>
      <div className="flex flex-col gap-8">
        {comments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </div>
    </section>
  ) : null;
};
