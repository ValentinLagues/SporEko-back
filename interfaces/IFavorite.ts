import { RowDataPacket } from 'mysql2';

export default interface IFavorite extends RowDataPacket {
  id_favorite: number;
  id_offer: number;
  id_user: number;
}
