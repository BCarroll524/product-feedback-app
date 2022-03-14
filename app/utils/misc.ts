import { json } from "remix";

export function getErrorMessage(error: unknown) {
  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message;
  return "Unknown Error";
}

export const validateTitle = (title: string) => {
  if (title.length < 3) {
    return "This title is too short";
  }
};

export const validateDetail = (detail: string) => {
  if (detail.length < 8) {
    return "This detail is too short";
  }
};

export function badRequest<ActionData>(data: ActionData) {
  return json(data, { status: 400 });
}
