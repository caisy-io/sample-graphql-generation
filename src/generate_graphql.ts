import { IAllContentTypes, ISorting, IFieldFilter, IPagination, IContentType } from "./types";

// this is some modified camel casing function without dependencies, its how we generate the graphql api names in the backend
export function toAPICasing(str: string): string {
  return str
    .split("")
    .map((char, idx, arr) => {
      if (idx === 0 || arr[idx - 1] === " " || arr[idx - 1] === undefined) {
        return char.toUpperCase();
      }
      if (
        char.toUpperCase() === char &&
        arr[idx + 1] &&
        arr[idx + 1].toUpperCase() !== arr[idx + 1]
      ) {
        return char.toUpperCase();
      }
      if (
        char.toUpperCase() === char &&
        arr[idx - 1] &&
        arr[idx - 1].toUpperCase() === arr[idx - 1]
      ) {
        return char.toLowerCase();
      }
      return char;
    })
    .join("");
}

const META_FIELDS = ["createdAt", "updatedAt"];
const ASSET_SYSTEM_FIELDS = [
  "author",
  "blurHash",
  "copyright",
  "description",
  "dominantColor",
  "height",
  "id",
  "keywords",
  "originType",
  "originalName",
  "src",
  "title",
  "width",
];

export const generateContentTypeQueryFields = (
  allConentTypes: IAllContentTypes,
  contentTypeId: string,
  nesting = 0,
  nestingLimit = 1
): string => {
  const attributeKeys = Object.keys(allConentTypes[contentTypeId].attributes);
  const metaSubQuery = `_meta{${META_FIELDS.join(" ")}}`;
  let fielsQueryPart = "";

  attributeKeys
    .map((key: string): string => {
      const attribute = allConentTypes[contentTypeId].attributes[key];

      if (META_FIELDS.includes(key)) return "";

      if (attribute.type === "richtext") {
        return `${key}{json}`;
      }
      if (attribute.type === "location") {
        return `${key}{formattedAddress latitude longitude zoom}`;
      }
      if (attribute.type === "relation" || attribute.type === "media") {
        if (nesting >= nestingLimit) {
          return "";
        }
        if (attribute.type === "media") {
          if (attribute.multiple) {
            return `${key}{...on Asset{_meta{${META_FIELDS.join(
              " "
            )}}${ASSET_SYSTEM_FIELDS.join(" ")}}}`;
          }
          return `${key}{_meta{${META_FIELDS.join(
            " "
          )}}${ASSET_SYSTEM_FIELDS.join(" ")}}`;
        }
      }

      if (
        attribute.relationType === "simple" &&
        attribute.relationContentTypeId
      ) {
        return `${key}{${generateContentTypeQueryFields(
          allConentTypes,
          attribute.relationContentTypeId,
          nesting + 1,
          nestingLimit
        )}}`;
      }

      if (
        attribute.relationType == "multiple" &&
        attribute.multipleRelationContentTypeIds
      ) {
        return `${key}{__typename${attribute.multipleRelationContentTypeIds
          .map((relationContentTypeId: string) => {
            const contentTypeApiName = toAPICasing(
              allConentTypes[relationContentTypeId].name
            );

            return `...on ${contentTypeApiName}{${generateContentTypeQueryFields(
              allConentTypes,
              relationContentTypeId,
              nesting + 1,
              nestingLimit
            )}}`;
          })
          .join("")}}`;
      }

      return key;
    })
    .forEach((key: string, i: number) => {
      if (key === "") return;

      if (key[key.length - 1] === "}" || i === attributeKeys.length - 1) {
        fielsQueryPart += key + "";
        return;
      }

      fielsQueryPart += key + " ";
    });

  return metaSubQuery + fielsQueryPart;
};

export const generateSortingInput = (
  sortings: ISorting[]
): undefined | string => {
  if (sortings.length === 0) return undefined;

  if (sortings.length === 1) {
    const sorting = sortings[0];
    return `sort:{${sorting.attribute}:${sorting.direction.toUpperCase()}}`;
  }

  return `sort:[${sortings
    .map(
      (sorting) => `{${sorting.attribute}:${sorting.direction.toUpperCase()}}`
    )
    .join(",")}]`;
};

const generateWhereClause = (filters: IFieldFilter, fieldType: string): string => {
  // if other operators then equal are needed, add them here
  return `${filters.attributeName}:{eq:${ ["string", "color"].includes(fieldType) ? `"${filters.value}"` : filters.value}}`;
};

export const generateFilterInput = (
  fieldFilter: IFieldFilter[],
  contentType: IContentType
): undefined | string => {
  if (fieldFilter.length === 0) return undefined;

  if (fieldFilter.length === 1) {
    const filter = fieldFilter[0];
    const fieldType = contentType.attributes[filter.attributeName].type;
    return `where:{${generateWhereClause(filter, fieldType)}}`;
  }

  return `where:[${fieldFilter
    .map((filter) => {
      const fieldType = contentType.attributes[filter.attributeName].type;
      return `{${generateWhereClause(filter, fieldType)}}`
    })
    .join(",")}]`;
};

export const generatePaginationInput = (
  pagination: IPagination
): undefined | string => {
  if (!pagination || (pagination.limit || 0) + (pagination.skip || 0) > 30) {
    return undefined;
  }

  return `first:${(pagination.limit || 0) + (pagination.skip || 0)}`;
};

export const generatePluralQuery = (
  allConentTypes: IAllContentTypes,
  contentTypeId: string,
  sortings?: ISorting[],
  filters?: IFieldFilter[],
  pagination?: IPagination
) => {
  const rootApiName = toAPICasing(allConentTypes[contentTypeId].name);
  const rootApiNamePlural = "all" + rootApiName;

  const sortingInputPart = sortings && generateSortingInput(sortings);
  const filterInputPart = filters && generateFilterInput(filters, allConentTypes[contentTypeId]);
  const paginationInputPart = pagination && generatePaginationInput(pagination);

  const hasInput = sortingInputPart || filterInputPart || paginationInputPart;

  return `{${rootApiNamePlural}${
    hasInput
      ? `(${[sortingInputPart, filterInputPart, paginationInputPart]
          .filter((i) => !!i)
          .join(",")})`
      : ""
  }{edges{node{${generateContentTypeQueryFields(
    allConentTypes,
    contentTypeId,
    0,
    1
  )}}}}}`;
};

export const generateSingleQuery = (
  allConentTypes: IAllContentTypes,
  contentTypeId: string
) => {
  const rootApiName = toAPICasing(allConentTypes[contentTypeId].name);

  return `query ${rootApiName}($id:ID!){${rootApiName}(id:$id){${generateContentTypeQueryFields(
    allConentTypes,
    contentTypeId,
    0,
    1
  )}}}`;
};
