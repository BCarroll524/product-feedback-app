import { Status, Category, Feedback as DbFeedback } from "@prisma/client";
import { ArrowLeftIcon } from "@heroicons/react/outline";
import {
  ActionFunction,
  Form,
  Link,
  LoaderFunction,
  redirect,
  useActionData,
} from "remix";
import { json, useLoaderData } from "remix";
import invariant from "tiny-invariant";
import {
  badRequest,
  getErrorMessage,
  validateDetail,
  validateTitle,
} from "~/utils/misc";
import { Dropdown } from "~/components/select";
import { TextInput, TextArea } from "~/components/text-input";
import { H1, H4, Paragraph } from "~/components/typography";
import {
  deleteFeedback,
  editFeedback,
  fetchFeedbackById,
} from "~/utils/feedback.server";

type LoaderData = {
  feedback: DbFeedback | null;
  categories: string[];
  status: string[];
};

export const loader: LoaderFunction = async ({ params }) => {
  const feedback = await fetchFeedbackById(params.id);

  const categories = Object.values(Category).sort();
  const status = Object.values(Status).sort();

  const data: LoaderData = {
    feedback,
    categories,
    status,
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
    status: string;
  };
};

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();

  const action = formData.get("_action");

  if (action === "delete") {
    await deleteFeedback(params.id);
    return redirect("/");
  }

  if (action === "cancel") {
    return redirect(`/feedback/${params.id}`);
  }

  if (action === "submit") {
    try {
      const title = formData.get("title");
      const detail = formData.get("detail");
      const category = formData.get("category");
      const status = formData.get("status");

      invariant(typeof title === "string", "title must be a string");
      invariant(typeof detail === "string", "detail must be a string");
      invariant(typeof category === "string", "category must be a string");
      invariant(typeof status === "string", "status must be a string");

      const fieldErrors = {
        title: validateTitle(title),
        detail: validateDetail(detail),
      };

      const fields = { title, detail, category, status };

      if (Object.values(fieldErrors).some(Boolean)) {
        return badRequest<ActionData>({ fieldErrors, fields });
      }

      const feedback = await editFeedback(params.id, {
        title,
        detail,
        category,
        status,
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
          status: "",
        },
      };

      return json(data);
    }
  }
};

export default function Edit() {
  const data = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();
  return (
    <div
      className="flex flex-col gap-12 justify-center items-center pt-14 px-8 pb-14 ml-auto mr-auto sm:pt-8 sm:gap-5"
      style={{
        width: "min(100%, 680px)",
      }}
    >
      <Link
        to={`/feedback/${data.feedback?.id}`}
        className="btn-ghost pb-16 self-start flex items-center gap-2 !px-0"
      >
        <ArrowLeftIcon className="w-4 h-4 text-navy" />
        Go Back
      </Link>
      <Form
        method="post"
        className="bg-white rounded-xl pt-12 px-11 pb-10 w-full"
      >
        <H1 className="pb-10">Editing `{data.feedback?.title}`</H1>
        {actionData?.formError ? (
          <H4 className="text-red pb-2">{actionData.formError}</H4>
        ) : null}
        <H4>Feedback Title</H4>
        <Paragraph size="2" className="pb-3">
          Add a short, descriptive headline
        </Paragraph>

        <div className="mb-6">
          <TextInput
            defaultValue={actionData?.fields?.title || data.feedback?.title}
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
          defaultValue={actionData?.fields?.category || data.feedback?.category}
          className="w-full mb-6"
        />

        <H4>Update Status</H4>
        <Paragraph size="2" className="pb-3">
          Change feedback state
        </Paragraph>
        <Dropdown
          name="status"
          options={data.status}
          defaultValue={actionData?.fields?.status || data.feedback?.status}
          className="w-full mb-6"
        />

        <H4>Feedback Details</H4>
        <Paragraph size="2" className="pb-3">
          Include any specific comments on what should be improved, added, etc.
        </Paragraph>
        <TextArea
          className="mb-8"
          defaultValue={actionData?.fields?.detail || data.feedback?.detail}
          placeholder="A user should be able to reply and create a thread to comment already made"
          name="detail"
          error={undefined}
        />
        <div className="flex gap-4 sm:flex-col-reverse">
          <button
            name="_action"
            value="delete"
            className="btn-red mr-auto sm:mr-0 sm:w-full"
          >
            Delete
          </button>
          <button name="_action" value="cancel" className="btn-navy sm:w-full">
            Cancel
          </button>
          <button
            name="_action"
            value="submit"
            className="btn-purple sm:w-full"
          >
            Save Feedback
          </button>
        </div>
      </Form>
    </div>
  );
}
