"use strict"

const Server = use("Server")

const Scheduler = use("Adonis/Addons/Scheduler")
Scheduler.run()

/*
|--------------------------------------------------------------------------
| Global Middleware
|--------------------------------------------------------------------------
|
| Global middleware are executed on each http request only when the routes
| match.
|
*/
const globalMiddleware = [
  "Adonis/Middleware/BodyParser",
  "Adonis/Middleware/Session",
  "Adonis/Acl/Init",
]

/*
|--------------------------------------------------------------------------
| Named Middleware
|--------------------------------------------------------------------------
|
| Named middleware is key/value object to conditionally add middleware on
| specific routes or group of routes.
|
| // define
| {
|   auth: 'Adonis/Middleware/Auth'
| }
|
| // use
| Route.get().middleware('auth')
|
*/
const namedMiddleware = {
  auth: "Adonis/Middleware/Auth",
  me: "App/Middleware/Me",
  super: "App/Middleware/SuperAdmin",
  admin: "App/Middleware/Admin",
  supervisor: "App/Middleware/Supervisor",
  is: "Adonis/Acl/Is",
  can: "Adonis/Acl/Can",
  client: "App/Middleware/Client",
}

/*
|--------------------------------------------------------------------------
| Server Middleware
|--------------------------------------------------------------------------
|
| Server levl middleware are executed even when route for a given URL is
| not registered. Features like `static assets` and `cors` needs better
| control over request lifecycle.
|
*/
const serverMiddleware = ["Adonis/Middleware/Static", "Adonis/Middleware/Cors"]

Server.registerGlobal(globalMiddleware)
  .registerNamed(namedMiddleware)
  .use(serverMiddleware)
