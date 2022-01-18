import { RowDataPacket } from 'mysql2';

export default interface ISize extends RowDataPacket {
  id_size: number;
  name: string;
  is_child: number;
}
