import type { LoaderFunction } from "remix";
import { json, useLoaderData } from "remix";
import { LightningBoltIcon } from "@heroicons/react/outline";
import { Link } from "remix";
import { ChipCard } from "~/components/chip-card";
import { Roadmap } from "~/components/roadmap-card";
import { H1, H3, Paragraph } from "~/components/typography";
import { UserCard } from "~/components/user-card";
import { Category, Status } from "@prisma/client";
import { Dropdown } from "~/components/sort-by-select";
import { Feedback } from "~/components/feedback";
import { fetchSuggestions, fetchRoadmap } from "~/utils/feedback.server";
import { DbFeedback } from "~/types";
import { MobileHeader } from "~/components/mobile-header";

export type LoaderData = {
  suggestions: DbFeedback[];
  categories: string[];
  roadmap: Record<Exclude<Status, "Suggestion">, number>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const tag = url.searchParams.get("tag");
  const sortBy = url.searchParams.get("sortBy") || "mostUpvotes";
  const suggestions = await fetchSuggestions({ tag, sortBy });
  const roadmap = await fetchRoadmap();
  const categories = Object.values(Category);

  const data: LoaderData = {
    suggestions,
    categories,
    roadmap: {
      [Status.Planned]: roadmap.planned.length,
      [Status.InProgress]: roadmap.inProgress.length,
      [Status.Live]: roadmap.live.length,
    },
  };

  return json(data);
};

export default function Index() {
  const data = useLoaderData<LoaderData>();
  const tags = ["All", ...data.categories];

  return (
    <section className="pt-16 flex justify-center px-28 gap-7 pb-16 md:block md:px-0 sm:pt-0">
      <MobileHeader />
      <aside className="flex flex-col gap-6 w-80 md:flex-row md:gap-3 md:w-full md:justify-evenly md:px-10 md:pb-10 sm:hidden">
        <UserCard className=" min-h-[140px] md:flex-1" />
        <ChipCard className="md:flex-1" tags={tags} />
        <Roadmap className="md:flex-1" items={data.roadmap} />
      </aside>
      <main className="w-full">
        <header className="bg-navy py-4 px-5 flex justify-center items-center gap-9 rounded-xl mb-6 sm:rounded-none md:mx-10 sm:!mx-0 sm:mb-8">
          <div className="flex items-baseline gap-3 mr-auto">
            <div className="self-center flex-shrink-0 sm:hidden">
              <LightningBoltIcon className="w-6 h-6 text-white" />
            </div>
            <H3 variant="light" className="pr-4 sm:hidden">
              {data.suggestions.length}{" "}
              <span className="md:hidden">Suggestions</span>
            </H3>
            <div className="flex items-baseline">
              <Dropdown className="bg-navy !text-white" />
            </div>
          </div>

          <AddFeedbackButton />
        </header>
        {data.suggestions.length > 0 ? (
          <div className="flex flex-col gap-5 md:px-10">
            {data.suggestions.map((feedback) => (
              <Feedback
                key={feedback.id}
                id={feedback.id}
                title={feedback.title}
                category={feedback.category}
                detail={feedback.detail}
                upvotes={feedback.upvotes}
                numComments={feedback._count.comments}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl h-[600px] flex flex-col justify-center items-center w-full">
            <H1 variant="dark" className="pb-4">
              There is no feedback yet.
            </H1>
            <Paragraph
              size="1"
              variant="dark"
              className="whitespace-pre-wrap pb-12 text-center"
            >{`Got a suggestion? Found a bug that needs to be squashed?\nWe love hearing about new ideas to improve out app.`}</Paragraph>
            <AddFeedbackButton />
          </div>
        )}
      </main>
    </section>
  );
}

const AddFeedbackButton = () => {
  return (
    <Link to="/new" className="btn-purple font-bold">
      Add Feedback
    </Link>
  );
};
