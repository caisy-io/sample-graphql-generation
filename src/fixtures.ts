import { IAllContentTypes } from "./types";

export const contentTypeInfo: IAllContentTypes = {
  "3daf8d3e-8b78-4c32-bf26-09bb99c9775d": {
    name: "Author",
    uid: "3daf8d3e-8b78-4c32-bf26-09bb99c9775d",
    attributes: {
      name: {
        id: "a1f65a6f-a1a0-44ae-8d73-f262c734fa8d",
        type: "string",
      },
      createdAt: {
        type: "datetime",
      },
      updatedAt: {
        type: "datetime",
      },
      id: {
        type: "string",
      },
    },
  },
  "9abcdb76-95ce-4182-8770-974b7e3e614d": {
    name: "BlogPost",
    uid: "9abcdb76-95ce-4182-8770-974b7e3e614d",
    attributes: {
      title: {
        id: "51e7088b-fe8c-4796-ad9d-4e129f2968f7",
        type: "string",
      },
      content: {
        id: "e3b44807-0cc6-4347-8a19-4b0c87be6269",
        type: "richtext",
      },
      readingCount: {
        id: "3a073718-4723-4bdf-98b1-7609301bae5b",
        type: "number",
      },
      authors: {
        id: "9f282860-c18f-4473-a30d-473acf93a868",
        type: "relation",
        relationType: "multiple",
        multipleRelationContentTypeIds: [
          "3daf8d3e-8b78-4c32-bf26-09bb99c9775d",
          "9abcdb76-95ce-4182-8770-974b7e3e614d",
        ],
      },
      author: {
        id: "6d7e8b36-3850-464e-9632-3c67b13aa181",
        type: "relation",
        relationType: "simple",
        relationContentTypeId: "3daf8d3e-8b78-4c32-bf26-09bb99c9775d",
      },
      themeColor: {
        id: "b1cfffc8-ccdc-4efd-a667-a2ddadd35173",
        type: "string",
      },
      isVisible: {
        id: "739ad5d6-eff2-4f40-96f7-7630f0decfb8",
        type: "boolean",
      },
      genre: {
        id: "677bc7bf-1540-4e32-bc80-48efb755f097",
        type: "string",
      },
      pulbished: {
        id: "69f33b90-c80e-4e4f-8be1-085760025ccf",
        type: "datetime",
      },
      location: {
        id: "a795d432-d9a8-42d5-a3b9-cab5fceeea61",
        type: "location",
      },
      tags: {
        id: "f6db5e9e-52f8-417e-8302-c1052dd35b01",
        type: "string",
      },
      cover: {
        id: "68987e12-a21a-4bf0-99bb-8f58f6d24153",
        type: "media",
        multiple: false,
      },
      assets: {
        id: "df84ff29-8eab-4c13-83fc-0beef189e9ce",
        type: "media",
        multiple: true,
      },
      createdAt: {
        type: "datetime",
      },
      updatedAt: {
        type: "datetime",
      },
      id: {
        type: "string",
      },
    },
  },
};