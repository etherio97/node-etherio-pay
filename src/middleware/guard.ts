import { auth } from "firebase-admin";

export async function guard(req, res, next) {
  let headers = req.headers;
  try {
    if ("authorization" in headers) {
      req["token"] = headers.authorization.slice(7);
      req["auth"] = await auth().verifyIdToken(req["token"]);
      req["uid"] = req["auth"]["uid"];
      next();
    } else {
      next("unauthorized");
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
