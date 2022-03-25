import { auth } from 'firebase-admin';

export async function guard(req, res, next) {
  let headers = req.headers;
  try {
    if ('authorization' in headers) {
      let token = headers.authorization.slice(7);
      req['auth'] = await auth().verifyIdToken(token);
      req['uid'] = req['auth']['uid'];
      next();
    } else {
      next('unauthorized');
    }
  } catch (e) {
    next({ message: e.message });
  }
}
