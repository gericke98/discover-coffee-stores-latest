import { AirTableRecordType, CoffeeStoreType } from "@/types";

var Airtable = require("airtable");
var base = new Airtable({ apiKey: process.env.AIR_TABLE_TOKEN }).base(
  "appktcWEHV6EfaHMN"
);

const table = base("coffee-stores");

const getMinifiedRecords = (records: Array<AirTableRecordType>) => {
  return records.map((record: AirTableRecordType) => {
    return {
      recordId: record.id,
      ...record.fields,
    };
  });
};

// Find the record
export const findRecordByFilter = async (id: string) => {
  const findRecords = await table
    .select({
      filterByFormula: `id="${id}"`,
    })
    .firstPage();
  return getMinifiedRecords(findRecords);
};
// Create the record if not found
export const createCoffeeStore = async (
  coffeeStore: CoffeeStoreType,
  id: string
) => {
  const { name, address, voting = 0, imgUrl } = coffeeStore;
  try {
    if (id) {
      const records = await findRecordByFilter(id);
      if (records.length === 0) {
        const createRecords = await table.create([
          {
            fields: {
              id,
              name,
              address,
              voting,
              imgUrl,
            },
          },
        ]);
        return getMinifiedRecords(createRecords);
      } else {
        return records;
      }
    } else {
      console.error("Store id missing");
    }
  } catch (e) {
    console.error("Error while creating coffee store");
  }
};

export const updateCoffeeStore = async (id: string) => {
  try {
    if (id) {
      const records = await findRecordByFilter(id);

      if (records.length !== 0) {
        const record = records[0];
        const updatedVoting = record.voting + 1;
        const updateRecords = await table.update([
          {
            id: record.recordId,
            fields: {
              voting: updatedVoting,
            },
          },
        ]);
        return getMinifiedRecords(updateRecords);
      } else {
        console.log("Coffee store does not exist");
      }
    } else {
      console.error("Store id missing");
    }
  } catch (e) {
    console.error("Error while updating coffee store");
  }
};
