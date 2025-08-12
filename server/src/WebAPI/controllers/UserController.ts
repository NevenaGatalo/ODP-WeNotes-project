import { Request, Response, Router } from "express";
import { IUserService } from "../../Domain/services/users/IUserService";
import { UserDto } from "../../Domain/DTOs/users/UserDto";
import { authenticate } from "../../Middlewares/authentification/AuthMiddleware";
import { authorize } from "../../Middlewares/authorization/AuthorizeMiddleware";

//kontroleri obradjuju http zahteve
//ova klasa rukuje rutama vezanim za korisnike
//IUserService - logika
//authenticate i authorize se impotrovalo iz Middlewares
export class UserController {
  private router: Router;
  private userService: IUserService;

  constructor(userService: IUserService) {
    this.router = Router();
    this.userService = userService;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // ostale metode, npr. /api/v1/user/1 <--- user po ID-ju 1
    //authenticate - proverava da li postoji vazeci jwt token u requestu
    //authorize - proverava da li korisnik ima ulogu admin
    //za turu .../users poziva se lanac prvo authenticate pa authorize pa korisnici
    this.router.get("/users", authenticate, authorize("admin"), this.korisnici.bind(this));
  }

  /**
   * GET /api/v1/users
   * Svi korisnici
   */
  private async korisnici(req: Request, res: Response): Promise<void> {
    try {
      const korisniciPodaci: UserDto[] =
        await this.userService.getSviKorisnici();

      res.status(200).json(korisniciPodaci);
      return;
    } catch (error) {
      res.status(500).json({ success: false, message: error });
    }
  }

  /**
   * Getter za router
   */
  public getRouter(): Router {
    return this.router;
  }
}
