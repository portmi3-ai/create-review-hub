import { askConciergeFn } from "./investor-room.functions";

export async function askConcierge(question: string): Promise<string> {
  const result = await askConciergeFn({ data: { question } });
  return result.answer;
}
