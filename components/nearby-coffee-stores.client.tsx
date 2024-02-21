"use client";
import useTrackLocation from "@/hooks/use-track-location";
import React, { useEffect, useState } from "react";
import Banner from "./banner.client";
import Card from "./card.server";
import { CoffeeStoreType } from "@/types";

export default function NearbyCoffeeStores() {
  const { handleTrackLocation, isFindingLocation, longLat, locationErrorMsg } =
    useTrackLocation();
  const [coffeeStores, setCoffeeStores] = useState([]);

  const handleOnClick = () => {
    handleTrackLocation();
  };

  useEffect(() => {
    async function coffeeStoresByLocation() {
      if (longLat) {
        try {
          const response = await fetch(
            `/api/getCoffeeStoresByLocation?longLat=${longLat}&limit=10`
          );
          const coffeeStoresResponse = await response.json();
          setCoffeeStores(coffeeStoresResponse);
        } catch (e) {
          console.error("Error", e);
        }
      }
    }
    coffeeStoresByLocation();
  }, [longLat]); //useTracklOCATION
  return (
    <div>
      <Banner
        handleOnClick={handleOnClick}
        buttonName={isFindingLocation ? "Locating..." : "View stores nearby"}
      />
      {locationErrorMsg && <p>Error: {locationErrorMsg}</p>}
      {coffeeStores.length > 0 && (
        <div className="mt-20">
          <h2 className="mt-8 pb-8 text-4xl font-bold text-white">
            Nearby Stores
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-2 lg:grid-cols-3 lg:gap-6">
            {coffeeStores.map((coffeeStore: CoffeeStoreType) => (
              <Card
                key={`${coffeeStore.name}-${coffeeStore.id}`}
                name={coffeeStore.name}
                imgUrl={coffeeStore.imgUrl}
                href={`/coffee-store/${coffeeStore.id}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
