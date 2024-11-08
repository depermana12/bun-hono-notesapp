export const openApiConfig = {
  openapi: "3.0.0",
  info: {
    title: "Notes API",
    version: "1.0.0",
    description:
      "A simple API to manage personal notes, allowing users to create, read, update, and delete notes.",
  },
  servers: [
    {
      url: "http://localhost:3000/",
      description: "API v1",
    },
  ],
  tags: [
    {
      name: "note",
      description:
        "Operations related to notes, such as creating, reading, updating, and deleting notes.",
    },
    {
      name: "user",
      description:
        "Operations related to user authentication, such as registering, logging in, and logging out.",
    },
  ],
};
