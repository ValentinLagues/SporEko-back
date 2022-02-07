import { RowDataPacket } from 'mysql2';

export default interface IBrand extends RowDataPacket {
  id_brand: number;
  name: string;
}
