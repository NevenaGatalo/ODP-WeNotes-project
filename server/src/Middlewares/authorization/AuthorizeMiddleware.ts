import { Request, Response, NextFunction } from "express";

//provera da li korisnik ima dozvolu da pristupi određenoj ruti na osnovu svoje uloge
//prima listu dozvoljenih uloga i pretvara ih u niz dozvoljene uloge
export const authorize = (...dozvoljeneUloge: string[]) => {
  //req res i next su argumenti koje prima funkcija
  //next znaci sledeca funkcija koja treba da se izvrsi, zahtev ide dalje u sledeci middleware ili kontroler
  return (req: Request, res: Response, next: NextFunction): void => {
    //ocekuje se da je req.user vec postavljen od authenticate middleware-a
    const user = req.user;

    if (!user || !dozvoljeneUloge.includes(user.uloga)) {
      res.status(403).json({ success: false, message: "Zabranjen pristup" });
      return;
    }

    next();
  };
};
