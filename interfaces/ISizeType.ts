import { RowDataPacket } from 'mysql2';

export default interface ISizeType extends RowDataPacket {
  id_size_type: number;
  name: string;
}
