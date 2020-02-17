"use strict";

const Route = use("Route");
const { RedisHelper, ResponseParser, AesUtil } = use("App/Helpers");
const Env = use("Env");
const User = use("App/Models/User");

Route.get("/", "DocumentController.intro");

Route.get("/docs", "DocumentController.index");

Route.group(() => {
  Route.post("/login", "LoginController.login").validator("Login");
  Route.post("/refresh", "LoginController.refresh").middleware(["auth:jwt"]);
  Route.post("/reset", "PasswordController.postReset").validator(
    "Auth/GetForgot"
  );
})
  .prefix("api/v1")
  .namespace("Auth")
  .formats(["json"]);

/**
 * Auth:jwt Route
 */

Route.group(() => {
  /**
   * Redis
   */

  Route.get("redis/clear", async ({ response }) => {
    await RedisHelper.clear();
    return response
      .status(200)
      .send(ResponseParser.successResponse("Redis Clear"));
  }).middleware(["can:clear-redis"]);

  Route.post("make-token", async ({ request, response }) => {
    const date = Math.floor(Date.now() / 1000).toString();
    const CLIENT_TOKEN = Env.get("CLIENT_TOKEN");
    const body = {
      date
    };
    const encrypted = AesUtil.encrypt(
      JSON.stringify(body),
      date + CLIENT_TOKEN
    );
    return response.status(200).send(
      ResponseParser.successResponse(
        {
          encrypted,
          date
        },
        "Token"
      )
    );
  });

  /**
   * Dashboard
   */

  Route.get("dashboard-data", "DashboardController.index");
  Route.post("dashboard-data", "DashboardController.store");

  /**
   * Activities
   */
  Route.get("activities", "ActivityController.index");

  /**
   * Kode Produk
   */
  Route.get("kode-produk", "KodeController.index");

  /**
   * Users
   */
  Route.resource("users", "UserController")
    .apiOnly()
    .validator(
      new Map([
        [["users.store"], ["User"]],
        [["users.update"], ["UserUpdate"]],
        [["users.index"], ["List"]]
      ])
    )
    .middleware(
      new Map([
        [["users.index"], ["can:read-user"]],
        [["users.store"], ["can:create-user"]],
        [["users.update"], ["can:update-user"]],
        [["users.destroy"], ["can:delete-user"]]
      ])
    );

  /**
   * Roles
   */
  Route.resource("roles", "RoleController")
    .apiOnly()
    .validator(
      new Map([
        [["roles.store"], ["StoreRole"]],
        [["roles.update"], ["UpdateRole"]]
      ])
    )
    .middleware(
      new Map([
        [["roles.index"], ["can:read-role"]],
        [["roles.store"], ["can:create-role"]],
        [["roles.update"], ["can:update-role"]],
        [["roles.destroy"], ["can:delete-role"]]
      ])
    );

  Route.get(
    "/role/:id/permissions",
    "RoleController.getPermissions"
  ).middleware("can:read-role");
  Route.put("/role/permissions", "RoleController.attachPermissions")
    .validator("AttachPermissions")
    .middleware("can:create-role");

  /**
   * Roles
   */
  Route.resource("permissions", "PermissionController")
    .apiOnly()
    .validator(
      new Map([
        [["permissions.store"], ["StorePermission"]],
        [["permissions.update"], ["UpdatePermission"]]
      ])
    )
    .middleware(
      new Map([
        [["permissions.index"], ["can:read-permission"]],
        [["permissions.store"], ["can:create-permission"]],
        [["permissions.update"], ["can:update-permission"]],
        [["permissions.destroy"], ["can:delete-permission"]]
      ])
    );

  /**
   * Me
   */
  Route.get("me", "ProfileController.me");

  /**
   * Supervisor
   */

  Route.resource("supervisors", "SupervisorController")
    .apiOnly()
    .validator(
      new Map([
        [["supervisors.store"], ["Supervisor"]],
        [["supervisors.update"], ["Supervisor"]],
        [["supervisors.index"], ["List"]]
      ])
    )
    .middleware(
      new Map([
        [["supervisors.index"], ["can:read-supervisor"]],
        [["supervisors.store"], ["can:create-supervisor"]],
        [["supervisors.update"], ["can:update-supervisor"]],
        [["supervisors.destroy"], ["can:delete-supervisor"]]
      ])
    );

  Route.post(
    "supervisor/attach-marketing",
    "SupervisorController.attachMarketing"
  )
    .validator("AddMarketing")
    .middleware("can:create-supervisor");

  Route.put(
    "supervisor/detach-marketing",
    "SupervisorController.detachMarketing"
  )
    .validator("AddMarketing")
    .middleware("can:read-supervisor");

  Route.get(
    "supervisor/search-marketing",
    "SupervisorController.searchMarketing"
  ).middleware("admin");

  /**
   * Product
   */
  Route.resource("products", "ProductController")
    .apiOnly()
    .validator(
      new Map([
        [["products.store", "products.update"], ["StoreProduct"]],
        [["products.index"], ["List"]]
      ])
    )
    .middleware(
      new Map([
        [["products.index"], ["can:read-product"]],
        [["products.store"], ["can:create-product"]],
        [["products.update"], ["can:update-product"]],
        [["products.destroy"], ["can:delete-product"]]
      ])
    );

  /**
   * Error Log
   */
  Route.resource("error-logs", "ErrorLogController")
    .apiOnly()
    .validator(
      new Map([[["error-logs.store", "error-logs.update"], ["StoreError"]]])
    )
    .middleware(
      new Map([
        [["products.index"], ["can:read-product"]],
        [["products.store"], ["can:create-product"]],
        [["products.update"], ["can:update-product"]],
        [["products.destroy"], ["can:delete-product"]]
      ])
    );

  /**
   * For Combo Box / Select Box
   */
  Route.get("combo-data", "ComboDataController.index");

  /**
   * Export Data
   */

  Route.get("export-data", "DataExportController.index").validator(
    "ExportData"
  );

  /**
   * Get Permission by role id
   */

  Route.get(
    "/role/:id/permissions",
    "RoleController.getPermissions"
  ).middleware("can:read-role");
  Route.put("/role/permissions", "RoleController.attachPermissions")
    .validator("AttachPermissions")
    .middleware("can:create-role");
})
  .prefix("api/v1")
  .formats(["json"])
  .middleware(["auth:jwt"]);

/**
 * Auth:jwt, me Routes
 */

Route.group(() => {
  Route.put("profile/:id", "ProfileController.update").validator(
    "ProfileUpdate"
  );
  Route.put(
    "profile/:id/change-password",
    "ProfileController.changePassword"
  ).validator("ChangePassword");
  Route.post("profile/upload/:id", "ProfileController.uploadPhoto");
})
  .prefix("api/v1")
  .formats(["json"])
  .middleware(["auth:jwt", "me"]);

/**
 * No Middleware
 */
Route.group(() => {
  Route.get("check-target-code/:code", "MarketingTargetController.checkCode");
  Route.post("post-down-payment", "DownPaymentController.storeFromStudent");
})
  .prefix("api/v1")
  .middleware(["client"]);

Route.group(() => {
  Route.put("updateKode", "UpdateKodeController.updateKode").validator(
    "UpdateKode"
  );
  Route.put("updateKodePc", "UpdateKodeController.updateKodePc").validator(
    "UpdateKode"
  );
  Route.put("resetKode", "UpdateKodeController.resetKode").validator(
    "ResetKode"
  );
  Route.put("resetKodePc", "UpdateKodeController.resetKodePc").validator(
    "ResetKode"
  );
  Route.post(
    "registerUserIos",
    "UpdateKodeController.registerUserIos"
  ).validator("RegisterUserIos");
  Route.get("kode", "KodeController.kodeCheck").validator("KodeCheck");
  Route.post("updateByKode/:kode", "AppUpdaterController.postReqUpdateByKode");
  // Route.post('buatKodeProduk', 'BuatKodeController.buatKodeProduk')
  //   .validator("CreateCodeProduct")
  Route.get("buatKode", "BuatKodeController.buatKode").validator("CreateCode");
}).prefix("api/v1");

Route.group(() => {
  // Route.get('buatKode', 'BuatKodeController.buatKode')
  //   .validator("CreateCode")
  //   .middleware("can:create-code")
  Route.post("buatKodeProduk", "BuatKodeController.buatKodeProduk")
    .validator("CreateCodeProduct")
    .middleware("can:create-code");
})
  .prefix("api/v1")
  .middleware(["auth:jwt"]);

/**
 * App Updater
 */
Route.group(() => {
  Route.resource("updater", "AppUpdaterController")
    .apiOnly()
    .validator(
      new Map([
        [["updater.store"], ["AppUpdater"]],
        [["updater.update"], ["AppUpdater"]],
        [["updater.index"], ["List"]]
      ])
    )
    .middleware(
      new Map([
        [["updater.index"], ["auth:jwt"], ["can:read-app-updater"]],
        [["updater.store"], ["auth:jwt"], ["can:create-app-updater"]],
        [["updater.update"], ["auth:jwt"], ["can:update-app-updater"]],
        [["updater.destroy"], ["auth:jwt"], ["can:delete-app-updater"]]
      ])
    );
}).prefix("api/v1");
