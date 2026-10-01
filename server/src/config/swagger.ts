import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "SIST ACM SIGAI REST API",
      version: "1.0.0",
      description: "Official REST API documentation for SIST ACM SIGAI Student Chapter portal, event management, attendance scanner, and timeline CMS.",
      contact: {
        name: "SIST ACM SIGAI Tech Team",
        email: "sist.sigai@gmail.com",
      },
    },
    servers: [
      {
        url: "/api",
        description: "API Base URL",
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "token",
          description: "JWT Token stored in HTTP-Only Cookie",
        },
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
