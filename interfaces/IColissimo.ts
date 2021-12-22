import { RowDataPacket } from 'mysql2';

export default interface IColissimo extends RowDataPacket {
  name: string;
  weight: string;
  price: number;
}
