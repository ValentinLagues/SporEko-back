import { RowDataPacket } from 'mysql2';

export default interface ICategory extends RowDataPacket {
  id_category: number;
  name: string;
}
