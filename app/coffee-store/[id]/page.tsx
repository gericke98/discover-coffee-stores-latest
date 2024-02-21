import React from "react";
import Link from "next/link";
import { fetchCoffeeStore, fetchCoffeeStores } from "@/lib/coffee-stores";
import Image from "next/image";
import { CoffeeStoreType, ServerParamsType } from "@/types";
import { createCoffeeStore, findRecordByFilter } from "@/lib/airtable";
import Upvote from "@/components/upvote.client";
import { getDomain } from "@/utils";

async function getData(id: string) {
  //Mapbox API
  const coffeeStoreFromMapbox = await fetchCoffeeStore(id);
  const coffeeStoreFromAirtable = await createCoffeeStore(
    coffeeStoreFromMapbox,
    id
  );
  const voting = coffeeStoreFromAirtable
    ? coffeeStoreFromAirtable[0].voting
    : 0;
  return coffeeStoreFromMapbox ? { ...coffeeStoreFromMapbox, voting } : {};
}

export async function generateStaticParams() {
  const TORONTOLONGLAT = "-3.8169841%2C-40.4291889";
  const coffeeStores = await fetchCoffeeStores(TORONTOLONGLAT);
  return coffeeStores.map((coffeeStore: CoffeeStoreType) => ({
    id: coffeeStore.id,
  }));
}

export async function generateMetadata({
  params,
  searchParams,
}: ServerParamsType) {
  const coffeeStore = await fetchCoffeeStore(params.id);
  const { name = "" } = coffeeStore;
  return {
    title: name,
    description: `${name} - Coffee store`,
    metadataBase: getDomain(),
    alternates: {
      canonical: `/coffee-store/${params.id}`,
    },
  };
}

export default async function Page(props: { params: { id: string } }) {
  const {
    params: { id },
  } = props;
  const coffeeStore = await getData(id);
  const { name = "", address = "", imgUrl = "", voting = 0 } = coffeeStore;
  return (
    <div className="h-full pb-80">
      <div className="m-auto grid max-w-full px-12 py-12 lg:max-w-6xl lg:grid-cols-2 lg:gap-4">
        <div className="">
          <div className="mb-2 mt-24 text-lg font-bold">
            <Link href="/">← Back to home</Link>
          </div>
          <div className="my-4">
            <h1 className="text-4xl">{name}</h1>
          </div>
          <Image
            src={imgUrl}
            width={740}
            height={360}
            className="max-h-[420px] min-w-full max-w-full rounded-lg border-2 sepia lg:max-w-[470px] "
            alt={"Coffee Store Image"}
          />
        </div>

        <div className={`glass mt-12 flex-col rounded-lg p-4 lg:mt-48`}>
          {address && (
            <div className="mb-4 flex">
              <Image
                src="/static/icons/places.svg"
                width="24"
                height="24"
                alt="Places icon"
              />
              <p className="pl-2">{address}</p>
            </div>
          )}
          <Upvote voting={voting} id={id} />
        </div>
      </div>
    </div>
  );
}
