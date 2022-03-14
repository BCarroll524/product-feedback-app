// handle upvoting here
// and reference route from other places

import type { ActionFunction } from "remix";
import { redirect } from "remix";
import invariant from "tiny-invariant";
import { upvoteFeedback } from "~/utils/feedback.server";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const location = formData.get("redirect");
  const feedbackId = formData.get("feedbackId");
  invariant(typeof location === "string", "redirect must be a string");
  invariant(typeof feedbackId === "string", "feedbackId must be a string");

  await upvoteFeedback(feedbackId);

  return redirect(location);
};
