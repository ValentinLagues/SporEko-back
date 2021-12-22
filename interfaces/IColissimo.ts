import { RowDataPacket } from 'mysql2';

export default interface IColissimo extends RowDataPacket {
  id_colissimo: number;
  name: string;
  weight: string;
  price: number;
}