import { H2, Paragraph } from "~/components/typography";
import clsx from "clsx";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import { useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ChipCard } from "./chip-card";
import { useLoaderData } from "remix";
import { LoaderData } from "~/routes";
import { Roadmap } from "./roadmap-card";

const UserCard = ({ className }: { className?: string }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const data = useLoaderData<LoaderData>();
  const tags = ["All", ...data.categories];

  return (
    <div
      ref={ref}
      className={clsx(
        "bg-red-300 rounded-xl bg-gradient-to-r from-red via-purple to-light-blue p-6 flex justify-between",
        className
      )}
    >
      <div className="flex flex-col justify-end h-full">
        <H2 variant="light">Frontend Mentor</H2>
        <Paragraph size="2" variant="light" className="text-gray-300">
          Feedback Board
        </Paragraph>
      </div>

      <Dialog.Root open={open}>
        <Dialog.Trigger asChild>
          <button
            className="hidden self-center sm:block"
            onClick={() => setOpen(true)}
          >
            <MenuIcon className="text-white w-6 h-6" />
          </button>
        </Dialog.Trigger>
        <Dialog.Portal className="border">
          <Dialog.Overlay className="absolute inset-0 bg-black opacity-75" />
          <Dialog.Content
            className={clsx(
              "bg-background p-6 pt-7 absolute bottom-0 right-0 w-72 top-0 flex flex-col gap-5"
            )}
            onInteractOutside={() => setOpen(false)}
          >
            <button className="ml-auto" onClick={() => setOpen(false)}>
              <XIcon className="text-navy w-6 h-6 items-end" />
            </button>
            <ChipCard tags={tags} />
            <Roadmap items={data.roadmap} />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export { UserCard };
