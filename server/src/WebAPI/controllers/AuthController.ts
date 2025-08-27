import { Request, Response, Router } from 'express';
import { IAuthService } from '../../Domain/services/auth/IAuthService';
import { validacijaPodatakaAuth } from '../validators/auth/RegisterValidator';
import jwt from "jsonwebtoken";

//odavde se poziva middleware
export class AuthController {
  //ruter - objekat koji cuva rute za ovaj kontroler
  private router: Router;
  //instanca servisa koji radi logiku
  //taj autservis se prosledjuje ovoj klasi
  private authService: IAuthService;

  constructor(authService: IAuthService) {
    this.router = Router();
    this.authService = authService;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/auth/login', this.prijava.bind(this));
    this.router.post('/auth/register', this.registracija.bind(this));
  }

  /**
   * POST /api/v1/auth/login
   * Prijava korisnika
   */
  private async prijava(req: Request, res: Response): Promise<void> {
    try {
      const { korisnickoIme, lozinka } = req.body;

      // Validacija input parametara
      const rezultat = validacijaPodatakaAuth(korisnickoIme, lozinka);

      if (!rezultat.uspesno) {
        res.status(400).json({ success: false, message: rezultat.poruka });
        return;
      }

      const result = await this.authService.prijava(korisnickoIme, lozinka);

      // Proveravamo da li je prijava uspešna
      if (result.id !== 0) {
        // Kreiranje jwt tokena
        const token = jwt.sign(
          {
            id: result.id,
            korisnickoIme: result.korisnickoIme,
            uloga: result.uloga,
          }, process.env.JWT_SECRET ?? "", { expiresIn: '6h' });

        res.status(200).json({ success: true, message: 'Uspešna prijava', data: token });
        return;
      } else {
        res.status(401).json({ success: false, message: 'Neispravno korisnicko ime ili lozinka' });
        return;
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: error });
    }
  }

  /**
   * POST /api/v1/auth/register
   * Registracija novog korisnika
   */
  private async registracija(req: Request, res: Response): Promise<void> {
    try {
      const { korisnickoIme, lozinka, uloga } = req.body;
      const rezultat = validacijaPodatakaAuth(korisnickoIme, lozinka);

      if (!rezultat.uspesno) {
        res.status(400).json({ success: false, message: rezultat.poruka });
        return;
      }

      const result = await this.authService.registracija(korisnickoIme, uloga, lozinka);

      console.log("Rezultat registracije: " + result);

      // Proveravamo da li je registracija uspešna
      if (result.id !== 0) {
        // Kreiranje jwt tokena
        const token = jwt.sign(
          {
            id: result.id,
            korisnickoIme: result.korisnickoIme,
            uloga: result.uloga,
          }, process.env.JWT_SECRET ?? "", { expiresIn: '6h' });

        //token se salje klijentu i klijent ga cuva
        res.status(201).json({ success: true, message: 'Uspešna registracija', data: token });
      } else {
        res.status(401).json({ success: false, message: 'Registracija nije uspela. Korisnicko ime vec postoji.', });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: error });
    }
  }

  /**
   * Getter za router
   */
  //omogucava da se kontroler poveze sa glavnim express app-om npr. app.use('/api/v1', authController.getRouter());
  public getRouter(): Router {
    return this.router;
  }
}