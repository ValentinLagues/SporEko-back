import { RowDataPacket } from 'mysql2';

export default interface IFavorite extends RowDataPacket {
  id_size: number;
  id_offer: number;
  is_user: number;
}
