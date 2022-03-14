import { Category, PrismaClient } from "@prisma/client";
import faker from "@faker-js/faker";

const prisma = new PrismaClient();

type Comment = {
  content: string;
};

type Feedback = {
  title: string;
  category: Category;
  detail: string;
  upvotes: number;
  comments: Comment[];
};

function getNumber(x: number) {
  return Math.floor(Math.random() * x);
}
function getWords() {
  return faker.hacker.phrase();
}

function buildComment() {
  return {
    content: getWords(),
  };
}

async function buildReply(feedbackId: number, commentId: number) {
  return prisma.comment.create({
    data: {
      content: getWords(),
      feedbackId,
      commentId,
    },
  });
}

function buildXComments(x: number) {
  return Array.from({ length: x }, () => buildComment());
}

async function buildFeedback({ comments, ...rest }: Feedback) {
  return prisma.feedback.create({
    data: {
      ...rest,
      comments: {
        create: comments.map((comment) => ({
          content: comment.content,
        })),
      },
    },
    include: {
      comments: true,
    },
  });
}

const feedbacks = [
  {
    title: "Add tags for solutions",
    category: Category.Enhancement,
    detail: "Easier to search for solutions based on a specific stack.",
    upvotes: getNumber(100),
    comments: buildXComments(getNumber(5)),
  },
  {
    title: "Add a dark theme option",
    category: Category.Feature,
    detail:
      "It would help people with light sensitivities and who prefer dark mode.",
    upvotes: getNumber(100),
    comments: buildXComments(getNumber(5)),
  },
  {
    title: "Q&A within the challenge hubs",
    category: Category.Feature,
    detail: "Challenge-specific Q&A would make for easy reference.",
    upvotes: getNumber(100),
    comments: buildXComments(getNumber(5)),
  },
  {
    title: "Preview images not loading",
    category: Category.Bug,
    detail: "Challenge preview images are missing when you apply a filter.",
    upvotes: getNumber(100),
    comments: buildXComments(getNumber(5)),
  },
  {
    title: "Allow image/video upload",
    category: Category.Enhancement,
    detail: "Images and screen casts can enhance comments on solutions.",
    upvotes: getNumber(100),
    comments: buildXComments(getNumber(5)),
  },
  {
    title: "Ability to follow others",
    category: Category.Enhancement,
    detail: "Stay updated on comments and solutions other people post.",
    upvotes: getNumber(100),
    comments: buildXComments(getNumber(5)),
  },
];

async function seed() {
  for (const feedback of feedbacks) {
    await buildFeedback(feedback);
  }

  // build feedback with comments and replies
  const feedback = await buildFeedback({
    title: "Add threaded comments",
    category: Category.UX,
    detail: "Comments are easier to read and understand.",
    upvotes: getNumber(100),
    comments: buildXComments(1),
  });

  const comment = feedback.comments[0];
  await buildReply(feedback.id, comment.id);
}

seed();
