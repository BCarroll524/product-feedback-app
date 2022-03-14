import { Prisma } from "@prisma/client";

const feedbackWithComments = Prisma.validator<Prisma.FeedbackArgs>()({
  include: {
    comments: {
      include: {
        replies: true,
      },
    },
    _count: {
      select: { comments: true },
    },
  },
});

type DbFeedback = Prisma.FeedbackGetPayload<typeof feedbackWithComments>;

const commentWithReplies = Prisma.validator<Prisma.CommentArgs>()({
  include: {
    replies: true,
  },
});

type DbComment = Prisma.CommentGetPayload<typeof commentWithReplies>;

export type { DbFeedback, DbComment };
