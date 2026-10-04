import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "SIST ACM SIGAI REST API",
      version: "1.0.0",
      description:
        "Official REST API documentation for SIST ACM SIGAI Student Chapter portal, event management, attendance scanner, and timeline CMS.",
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
    tags: [
      { name: "Attendance & Scanner", description: "Gate check-in, real-time ticket validation & offline batch sync" },
      { name: "Events", description: "Public events list, details & participant registrations" },
      { name: "Timeline CMS", description: "Our Roots interactive milestones and history management" },
      { name: "Auth & Admin", description: "Admin authentication, session validation & logout" },
      { name: "Members", description: "Chapter leadership team, faculty & member management" },
      { name: "Dashboard & Settings", description: "Administrative analytics and chapter settings" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your admin JWT token obtained from /api/auth/login",
        },
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "token",
          description: "JWT Token stored in HTTP-Only Cookie",
        },
      },
    },
    paths: {
      "/events/getallmem": {
        get: {
          tags: ["Events"],
          summary: "Get all active public events",
          description: "Fetches list of upcoming and active events with registration details.",
          responses: {
            200: {
              description: "List of events retrieved successfully",
            },
          },
        },
      },
      "/events/{eventId}": {
        get: {
          tags: ["Events"],
          summary: "Get specific event details",
          parameters: [
            { name: "eventId", in: "path", required: true, schema: { type: "string" } },
          ],
          responses: {
            200: { description: "Event details" },
            404: { description: "Event not found" },
          },
        },
      },
      "/events/register": {
        post: {
          tags: ["Events"],
          summary: "Register for an event",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["eventId", "answers"],
                  properties: {
                    eventId: { type: "string", example: "6abe22d08b1c764e4d014544" },
                    answers: {
                      type: "object",
                      example: {
                        "Full Name": "Rahul Sharma",
                        "Register Number": "41110023",
                        "Email ID": "rahul@example.com",
                        "Phone Number": "9876543210",
                        "Department": "CSE",
                      },
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Registration successful and ticket pass issued" },
            400: { description: "Validation error or registration closed" },
          },
        },
      },
      "/events/{eventId}/attendance/scan": {
        post: {
          tags: ["Attendance & Scanner"],
          summary: "Scan & verify QR code attendance ticket",
          description: "Verifies student ticket against MongoDB, marks attendance as present, and rejects duplicates.",
          parameters: [
            { name: "eventId", in: "path", required: true, schema: { type: "string" } },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["qrData"],
                  properties: {
                    qrData: { type: "string", example: "TICKET-ACM-6abe22d08b1c764e4d014544-41110023" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Attendance marked successfully or already checked in" },
            400: { description: "Invalid ticket or wrong event" },
          },
        },
      },
      "/events/{eventId}/attendance/batch-scan": {
        post: {
          tags: ["Attendance & Scanner"],
          summary: "Bulk offline attendance batch sync",
          description: "Syncs multiple scans accumulated on mobile/Flutter offline queue in a single atomic bulk operation.",
          parameters: [
            { name: "eventId", in: "path", required: true, schema: { type: "string" } },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["scans"],
                  properties: {
                    scans: {
                      type: "array",
                      items: {
                        type: "object",
                        required: ["qrData"],
                        properties: {
                          qrData: { type: "string", example: "TICKET-ACM-101" },
                          scannedAt: { type: "string", example: "2026-10-01T10:30:00Z" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Batch sync report with total, success, and duplicate counts" },
          },
        },
      },
      "/events/{eventId}/registrations": {
        get: {
          tags: ["Attendance & Scanner"],
          summary: "Get full attendee manifest roster for an event",
          parameters: [
            { name: "eventId", in: "path", required: true, schema: { type: "string" } },
            { name: "status", in: "query", schema: { type: "string", enum: ["all", "present", "absent"] } },
            { name: "search", in: "query", schema: { type: "string" } },
          ],
          responses: {
            200: { description: "List of registered attendees and attendance metrics" },
          },
        },
      },
      "/timeline": {
        get: {
          tags: ["Timeline CMS"],
          summary: "Get all historical timeline milestones",
          responses: {
            200: { description: "List of milestones grouped by year" },
          },
        },
        post: {
          tags: ["Timeline CMS"],
          summary: "Create a new timeline milestone",
          security: [{ bearerAuth: [] }, { cookieAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["year", "title", "description"],
                  properties: {
                    year: { type: "number", example: 2026 },
                    title: { type: "string", example: "National AI Symposium" },
                    description: { type: "string", example: "Over 500+ attendees joined the flagship AI event." },
                    tag: { type: "string", example: "Flagship" },
                    featured: { type: "boolean", example: true },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: "Milestone created" },
            401: { description: "Unauthorized" },
          },
        },
      },
      "/timeline/{id}": {
        put: {
          tags: ["Timeline CMS"],
          summary: "Update an existing milestone",
          security: [{ bearerAuth: [] }, { cookieAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" } },
          ],
          responses: {
            200: { description: "Milestone updated" },
          },
        },
        delete: {
          tags: ["Timeline CMS"],
          summary: "Delete a milestone",
          security: [{ bearerAuth: [] }, { cookieAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" } },
          ],
          responses: {
            200: { description: "Milestone deleted" },
          },
        },
      },
      "/auth/login": {
        post: {
          tags: ["Auth & Admin"],
          summary: "Admin login",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "password"],
                  properties: {
                    email: { type: "string", example: "admin@acmsigai.org" },
                    password: { type: "string", example: "admin123" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Login successful with JWT token and cookie" },
            401: { description: "Invalid credentials" },
          },
        },
      },
      "/auth/verify": {
        get: {
          tags: ["Auth & Admin"],
          summary: "Verify active admin session",
          security: [{ bearerAuth: [] }, { cookieAuth: [] }],
          responses: {
            200: { description: "Session valid" },
            401: { description: "Session expired or invalid" },
          },
        },
      },
      "/auth/logout": {
        post: {
          tags: ["Auth & Admin"],
          summary: "Logout and clear session",
          responses: {
            200: { description: "Logged out successfully" },
          },
        },
      },
      "/members": {
        get: {
          tags: ["Members"],
          summary: "Get active chapter team members",
          responses: {
            200: { description: "List of team members" },
          },
        },
      },
      "/dashboard/stats": {
        get: {
          tags: ["Dashboard & Settings"],
          summary: "Get administrative metrics",
          security: [{ bearerAuth: [] }, { cookieAuth: [] }],
          responses: {
            200: { description: "Analytics and counts" },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
