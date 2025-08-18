import { Router, Request, Response } from "express";
import { INoteService } from "../../Domain/services/notes/INoteService";
import { authenticate } from "../../Middlewares/authentification/AuthMiddleware";
import { ValidateNewNote } from "../validators/notes/NewNoteValidator";
import { NoteDto } from "../../Domain/DTOs/notes/NoteDto";
import { authorize } from "../../Middlewares/authorization/AuthorizeMiddleware";

export class NotesController {
  private router: Router;
  private notesService: INoteService;

  constructor(notesService: INoteService) {
    this.router = Router();
    this.notesService = notesService;
    this.initializeRoutes();
  }
  private initializeRoutes(): void {
    this.router.post('/notes', authenticate, this.create.bind(this));
    this.router.get('/notes', authenticate, this.getAllUserNotes.bind(this));
    this.router.delete('/notes/:id', authenticate, this.delete.bind(this));
    this.router.put('/notes/:id', authenticate, this.update.bind(this));
    this.router.post('/notes/:id', authenticate, this.duplicate.bind(this));
    this.router.put('/notes/share/:id', authenticate, this.share.bind(this));
    this.router.get('/notes/share/:guid', this.show.bind(this));

  }
  /**
     * GET /notes/share/:guid
     * Vraca belesku sa odredjenim guidom
     */
  public async show(req: Request, res: Response) {
    const { guid } = req.params;

    try {
        // traži belešku po share_guid
        const note = await this.notesService.getNoteByGuid(guid);

        if (note.id === 0) {
            res.status(404).json({ success: false, message: 'Beleška nije pronađena' });
            return;
        }

        // vrati sadržaj beleške
        res.json({ success: true, message: "Beleska pronadjena", data: note });
    } catch (error) {
        res.status(500).json({ success: false, message: String(error) });
    }
}

  /**
     * PUT /api/v1/notes/share/:id
     * Pravi link za deljenje postojece beleske
     */
  // public async share(req: Request, res: Response) {
  //   const noteId = Number(req.params.id);
  //   const ownerId = req.user!.id;
  //   try {

  //     if (!noteId) {
  //       res.status(400).json({ success: false, message: "ID beleške je obavezan." });
  //       return;
  //     }
  //     //provera da li se deli beleska trenutno ulogovanog korisnika
  //     const noteForSharing = await this.notesService.getNoteById(noteId);
  //     if (noteForSharing.owner_id !== ownerId) {
  //       res.status(403).json({ success: false, message: "Beleska ne pripada korisniku." });
  //       return;
  //     }
  //     //provera da li guid postoji
  //     if(noteForSharing.share_guid !== null && noteForSharing.share_guid !== ""){
  //       res.status(403).json({ success: false, message: "Beleska vec ima share link." });
  //       return;
  //     }

  //     const guid = await this.notesService.shareNote(noteId);
  //     if (!guid) {
  //       res.status(500).json({ success: false, message: 'Greska pri kreiranju share linka' });
  //       return;
  //     }

  //     //res.status(200).json({ success: true, message: "Uspesno kreiran link", data: `http://localhost:4000/api/v1/notes/share/${guid}` });
  //     res.status(200).json({ success: true, message: "Uspesno kreiran link", data: note });
  //   } catch (error) {
  //     res.status(500).json({
  //       success: false,
  //       message: error instanceof Error ? error.message : String(error)
  //     });
  //   }
  // }
   public async share(req: Request, res: Response) {
    const noteId = Number(req.params.id);
    const ownerId = req.user!.id;
    const { title, content, image_url, is_pinned, owner_id, share_guid } = req.body;

    try {

      if (!noteId) {
        res.status(400).json({ success: false, message: "ID beleške je obavezan." });
        return;
      }
      //provera da li se deli beleska trenutno ulogovanog korisnika
      //const noteForSharing = await this.notesService.getNoteById(noteId);
      if (owner_id !== ownerId) {
        res.status(403).json({ success: false, message: "Beleska ne pripada korisniku." });
        return;
      }
      //provera da li guid postoji
      if(share_guid !== null && share_guid !== ""){
        res.status(403).json({ success: false, message: "Beleska vec ima share link." });
        return;
      }

      const updatedNote = await this.notesService.shareNote(new NoteDto(noteId, title, content, image_url, is_pinned, ownerId, share_guid));

      if (updatedNote.id === 0) {
        res.status(500).json({ success: false, message: 'Greska pri kreiranju share linka' });
        return;
      }

      //res.status(200).json({ success: true, message: "Uspesno kreiran link", data: `http://localhost:4000/api/v1/notes/share/${guid}` });
      res.status(200).json({ success: true, message: "Uspesno kreiran link", data: updatedNote });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : String(error)
      });
    }
  }
  /**
     * POST /api/v1/notes/:id
     * Duplira postojecu belesku
     */
  private async duplicate(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const ownerId = req.user!.id;

      if (!id) {
        res.status(400).json({ success: false, message: "ID beleške je obavezan." });
        return;
      }

      //validacija da li korisnik ima vec 10 beleski
      if (req.user!.uloga === 'user') {
        const noteCount = await this.notesService.getUserNoteCount(ownerId);
        if (noteCount == -1) {
          res.status(500).json({ success: false, message: 'Neuspesno prebrojavanje beleski korisnika, kreiranje nije uspelo' });
          return;
        }
        if (noteCount >= 10) {
          res.status(403).json({ success: false, message: 'Korisnik vec ima 10 kreiranih beleski, nije moguce duplirati belesku' });
          return;
        }
      }

      //provera da li se duplira beleska trenutno ulogovanog korisnika
      const noteForDuplicating = await this.notesService.getNoteById(id);
      if (noteForDuplicating.owner_id !== ownerId) {
        res.status(403).json({ success: false, message: "Beleska ne pripada korisniku." });
        return;
      }

      const duplicatedNote = await this.notesService.duplicateNote(id, ownerId);

      if (duplicatedNote.id !== 0) {
        res.status(201).json({ success: true, message: "Beleška je duplirana.", data: duplicatedNote });
      } else {
        res.status(404).json({ success: false, message: "Beleška nije pronađena." });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: String(error),
      });
    }
  }

  /**
     * PUT /api/v1/notes/:id
     * Azurira postojecu belesku
     */
  private async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const { title, content, image_url, is_pinned, share_guid } = req.body;

      if (!id || !title || !content || is_pinned === null) {
        res.status(400).json({ success: false, message: 'Nevalidni podaci za ažuriranje.' });
        return;
      }

      //validacija podataka da li su tacni
      if (ValidateNewNote(title, content).uspesno == false) {
        res.status(400).json({ success: false, message: 'Naslov i beleska su obavezna polja za unos.' });
        return;
      }

      //validacija da user ne sme da salje image_url
      const finalImageUrl = req.user!.uloga === 'admin' ? image_url || null : null;
      const ownerId = req.user!.id;

      //validacija da li se azurira beleska koja pripada ulogovanom korisniku
      const noteForDuplicating = await this.notesService.getNoteById(id);
      if (noteForDuplicating.owner_id !== ownerId) {
        res.status(403).json({ success: false, message: "Beleska ne pripada korisniku." });
        return;
      }

      const updatedNote = await this.notesService.updateNote(new NoteDto(id, title, content, finalImageUrl, is_pinned, ownerId, share_guid));

      if (updatedNote.id !== 0) {
        res.status(200).json({ success: true, message: 'Beleska je uspesno azurirana.', data: updatedNote });
      } else {
        res.status(404).json({ success: false, message: 'Beleska nije pronadjena.' });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : String(error)
      });
    }
  }

  /**
   * DELETE /api/v1/notes/:id
   * Briše belesku
   */
  private async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      if (!id) {
        res.status(400).json({ success: false, message: 'Nevalidan ID.' });
        return;
      }

      const success = await this.notesService.deleteNote(id);

      if (success) {
        res.status(200).json({ success: true, message: 'Beleska uspesno obrisana.' });
      } else {
        res.status(404).json({ success: false, message: 'Beleska nije pronadjena.' });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: error });
    }
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

      //validacija user ne sme da kreira vise od 10 beleski
      if (req.user!.uloga === 'user') {
        const noteCount = await this.notesService.getUserNoteCount(ownerId);
        if (noteCount === -1) {
          res.status(500).json({ success: false, message: 'Neuspesno prebrojavanje beleski korisnika, kreiranje nije uspelo' });
          return;
        }
        if (noteCount >= 10) {
          res.status(403).json({ success: false, message: 'Korisnik vec ima 10 kreiranih beleski' });
          return;
        }
      }

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
        res.status(401).json({ success: false, message: "Korisnik nije prijavljen" });
        return;
      }

      // 2. Pozivamo servis i prosleđujemo ownerId
      const notes = await this.notesService.getAllUserNotes(ownerId);

      // 3. Vraćamo rezultat klijentu
      res.status(200).json({ success: true, message: 'Uspešno kreirana beleska', data: notes });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Greška pri dohvatanju beleški" });
    }
  }
  public getRouter(): Router {
    return this.router;
  }
}