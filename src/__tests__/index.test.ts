import { getEntriesByContentType, getEntryById } from "..";
import { contentTypeInfo } from "../fixtures";

const CHANGE_ME_DOCUMENT_ID_OF_AUTHOR = "973969a6-d057-4445-ad5d-006d55ede3bc";

test("run Author getEntryById", async () => {
  const r = await getEntryById(
    process.env.CAISY_PROJECT_ID!,
    process.env.CAISY_ACCESS_TOKEN!,
    contentTypeInfo,
    "3daf8d3e-8b78-4c32-bf26-09bb99c9775d",
    CHANGE_ME_DOCUMENT_ID_OF_AUTHOR
  );
  // this will depend on the data in the project
  expect(true).toEqual(!!r.Author.name);
});

test("run BlogPost getEntriesByContentType with multi sorting filter and limit pagination", async () => {
  const r = await getEntriesByContentType(
    process.env.CAISY_PROJECT_ID!,
    process.env.CAISY_ACCESS_TOKEN!,
    contentTypeInfo,
    "9abcdb76-95ce-4182-8770-974b7e3e614d",
    [
      { attribute: "title", direction: "asc" },
      { attribute: "readingCount", direction: "desc" },
    ],
    [
      { attributeName: "themeColor", value: "#b73030", operation: "equals" },
      { attributeName: "title", value: "test", operation: "equals" },
    ],
    { limit: 10 }
  );
  // this will depend on the data in the project
  expect(true).toEqual(!!r[0]._meta);
});
