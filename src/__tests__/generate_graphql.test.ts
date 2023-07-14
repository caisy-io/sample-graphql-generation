import {
  generatePluralQuery,
  generateSingleQuery,
  toAPICasing,
} from "../generate_graphql";
import { contentTypeInfo } from "../fixtures";

test("test toAPICasing", () => {
  expect(toAPICasing("BlogPost")).toEqual("BlogPost");
  expect(toAPICasing("APIKey")).toEqual("ApiKey");
  expect(toAPICasing("post")).toEqual("Post");
});

test("Author single query", () => {
  const recivedQuery = generateSingleQuery(
    contentTypeInfo,
    "3daf8d3e-8b78-4c32-bf26-09bb99c9775d"
  );
  const expectedQuery = `query Author($id:ID!){Author(id:$id){_meta{createdAt updatedAt}name id}}`;

  expect(recivedQuery).toEqual(expectedQuery);
});

test("Author plural query", () => {
  const recivedQuery = generatePluralQuery(
    contentTypeInfo,
    "3daf8d3e-8b78-4c32-bf26-09bb99c9775d"
  );
  const expectedQuery = `{allAuthor{edges{node{_meta{createdAt updatedAt}name id}}}}`;

  expect(recivedQuery).toEqual(expectedQuery);
});

test("Author plural query with sorting", () => {
  const recivedQuery = generatePluralQuery(
    contentTypeInfo,
    "3daf8d3e-8b78-4c32-bf26-09bb99c9775d",
    [{ attribute: "name", direction: "asc" }]
  );
  const expectedQuery = `{allAuthor(sort:{name:ASC}){edges{node{_meta{createdAt updatedAt}name id}}}}`;

  expect(recivedQuery).toEqual(expectedQuery);
});

test("BlogPost single query", () => {
  const recivedQuery = generateSingleQuery(
    contentTypeInfo,
    "9abcdb76-95ce-4182-8770-974b7e3e614d"
  );
  const expectedQuery = `query BlogPost($id:ID!){BlogPost(id:$id){_meta{createdAt updatedAt}title content{json}readingCount authors{__typename...on Author{_meta{createdAt updatedAt}name id}...on BlogPost{_meta{createdAt updatedAt}title content{json}readingCount themeColor isVisible genre pulbished location{formattedAddress latitude longitude zoom}tags id}}author{_meta{createdAt updatedAt}name id}themeColor isVisible genre pulbished location{formattedAddress latitude longitude zoom}tags cover{_meta{createdAt updatedAt}author blurHash copyright description dominantColor height id keywords originType originalName src title width}assets{...on Asset{_meta{createdAt updatedAt}author blurHash copyright description dominantColor height id keywords originType originalName src title width}}id}}`;
  expect(recivedQuery).toEqual(expectedQuery);
});

test("BlogPost plural query", () => {
  const recivedQuery = generatePluralQuery(
    contentTypeInfo,
    "9abcdb76-95ce-4182-8770-974b7e3e614d"
  );
  const expectedQuery = `{allBlogPost{edges{node{_meta{createdAt updatedAt}title content{json}readingCount authors{__typename...on Author{_meta{createdAt updatedAt}name id}...on BlogPost{_meta{createdAt updatedAt}title content{json}readingCount themeColor isVisible genre pulbished location{formattedAddress latitude longitude zoom}tags id}}author{_meta{createdAt updatedAt}name id}themeColor isVisible genre pulbished location{formattedAddress latitude longitude zoom}tags cover{_meta{createdAt updatedAt}author blurHash copyright description dominantColor height id keywords originType originalName src title width}assets{...on Asset{_meta{createdAt updatedAt}author blurHash copyright description dominantColor height id keywords originType originalName src title width}}id}}}}`;
  expect(recivedQuery).toEqual(expectedQuery);
});

test("BlogPost plural query with sorting", () => {
  const recivedQuery = generatePluralQuery(
    contentTypeInfo,
    "9abcdb76-95ce-4182-8770-974b7e3e614d",
    [
      { attribute: "title", direction: "asc" },
      { attribute: "readingCount", direction: "desc" },
    ]
  );
  const expectedQuery = `{allBlogPost(sort:[{title:ASC},{readingCount:DESC}]){edges{node{_meta{createdAt updatedAt}title content{json}readingCount authors{__typename...on Author{_meta{createdAt updatedAt}name id}...on BlogPost{_meta{createdAt updatedAt}title content{json}readingCount themeColor isVisible genre pulbished location{formattedAddress latitude longitude zoom}tags id}}author{_meta{createdAt updatedAt}name id}themeColor isVisible genre pulbished location{formattedAddress latitude longitude zoom}tags cover{_meta{createdAt updatedAt}author blurHash copyright description dominantColor height id keywords originType originalName src title width}assets{...on Asset{_meta{createdAt updatedAt}author blurHash copyright description dominantColor height id keywords originType originalName src title width}}id}}}}`;
  expect(recivedQuery).toEqual(expectedQuery);
});

test("BlogPost plural query with single sorting filter and limit pagination", () => {
  const recivedQuery = generatePluralQuery(
    contentTypeInfo,
    "9abcdb76-95ce-4182-8770-974b7e3e614d",
    [
      { attribute: "title", direction: "asc" },
      { attribute: "readingCount", direction: "desc" },
    ],
    [{attributeName: "title", value: "test", operation: "equals"}],
    {limit: 10, skip: 5}
  );
  const expectedQuery = `{allBlogPost(sort:[{title:ASC},{readingCount:DESC}],where:{title:{eq:"test"}},first:15){edges{node{_meta{createdAt updatedAt}title content{json}readingCount authors{__typename...on Author{_meta{createdAt updatedAt}name id}...on BlogPost{_meta{createdAt updatedAt}title content{json}readingCount themeColor isVisible genre pulbished location{formattedAddress latitude longitude zoom}tags id}}author{_meta{createdAt updatedAt}name id}themeColor isVisible genre pulbished location{formattedAddress latitude longitude zoom}tags cover{_meta{createdAt updatedAt}author blurHash copyright description dominantColor height id keywords originType originalName src title width}assets{...on Asset{_meta{createdAt updatedAt}author blurHash copyright description dominantColor height id keywords originType originalName src title width}}id}}}}`;
  expect(recivedQuery).toEqual(expectedQuery);
});

test("BlogPost plural query with multi sorting filter and limit pagination", () => {
  const recivedQuery = generatePluralQuery(
    contentTypeInfo,
    "9abcdb76-95ce-4182-8770-974b7e3e614d",
    [
      { attribute: "title", direction: "asc" },
      { attribute: "readingCount", direction: "desc" },
    ],
    [{attributeName: "themeColor", value: "#b73030", operation: "equals"}, {attributeName: "title", value: "test", operation: "equals"}],
    {limit: 10, skip: 5}
  );
  const expectedQuery = `{allBlogPost(sort:[{title:ASC},{readingCount:DESC}],where:[{themeColor:{eq:"#b73030"}},{title:{eq:"test"}}],first:15){edges{node{_meta{createdAt updatedAt}title content{json}readingCount authors{__typename...on Author{_meta{createdAt updatedAt}name id}...on BlogPost{_meta{createdAt updatedAt}title content{json}readingCount themeColor isVisible genre pulbished location{formattedAddress latitude longitude zoom}tags id}}author{_meta{createdAt updatedAt}name id}themeColor isVisible genre pulbished location{formattedAddress latitude longitude zoom}tags cover{_meta{createdAt updatedAt}author blurHash copyright description dominantColor height id keywords originType originalName src title width}assets{...on Asset{_meta{createdAt updatedAt}author blurHash copyright description dominantColor height id keywords originType originalName src title width}}id}}}}`;
  expect(recivedQuery).toEqual(expectedQuery);
});
