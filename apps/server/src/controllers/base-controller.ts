import { Request, Response } from 'express';
export class BaseController {
  structure<T>(req: Request, res: Response) {
    return async (cb: (req: Request, res: Response) => Promise<T>) => {
      const info = {
        url: req.originalUrl,
        params: req.params,
        path: req.path,
      };
      console.log(`[PROGRESSING...] Executed method ${JSON.stringify(info)}`, {});
      try {
        const data: T = await cb(req, res);
        console.log(`[SUCCESS] Successfully executed method ${JSON.stringify(info)}`, {});
        console.log(data);
        res.status(200).json(data);
      } catch (error: any) {
        console.error(`[ERROR] Error executing method ${JSON.stringify(info)}: ${error}`, {});
        res
          .status(500)
          .send({
            message: error.message,
          })
          .json();
      }
    };
  }
}
