import { Router, Request, Response } from "express";
import { INoteService } from "../../Domain/services/notes/INoteService";
import { authenticate } from "../../Middlewares/authentification/AuthMiddleware";

export class NotesController {
    private router: Router;
    private notesService: INoteService;

     constructor(notesService: INoteService) {
    this.router = Router();
    this.notesService = notesService;
    this.initializeRoutes();
  }
  private initializeRoutes(): void{
    this.router.get('/notes',authenticate, this.getAllUserNotes.bind(this));
  }

   /**
   * GET /api/v1/notes
   * Vraća sve beleske odredjenog korisnika
   */
  private async getAllUserNotes(req: Request, res: Response): Promise<void>{
     try {
        // 1. Uzimamo ownerId iz prijavljenog korisnika
        const ownerId = req.user?.id;
        console.log("id prijavljenog: " + ownerId);
        if (!ownerId) {
            res.status(401).json({ message: "Korisnik nije prijavljen" });
            return;
        }

        // 2. Pozivamo servis i prosleđujemo ownerId
        const notes = await this.notesService.getAllUserNotes(ownerId);

        // 3. Vraćamo rezultat klijentu
        res.status(200).json(notes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Greška pri dohvatanju beleški" });
    }
  }
  public getRouter(): Router {
    return this.router;
  }
}