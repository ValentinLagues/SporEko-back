import { RowDataPacket } from 'mysql2';

export default interface IChild extends RowDataPacket {
  id_child: number;
  name: string;
}
