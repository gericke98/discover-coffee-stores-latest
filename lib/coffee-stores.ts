import { MapBoxType } from "@/types";
import { createApi } from "unsplash-js";

// Creo el server de unsplash
export const unsplash = createApi({
  accessKey: `${process.env.UNSPLASH_ACCESS_KEY}`,
});

export const coffeePhotos = async () => {
  try {
    const photo = await unsplash.search.getPhotos({
      query: "coffee",
      page: 1,
      perPage: 10,
      orientation: "portrait",
    });
    const finalphoto = photo.response?.results;
    if (finalphoto) {
      const urls = finalphoto.map((photo) => photo.urls.regular);
      return urls;
    } else {
      return []; // Return an empty array if no photos were found
    }
  } catch (error) {
    console.error(error);
    return []; // Handle errors and return an empty array
  }
};
async function getPhotos() {
  try {
    const photos = await coffeePhotos();
    return photos;
  } catch (error) {
    console.error(error);
  }
}
const photos = await getPhotos();

const transformCoffeeData = (result: MapBoxType, idx: number) => {
  return {
    id: result.id,
    address: result.properties.address || "Pozuelo", // Por si acaso no hay valores de address
    name: result.text,
    imgUrl: photos?.[idx],
  };
};
export const fetchCoffeeStores = async (longLat: string, limit: number = 6) => {
  try {
    // Metemos el p
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/coffee.json?limit=${limit}&proximity=${longLat}&access_token=${process.env.MAPBOX_API}`
    );
    const data = await response.json();
    return (
      data?.features?.map((result: MapBoxType, idx: number) =>
        transformCoffeeData(result, idx)
      ) || []
    );
  } catch (e) {
    console.error("Error while fetching coffee stores", e);
    return [];
  }
};

export const fetchCoffeeStore = async (id: string) => {
  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${id}.json?proximity=ip&access_token=${process.env.MAPBOX_API}`
    );
    const data = await response.json();
    const coffeeStore = data.features.map((result: MapBoxType, idx: number) =>
      transformCoffeeData(result, idx)
    );
    return coffeeStore.length > 0 ? coffeeStore[0] : {};
  } catch (e) {
    console.error("Error while fetching coffee store", e);
    return {};
  }
};

export const fetchCoffeeImages = async (id: string) => {
  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${id}.json?proximity=ip&access_token=${process.env.MAPBOX_API}`
    );
    const data = await response.json();
    const coffeeStore =
      data?.features?.map((result: MapBoxType, idx: number) =>
        transformCoffeeData(result, idx)
      ) || [];
    return coffeeStore.length > 0 ? coffeeStore[0] : {};
  } catch (e) {
    console.error("Error while fetching coffee store", e);
  }
};
