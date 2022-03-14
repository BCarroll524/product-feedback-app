import { ArrowLeftIcon } from "@heroicons/react/outline";
import { Link, LoaderFunction, useLoaderData } from "remix";
import { json } from "remix";
import { RoadmapColumn } from "~/components/roadmap-column";
import { RoadmapTabs } from "~/components/roadmap-tabs";
import { H1 } from "~/components/typography";
import { DbFeedback } from "~/types";
import { fetchRoadmap } from "~/utils/feedback.server";

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
        <Link to="/new" className="btn-purple">
          Add Feedback
        </Link>
      </header>
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
    </section>
  );
}
