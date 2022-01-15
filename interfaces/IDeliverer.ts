import { RowDataPacket } from 'mysql2';

export default interface IDeliverer extends RowDataPacket {
  name: string;
}
