import { RowDataPacket } from 'mysql2';

export default interface IShoe extends RowDataPacket {
  id_shoe: number;
  name: string;
}
