import { RowDataPacket } from 'mysql2';

export default interface ICategory extends RowDataPacket {
  name: string;
}