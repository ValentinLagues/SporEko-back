import { RowDataPacket } from 'mysql2';

export default interface IColor extends RowDataPacket {
  id_color: number;
  name: string;
  color_code: string;
}
