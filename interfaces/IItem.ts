import { RowDataPacket } from 'mysql2';

export default interface IItems extends RowDataPacket {
  id_item: number;
  name: string;
  id_category: number;
}
