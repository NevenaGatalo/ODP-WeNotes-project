import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

//interface koji definise kako izgleda sadrzaj tokena
interface JwtPayload {
  id: number;
  korisnickoIme: string;
  uloga: string;
}

//Proširuješ Express Request objekat da može imati opcioni property user tipa JwtPayload
//To znači da posle autentifikacije možeš pristupiti req.user u ostalim delovima aplikacije
//request objekat je objekat koji predstavlja http zahtev koji klijent salje serveru
//dole u funkciji authenticate se to polje postavlja ako je token validan
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

//middleware funkcija koja sluzi za proveru JWT tokena i autentifikaciju korisnika na serverskoj strani
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ success: false, message: "Nedostaje token" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET ?? ""
    ) as JwtPayload;

    req.user = decoded; // postavlja korisnika na req
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: "Nevažeći token" });
  }
};
