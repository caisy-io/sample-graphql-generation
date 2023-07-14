import { generateSingleQuery, generatePluralQuery } from "./generate_graphql";
import { IAllContentTypes, IFieldFilter, IPagination, ISorting } from "./types";

export const getEntriesByContentType = async (
  projectId: string,
  token: string,
  allConentTypes: IAllContentTypes,
  contentTypeId: string,
  sortings?: ISorting[],
  filters?: IFieldFilter[],
  pagination?: IPagination
) => {
  const url = `https://cloud.caisy.io/api/v3/e/${projectId}/graphql`;

  const query = generatePluralQuery(
    allConentTypes,
    contentTypeId,
    sortings,
    filters,
    pagination
  );

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-caisy-token": token,
    },
    body: JSON.stringify({
      query,
    }),
  });

  if (response.status == 401 || response.status == 403) {
    throw new Error(
      `getEntriesByContentType from caisy auth or permission issue: ${response.statusText}`
    );
  }
  if (response.status != 200) {
    throw new Error(
      `getEntriesByContentType from caisy - internal error fetching entries from caisy: ${response.statusText}`
    );
  }

  const json = await response.json();

  if (json.errors) {
    throw new Error(
      `getEntriesByContentType from caisy - internal error fetching entries from caisy: ${JSON.stringify(
        json.errors
      )}`
    );
  }

  // get only the nodes from the response
  // apply the fake pagination
  const nodes = json.data[Object.keys(json.data)[0]].edges.map((e: any) => e.node);
  if (pagination){
    if ((pagination.skip || 0) > nodes.length) {
        return [];
    }

    const start = pagination.skip || 0;
    const end = pagination.limit ? start + pagination.limit : nodes.length;
    return nodes.slice(start, end < nodes.length ? end : undefined);
  }

  return nodes;
};

export const getEntryById = async (
  projectId: string,
  token: string,
  allConentTypes: IAllContentTypes,
  contentTypeId: string,
  entryId: string
) => {
  const url = `https://cloud.caisy.io/api/v3/e/${projectId}/graphql`;

  const query = generateSingleQuery(allConentTypes, contentTypeId);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-caisy-token": token,
    },
    body: JSON.stringify({
      query,
      variables: {
        id: entryId,
      },
    }),
  });

  if (response.status == 401 || response.status == 403) {
    throw new Error(
      `getEntriesByContentType from caisy auth or permission issue: ${response.statusText}`
    );
  }
  if (response.status != 200) {
    throw new Error(
      `getEntriesByContentType from caisy - internal error fetching entries from caisy: ${response.statusText}`
    );
  }

  const json = await response.json();

  if (json.errors) {
    throw new Error(
      `getEntriesByContentType from caisy - internal error fetching entries from caisy: ${JSON.stringify(
        json.errors
      )}`
    );
  }

  return json.data;
};
