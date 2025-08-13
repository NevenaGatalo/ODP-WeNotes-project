import { Router, Request, Response } from "express";
import { INoteService } from "../../Domain/services/notes/INoteService";
import { authenticate } from "../../Middlewares/authentification/AuthMiddleware";
import { ValidateNewNote } from "../validators/notes/NewNoteValidator";
import { NoteDto } from "../../Domain/DTOs/notes/NoteDto";

export class NotesController {
  private router: Router;
  private notesService: INoteService;

  constructor(notesService: INoteService) {
    this.router = Router();
    this.notesService = notesService;
    this.initializeRoutes();
  }
  private initializeRoutes(): void {
    this.router.post('/note', authenticate, this.create.bind(this));
    this.router.get('/notes', authenticate, this.getAllUserNotes.bind(this));
  }

  /**
     * POST /api/v1/note
     * Kreira novi note
     */
  private async create(req: Request, res: Response): Promise<void> {
    try {
      const { title, content, image_url } = req.body;

      // Validate inputs
      if (ValidateNewNote(title, content).uspesno == false) {
        res.status(400).json({ success: false, message: 'Naslov i beleska su obavezna polja za unos.' });
        return;
      }
      //validacija da user ne sme da salje image_url
      const finalImageUrl = req.user!.uloga === 'admin' ? image_url || null : null;
      const ownerId = req.user!.id;

      const noteDto = new NoteDto(0, title, content, finalImageUrl, false, ownerId);
      const createdNote = await this.notesService.createNote(noteDto);

      if (createdNote.id !== 0) {
        res.status(201).json({ success: true, message: 'Uspešno kreirana beleska', data: createdNote });
      } else {
        res.status(500).json({ success: false, message: 'Kreiranje beleske nije uspelo.' });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: (error instanceof Error) ? error.message : String(error)
      });

    }
  }


  /**
  * GET /api/v1/notes
  * Vraća sve beleske odredjenog korisnika
  */
  private async getAllUserNotes(req: Request, res: Response): Promise<void> {
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