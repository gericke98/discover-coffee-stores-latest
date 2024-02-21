"use server";

import { updateCoffeeStore } from "@/lib/airtable";

type State = {
  id: string;
};

export const upvoteAction = async (prevState: State) => {
  const { id } = prevState;

  const data = await updateCoffeeStore(id);

  if (data) {
    return {
      voting: data.length > 0 ? data[0].voting : 0,
      id,
    };
  } else {
    return {
      voting: 0,
      id,
    };
  }
};
