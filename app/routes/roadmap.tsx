import { ArrowLeftIcon } from "@heroicons/react/outline";
import { Link, LoaderFunction, useLoaderData } from "remix";
import { json } from "remix";
import { RoadmapColumn } from "~/components/roadmap-column";
import { RoadmapTabs } from "~/components/roadmap-tabs";
import { H1, Paragraph } from "~/components/typography";
import { DbFeedback } from "~/types";
import { fetchRoadmap } from "~/utils/feedback.server";
import { AddFeedbackButton } from ".";

export type RoadmapLoaderData = {
  planned: DbFeedback[];
  inProgress: DbFeedback[];
  live: DbFeedback[];
};

export const loader: LoaderFunction = async () => {
  const roadmap = await fetchRoadmap();

  const data: RoadmapLoaderData = roadmap;

  return json(data);
};

export default function Roadmap() {
  const data = useLoaderData<RoadmapLoaderData>();

  const hasRoadmapItems =
    data.planned.length + data.inProgress.length + data.live.length > 0;

  return (
    <section
      className="pt-16 sm:!pt-0 md:pt-12  mr-auto ml-auto px-10 sm:px-0"
      style={{ width: "min(100%, 1100px)" }}
    >
      <header className="flex justify-between items-center px-8 py-7 rounded-xl bg-navy mb-12 md:mb-8 sm:!mb-0 sm:rounded-none">
        <div>
          <Link
            to="/"
            className="btn-ghost-white self-start flex items-center gap-2 !px-0 !py-0"
          >
            <ArrowLeftIcon className="w-4 h-4 text-white" />
            Go Back
          </Link>
          <H1 variant="light">Roadmap</H1>
        </div>
        <AddFeedbackButton />
      </header>
      {hasRoadmapItems ? (
        <>
          <div className="grid grid-cols-3 gap-6 md:gap-3 sm:hidden">
            <RoadmapColumn
              feedbacks={data.planned}
              title="Planned"
              description="Ideas prioritized for research"
            />
            <RoadmapColumn
              feedbacks={data.inProgress}
              title="In-Progress"
              description="Currently being developed"
            />
            <RoadmapColumn
              feedbacks={data.live}
              title="Live"
              description="Released features"
            />
          </div>
          <RoadmapTabs />
        </>
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
    </section>
  );
}
