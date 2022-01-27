import { RowDataPacket } from 'mysql2';

export default interface ISize_type extends RowDataPacket {
  id_size_type: number;
  name: string;
}
