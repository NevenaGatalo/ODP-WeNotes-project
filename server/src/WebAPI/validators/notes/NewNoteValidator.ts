import { RezultatValidacije } from "../../../Domain/types/ValidationResult";

export function ValidateNewNote(title?: string, content?: string): RezultatValidacije {
    if (!title || !content) {
        return { uspesno: false, poruka: 'Nisu uneti svi neophodni podaci.' };
    }

    if (title.length < 3) {
        return { uspesno: false, poruka: 'Naslov beleske mora imati najmanje 3 karaktera.' };
    }

    if (title.length > 50) {
        return { uspesno: false, poruka: 'Naslov beleske sme imati najviše 500 karaktera.' };
    }

    if (content.length > 500) {
        return { uspesno: false, poruka: 'Beleska moze imati najviše 500 karaktera.' };
    }
    return { uspesno: true };
}