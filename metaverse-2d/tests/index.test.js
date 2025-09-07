const { default: axios } = require("axios");
const request = require("supertest");

const app = "http://localhost:3000";

describe("Authenication API", () => {
  describe("POST /api/v1/signup", () => {
    it("should create a new user and return userId", async () => {
      const response = await request(app).post("/api/v1/signup").send({
        username: "ritikv91",
        password: "123random",
        type: "admin",
      });
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("userId");
    });

    it("should validate for missing fields", async () => {
      const response = await request(app).post("/api/v1/signup").send({
        // username: "ritikv91",
        // password: "123random",
        // type: 'admin'
        // Nothing
      });
      expect(response.statusCode).toBe(400);

      const userResponse = await request(app).post("/api/v1/signup").send({
        username: "ritikv91",
        // password: "123random",
        // type: 'admin'
        // Missing password and type
      });
      expect(userResponse.statusCode).toBe(400);

      const passwordResponse = await request(app).post("/api/v1/signup").send({
        // username: 'ritikv91',
        password: "123random",
        // type: "admin",
        // Missing username and type
      });
      expect(passwordResponse.statusCode).toBe(400);

      const typeResponse = await request(app).post("/api/v1/signup").send({
        // username: 'ritikv91',
        // password: "123random",
        type: "admin",
        // Missing username and password
      });
      expect(typeResponse.statusCode).toBe(400);
    });
  });

  describe("POST /api/v1/signin", () => {
    it("should return a token for valid credentials", async () => {
      const response = await request(app).post("/api/v1/signin").send({
        username: "ritikv91",
        password: "123random",
      });
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("token");
    });

    it("should return 403 for invalid credentials", async () => {
      const response = await request(app).post("/api/v1/signin").send({
        username: "ritikv91",
        password: "wrongpassword",
      });
      expect(response.statusCode).toBe(403);
    });
  });
});

describe("User Information API", () => {
  let validToken = "";
  let avatarId = "";
  let userId = "";

  beforeAll(async () => {
    // Generate a valid token before running the tests
    const signupResponse = await request(app).post("/api/v1/signup").send({
      username: "ritikv91",
      password: "123random",
      type: "admin",
    });
    userId = signupResponse.body.userId;

    const signinResponse = await request(app).post("/api/v1/signin").send({
      username: "ritikv91",
      password: "123random",
    });
    validToken = signinResponse.body.token;

    const avatarResponse = await request(app)
      .post("/api/v1/admin/avatar")
      .send({
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
        name: "Timmy",
      })
      .set("Authorization", `Bearer ${validToken}`);
    avatarId = avatarResponse.body.avatarId;
  });

  describe("POST /api/v1/user/metadata", () => {
    it("should update user metadata and return 200", async () => {
      const response = await request(app)
        .post("/api/v1/user/metadata")
        .send({
          avatarId,
        })
        .set("Authorization", `Bearer ${validToken}`);
      expect(response.statusCode).toBe(200);
    });

    it("should return 400 for invalid input", async () => {
      const response = await request(app)
        .post("/api/v1/user/metadata")
        .send({
          avatarId: "123",
        })
        .set("Authorization", `Bearer ${validToken}`);
      expect(response.statusCode).toBe(400);
    });

    it("should return 403 if unauthorized", async () => {
      const response = await request(app)
        .post("/api/v1/user/metadata")
        .send({
          avatarId: "123",
        })
        .set("Authorization", "Bearer InvalidToken");
      expect(response.statusCode).toBe(403);
    });
  });

  describe("GET /api/v1/avatars", () => {
    it("should return available avatars", async () => {
      const response = await request(app).get("/api/v1/avatars");
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("avatars");
      expect(response.body.avatars).toBeInstanceOf(Array);
      expect(response.body.avatars[0]).toHaveProperty("id");
      expect(response.body.avatars[0]).toHaveProperty("imageUrl");
      expect(response.body.avatars[0]).toHaveProperty("name");
    });
  });

  describe("GET /api/v1/user/metadata/bulk", () => {
    it("should return metadata for specified user IDs", async () => {
      const response = await request(app).get(
        `/api/v1/user/metadata/bulk?ids=[${userId}]`
      );
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("avatars");
      expect(response.body.avatars.length).toBe(1);
      expect(response.body.avatars).toBeInstanceOf(Array);
      expect(response.body.avatars[0]).toHaveProperty("userId");
      expect(response.body.avatars[0]).toHaveProperty("imageUrl");
    });

    it("should return 400 for invalid user IDs", async () => {
      const response = await request(app).get(
        "/api/v1/user/metadata/bulk?ids=invalid"
      );
      expect(response.statusCode).toBe(400);
    });
  });
});

describe("Space Dashboard API", () => {
  let userId;
  let userToken;
  let adminId;
  let adminToken;
  let element1Id;
  let element2Id;
  let mapId;
  let spaceId;

  beforeAll(async () => {
    const userSignupResponse = await request(app).post("/api/v1/signup").send({
      username: "ritikv91-user",
      password: "123random",
      type: "user",
    });
    userId = userSignupResponse.body.userId;

    const userSigninResponse = await request(app).post("/api/v1/signin").send({
      username: "ritikv91-user",
      password: "123random",
    });
    userToken = userSigninResponse.body.token;

    const signupResponse = await request(app).post("/api/v1/signup").send({
      username: "ritikv91",
      password: "123random",
      type: "admin",
    });
    adminId = signupResponse.body.userId;

    const signinResponse = await request(app).post("/api/v1/signin").send({
      username: "ritikv91",
      password: "123random",
    });
    adminToken = signinResponse.body.token;

    const element1Response = await request(app)
      .post("/api/v1/admin/element")
      .send({
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
        width: 1,
        height: 1,
        static: true,
      })
      .set("Authorization", `Bearer ${adminToken}`);
    element1Id = element1Response.body.id;

    const element2Response = await request(app)
      .post("/api/v1/admin/element")
      .send({
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
        width: 1,
        height: 1,
        static: true,
      })
      .set("Authorization", `Bearer ${adminToken}`);
    element2Id = element2Response.body.id;

    const mapResponse = await request(app)
      .post("/api/v1/admin/map")
      .send({
        thumbnail: "https://thumbnail.com/a.png",
        dimensions: "100x200",
        name: "Interview room",
        defaultElements: [
          {
            elementId: element1Id,
            x: 20,
            y: 20,
          },
          {
            elementId: element2Id,
            x: 18,
            y: 20,
          },
        ],
      })
      .set("Authorisation", `Bearer ${adminToken}`);
    mapId = mapResponse.body.id;
  });

  describe("POST /api/v1/space", () => {
    it("should create a space with mapId and return spaceId", async () => {
      const response = await request(app)
        .post("/api/v1/space")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          name: "Test1",
          dimensions: "100x200",
          mapId,
        });
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("spaceId");
      spaceId = response.body.spaceId;
    });

    it("should create a space without mapId and return spaceId", async () => {
      const response = await request(app)
        .post("/api/v1/space")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          name: "Test2",
          dimensions: "100x200",
        });
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("spaceId");
    });

    it("should return 400 for invalid input", async () => {
      const response = await request(app)
        .post("/api/v1/space")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          name: "Test3",
        });
      expect(response.statusCode).toBe(400);
    });
  });

  describe("DELETE /api/v1/space/:spaceId", () => {
    it("should delete a space and return 200", async () => {
      // Replace with a valid spaceId for actual tests
      const response = await request(app)
        .delete(`/api/v1/space/${spaceId}`)
        .set("Authorization", `Bearer ${userToken}`);
      expect(response.statusCode).toBe(200);
    });

    it("should return 400 for invalid spaceId", async () => {
      const response = await request(app)
        .delete("/api/v1/space/invalidId")
        .set("Authorization", `Bearer ${userToken}`);
      expect(response.statusCode).toBe(400);
    });

    it("should not delete a space that is not created by it and return 403", async () => {
      // Replace with a valid spaceId for actual tests
      const response = await request(app)
        .delete(`/api/v1/space/${spaceId}`)
        .set("Authorization", `Bearer ${adminToken}`);
      expect(response.statusCode).toBe(403);
    });
  });

  describe("GET /api/v1/space/all", () => {
    it("should return all existing spaces", async () => {
      const response = await request(app)
        .get("/api/v1/space/all")
        .set("Authorization", `Bearer ${userToken}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.length).toBe(1);
    });
  });
});

describe("Arena API", () => {
  let userId;
  let userToken;
  let adminId;
  let adminToken;
  let element1Id;
  let element2Id;
  let mapId;
  let spaceId;

  beforeAll(async () => {
    const userSignupResponse = await request(app).post("/api/v1/signup").send({
      username: "ritikv91-user",
      password: "123random",
      type: "user",
    });
    userId = userSignupResponse.body.userId;

    const userSigninResponse = await request(app).post("/api/v1/signin").send({
      username: "ritikv91-user",
      password: "123random",
    });
    userToken = userSigninResponse.body.token;

    const signupResponse = await request(app).post("/api/v1/signup").send({
      username: "ritikv91",
      password: "123random",
      type: "admin",
    });
    adminId = signupResponse.body.userId;

    const signinResponse = await request(app).post("/api/v1/signin").send({
      username: "ritikv91",
      password: "123random",
    });
    adminToken = signinResponse.body.token;

    const element1Response = await request(app)
      .post("/api/v1/admin/element")
      .send({
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
        width: 1,
        height: 1,
        static: true,
      })
      .set("Authorization", `Bearer ${adminToken}`);
    element1Id = element1Response.body.id;

    const element2Response = await request(app)
      .post("/api/v1/admin/element")
      .send({
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
        width: 1,
        height: 1,
        static: true,
      })
      .set("Authorization", `Bearer ${adminToken}`);
    element2Id = element2Response.body.id;

    const mapResponse = await request(app)
      .post("/api/v1/admin/map")
      .send({
        thumbnail: "https://thumbnail.com/a.png",
        dimensions: "100x200",
        name: "Interview room",
        defaultElements: [
          {
            elementId: element1Id,
            x: 20,
            y: 20,
          },
          {
            elementId: element2Id,
            x: 18,
            y: 20,
          },
        ],
      })
      .set("Authorisation", `Bearer ${adminToken}`);
    mapId = mapResponse.body.id;

    const spaceResponse = await request(app)
      .post("/api/v1/space")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        name: "Test1",
        dimensions: "100x200",
        mapId,
      });
    spaceId = spaceResponse.body.spaceId;
  });

  describe("GET /api/v1/space/:spaceId", () => {
    it("should return a space with its elements", async () => {
      const response = await request(app)
        .get(`/api/v1/space/${spaceId}`)
        .set("Authorization", `Bearer ${userToken}`);
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("dimensions");
      expect(response.body).toHaveProperty("elements");
      expect(response.body.elements).toBeInstanceOf(Array);
    });

    it("should return 400 for invalid spaceId", async () => {
      const response = await request(app)
        .get("/api/v1/space/invalidId")
        .set("Authorization", `Bearer ${userToken}`);
      expect(response.statusCode).toBe(400);
    });
  });

  describe("POST /api/v1/space/element", () => {
    it("should add an element to a space and return 200", async () => {
      const response = await request(app)
        .post("/api/v1/space/element")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          elementId: element1Id,
          spaceId: spaceId,
          x: 50,
          y: 20,
        });
      expect(response.statusCode).toBe(200);
    });

    it("should return 400 for invalid input", async () => {
      const response = await request(app)
        .post("/api/v1/space/element")
        .set("Authorization", `Bearer ${userToken}`)
        .send({});
      expect(response.statusCode).toBe(400);
    });
  });

  describe("DELETE /api/v1/space/element", () => {
    it("should delete an element and return 200", async () => {
      const response = await request(app)
        .get(`/api/v1/space/${spaceId}`)
        .set("Authorization", `Bearer ${userToken}`);

      const deleteResponse = await request(app)
        .delete("/api/v1/space/element")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          id: response.body.elements[0].id,
        });
      expect(deleteResponse.statusCode).toBe(200);
    });

    it("should return 400 for invalid input", async () => {
      const response = await request(app)
        .delete("/api/v1/space/element")
        .set("Authorization", `Bearer ${userToken}`)
        .send({});
      expect(response.statusCode).toBe(400);
    });
  });

  describe("GET /api/v1/elements", () => {
    it("should return all available elements", async () => {
      const response = await request(app)
        .get("/api/v1/elements")
        .set("Authorization", `Bearer ${userToken}`);
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("elements");
      expect(response.body.elements).toBeInstanceOf(Array);
    });
  });
});

describe("Admin/Map Creator API", () => {
  let userId;
  let userToken;
  let adminId;
  let adminToken;

  beforeAll(async () => {
    const userSignupResponse = await request(app).post("/api/v1/signup").send({
      username: "ritikv91-user",
      password: "123random",
      type: "user",
    });
    userId = userSignupResponse.body.userId;

    const userSigninResponse = await request(app).post("/api/v1/signin").send({
      username: "ritikv91-user",
      password: "123random",
    });
    userToken = userSigninResponse.body.token;

    const signupResponse = await request(app).post("/api/v1/signup").send({
      username: "ritikv91",
      password: "123random",
      type: "admin",
    });
    adminId = signupResponse.body.userId;

    const signinResponse = await request(app).post("/api/v1/signin").send({
      username: "ritikv91",
      password: "123random",
    });
    adminToken = signinResponse.body.token;
  });

  describe("POST /api/v1/admin/element", () => {
    it("admin should create an element and return elementId", async () => {
      const response = await request(app)
        .post("/api/v1/admin/element")
        .set("Authorization", adminToken)
        .send({
          imageUrl: "https://example.com/image.png",
          width: 1,
          height: 1,
          static: true,
        });

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("id");
    });

    it("admin should return 400 for invalid input", async () => {
      const response = await request(app)
        .post("/api/v1/admin/element")
        .set("Authorization", adminToken)
        .send({});
      expect(response.statusCode).toBe(400);
    });

    it("should return 403 for user created input", async () => {
      const response = await request(app)
        .post("/api/v1/admin/element")
        .set("Authorization", userToken)
        .send({
          imageUrl: "https://example.com/image.png",
          width: 1,
          height: 1,
          static: true,
        });
      expect(response.statusCode).toBe(403);
    });
  });

  describe("PUT /api/v1/admin/element/:elementId", () => {
    let elementId;

    beforeAll(async () => {
      const element = await request(app)
        .post("/api/v1/admin/element")
        .set("Authorization", adminToken)
        .send({
          imageUrl: "https://example.com/image.png",
          width: 1,
          height: 1,
          static: true,
        });
      elementId = element.body.id;
    });

    it("admin should update an element and return 200", async () => {
      const response = await request(app)
        .put(`/api/v1/admin/element/${elementId}`)
        .set("Authorization", adminToken)
        .send({
          imageUrl: "https://example.com/new_image.png",
        });
      expect(response.statusCode).toBe(200);
    });

    it("admin should return 400 for invalid input", async () => {
      const response = await request(app)
        .put(`/api/v1/admin/element/${elementId}`)
        .set("Authorization", adminToken)
        .send({});
      expect(response.statusCode).toBe(400);
    });
  });

  describe("POST /api/v1/admin/avatar", () => {
    it("user should create an avatar and return avatarId", async () => {
      const response = await request(app)
        .post("/api/v1/admin/avatar")
        .set("Authorization", userToken)
        .send({
          imageUrl: "https://example.com/avatar.png",
          name: "Timmy",
        });
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("avatarId");
    });

    it("user should return 400 for invalid input", async () => {
      const response = await request(app)
        .post("/api/v1/admin/avatar")
        .set("Authorization", userToken)
        .send({});
      expect(response.statusCode).toBe(400);
    });
  });

  describe("POST /api/v1/admin/map", () => {
    let elementId;

    beforeAll(async () => {
      const element = await request(app)
        .post("/api/v1/admin/element")
        .set("Authorization", adminToken)
        .send({
          imageUrl: "https://example.com/image.png",
          width: 1,
          height: 1,
          static: true,
        });
      elementId = element.body.id;
    });

    it("user should create a map and return mapId", async () => {
      const response = await request(app)
        .post("/api/v1/admin/map")
        .set("Authorization", userToken)
        .send({
          thumbnail: "https://example.com/thumbnail.png",
          dimensions: "100x200",
          name: "Test Map",
          defaultElements: [
            {
              elementId,
              x: 20,
              y: 20,
            },
          ],
        });
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("id");
    });

    it("user should return 400 for invalid input", async () => {
      const response = await request(app)
        .post("/api/v1/admin/map")
        .set("Authorization", userToken)
        .send({});
      expect(response.statusCode).toBe(400);
    });
  });
});
