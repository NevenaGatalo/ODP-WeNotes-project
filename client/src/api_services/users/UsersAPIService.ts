import axios from "axios";
import type { UserDto } from "../../models/users/UserDto";
import type { IUsersAPIService } from "./IUsersAPIService";

const API_URL: string = import.meta.env.VITE_API_URL + "user";

//salje HTTP get zahtev na bekend
//axious.get salje HTTP get zahtev na `${API_URL}s`
//token koji se salje je token trenutno prijavljenog korisnika
//kada se poziva getSviKorisnici: npr. Nakon uspešne prijave korisnika — da bi učitala podatke o drugim korisnicima (npr. za admin panel)
export const usersApi: IUsersAPIService = {
  async getSviKorisnici(token: string): Promise<UserDto[]> {
    try {
      const res = await axios.get<UserDto[]>(`${API_URL}s`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch {
      return [];
    }
  },
};
