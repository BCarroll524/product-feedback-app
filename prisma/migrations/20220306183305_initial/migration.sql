-- CreateEnum
CREATE TYPE "Category" AS ENUM ('UI', 'UX', 'Enhancement', 'Bug', 'Feature');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Suggestion', 'Planned', 'InProgress', 'Live');

-- CreateTable
CREATE TABLE "Feedback" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR NOT NULL,
    "category" "Category" NOT NULL,
    "detail" VARCHAR NOT NULL,
    "status" "Status" NOT NULL DEFAULT E'Suggestion',
    "upvotes" INTEGER NOT NULL DEFAULT 0,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);
