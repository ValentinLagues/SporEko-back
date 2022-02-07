import { RowDataPacket } from 'mysql2';

export default interface ICondition extends RowDataPacket {
  id_condition: number;
  name: string;
}
