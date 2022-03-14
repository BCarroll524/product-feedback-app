import { db } from "./db.server";
import { Category, Prisma, Status } from "@prisma/client";
import { DbFeedback } from "~/types";

const order: Record<string, Record<string, string | Record<string, string>>> = {
  mostUpvotes: Prisma.validator<Prisma.FeedbackOrderByWithAggregationInput>()({
    upvotes: "desc",
  }),
  leastUpvotes: Prisma.validator<Prisma.FeedbackOrderByWithAggregationInput>()({
    upvotes: "asc",
  }),
  mostComments: Prisma.validator<Prisma.FeedbackOrderByWithRelationInput>()({
    comments: {
      _count: "desc",
    },
  }),
  leastComments: Prisma.validator<Prisma.FeedbackOrderByWithRelationInput>()({
    comments: {
      _count: "asc",
    },
  }),
};

const fetchSuggestions = async ({
  tag,
  sortBy,
}: {
  tag: string | null;
  sortBy: string | null;
}): Promise<DbFeedback[]> => {
  const where =
    tag && tag !== "All"
      ? {
          category: tag as Category,
        }
      : {};

  const orderBy = sortBy ? order[sortBy] : {};

  const feedbacks = await db.feedback.findMany({
    where: {
      ...where,
      status: "Suggestion",
    },
    orderBy,
    include: {
      _count: {
        select: { comments: true },
      },
      comments: {
        include: {
          replies: true,
        },
      },
    },
  });

  return feedbacks;
};

const fetchRoadmap = async () => {
  const feedbacks = await db.feedback.findMany({
    where: {
      status: {
        not: "Suggestion",
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
    include: {
      _count: {
        select: { comments: true },
      },
      comments: {
        include: {
          replies: true,
        },
      },
    },
  });

  const planned = feedbacks.filter((feedback) => feedback.status === "Planned");
  const inProgress = feedbacks.filter(
    (feedback) => feedback.status === "InProgress"
  );
  const live = feedbacks.filter((feedback) => feedback.status === "Live");

  return {
    planned,
    inProgress,
    live,
  };
};

const fetchFeedbackById = async (
  id: string | number | undefined
): Promise<DbFeedback> => {
  const feedback = await db.feedback.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      _count: {
        select: { comments: true },
      },
      comments: {
        include: {
          replies: true,
        },
      },
    },
  });

  if (!feedback) {
    throw new Error("Feedback not found");
  }

  const comments =
    feedback?.comments.filter((comment) => Boolean(!comment.commentId)) || [];

  return {
    ...feedback,
    comments,
  };
};

const createFeedback = async ({
  title,
  detail,
  category,
}: {
  title: string;
  detail: string;
  category: string;
}) => {
  return db.feedback.create({
    data: {
      title,
      detail,
      category: category as Category,
    },
  });
};

const editFeedback = async (
  id: string | number | undefined,
  data: {
    title: string;
    detail: string;
    category: string;
    status: string;
  }
) => {
  const feedback = await db.feedback.update({
    where: {
      id: Number(id),
    },
    data: {
      title: data.title,
      detail: data.detail,
      category: data.category as Category,
      status: data.status as Status,
    },
  });

  return feedback;
};

const deleteFeedback = (id: string | number | undefined) => {
  return db.feedback.delete({
    where: {
      id: Number(id),
    },
  });
};

const commentOnFeedback = ({
  id,
  content,
}: {
  id: string | number | undefined;
  content: string;
}) => {
  return db.feedback.update({
    where: {
      id: Number(id),
    },
    data: {
      comments: {
        create: {
          content,
        },
      },
    },
  });
};

const replyToComment = ({
  feedbackId,
  commentId,
  content,
}: {
  feedbackId: string | number | undefined;
  commentId: string | number;
  content: string;
}) => {
  return db.comment.create({
    data: {
      content,
      commentId: Number(commentId),
      feedbackId: Number(feedbackId),
    },
  });
};

const upvoteFeedback = (id: string | number) => {
  return db.feedback.update({
    where: {
      id: Number(id),
    },
    data: {
      upvotes: {
        increment: 1,
      },
    },
  });
};

export {
  fetchSuggestions,
  fetchRoadmap,
  fetchFeedbackById,
  createFeedback,
  editFeedback,
  deleteFeedback,
  commentOnFeedback,
  replyToComment,
  upvoteFeedback,
};
