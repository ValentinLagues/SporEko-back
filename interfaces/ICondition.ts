import { RowDataPacket } from 'mysql2';

export default interface ICondition extends RowDataPacket {
  name: string;
}