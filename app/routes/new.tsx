import { Category } from "@prisma/client";
import { ArrowLeftIcon } from "@heroicons/react/outline";
import {
  ActionFunction,
  LoaderFunction,
  redirect,
  useActionData,
  useLoaderData,
} from "remix";
import { Form, Link, json } from "remix";
import invariant from "tiny-invariant";
import { Dropdown } from "~/components/select";
import { TextArea, TextInput } from "~/components/text-input";
import { H1, H4, Paragraph } from "~/components/typography";
import {
  badRequest,
  getErrorMessage,
  validateDetail,
  validateTitle,
} from "../utils/misc";
import { createFeedback } from "~/utils/feedback.server";

type LoaderData = {
  categories: string[];
};

export const loader: LoaderFunction = async () => {
  const categories = Object.values(Category).sort();

  const data: LoaderData = {
    categories,
  };

  return json(data);
};

type ActionData = {
  formError?: string;
  fieldErrors: {
    title?: string;
    detail?: string;
  };
  fields?: {
    title: string;
    detail: string;
    category: string;
  };
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const action = formData.get("_action");

  if (action === "cancel") {
    return redirect("/");
  }

  if (action === "submit") {
    try {
      const title = formData.get("title");
      const detail = formData.get("detail");
      const category = formData.get("category");

      invariant(typeof title === "string", "title must be a string");
      invariant(typeof detail === "string", "detail must be a string");
      invariant(typeof category === "string", "category must be a string");

      const fieldErrors = {
        title: validateTitle(title),
        detail: validateDetail(detail),
      };

      const fields = { title, detail, category };

      if (Object.values(fieldErrors).some(Boolean)) {
        return badRequest<ActionData>({ fieldErrors, fields });
      }

      const feedback = await createFeedback({
        title,
        detail,
        category,
      });

      return redirect(`/feedback/${feedback.id}`);
    } catch (error) {
      console.error("Error", error);

      const data: ActionData = {
        formError: getErrorMessage(error),
        fieldErrors: {},
        fields: {
          title: "",
          detail: "",
          category: "",
        },
      };

      return json(data);
    }
  }
};

export default function New() {
  const data = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();
  return (
    <div
      className="flex flex-col gap-12 justify-center items-center pt-14 px-8 mb-10 ml-auto mr-auto sm:pt-8 sm:gap-5"
      style={{
        width: "min(100%, 680px)",
      }}
    >
      <Link
        to="/"
        className="btn-ghost pb-16 self-start flex items-center gap-2 !px-0"
      >
        <ArrowLeftIcon className="w-4 h-4 text-navy" />
        Go Back
      </Link>
      <Form
        method="post"
        className="bg-white rounded-xl pt-12 px-11 pb-10 w-full"
      >
        <H1 className="pb-10">Create New Feedback</H1>
        {actionData?.formError ? (
          <H4 className="text-red pb-2">{actionData.formError}</H4>
        ) : null}
        <H4>Feedback Title</H4>
        <Paragraph size="2" className="pb-3">
          Add a short, descriptive headline
        </Paragraph>

        <div className="mb-6">
          <TextInput
            defaultValue={actionData?.fields?.title}
            placeholder="Allow threaded comments on feedback"
            name="title"
            error={actionData?.fieldErrors.title}
          />
        </div>
        <H4>Category</H4>
        <Paragraph size="2" className="pb-3">
          Choose a category for your feedback
        </Paragraph>
        <Dropdown
          name="category"
          options={data.categories}
          defaultValue={actionData?.fields?.category}
          className="w-full mb-6"
        />
        <H4>Feedback Details</H4>
        <Paragraph size="2" className="pb-3">
          Include any specific comments on what should be improved, added, etc.
        </Paragraph>
        <TextArea
          className="mb-8"
          defaultValue={actionData?.fields?.detail}
          placeholder="A user should be able to reply and create a thread to comment already made"
          name="detail"
          error={undefined}
        />
        <div className="flex justify-end gap-4 sm:flex-col-reverse">
          <button name="_action" value="cancel" className="btn-navy sm:w-full">
            Cancel
          </button>
          <button
            name="_action"
            value="submit"
            className="btn-purple sm:w-full"
          >
            Add Feedback
          </button>
        </div>
      </Form>
    </div>
  );
}
