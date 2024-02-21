export type CoffeeStoreType = {
  id: string;
  name: string;
  imgUrl: string;
  address: string;
  voting: number;
};

export type MapBoxType = {
  id: string;
  properties: {
    address: string;
  };
  text: string;
};

export type AirTableRecordType = {
  id: string;
  recordId: string;
  fields: CoffeeStoreType;
};

export type ServerParamsType = {
  params: { id: string };
  searchParams: { id: string };
};
