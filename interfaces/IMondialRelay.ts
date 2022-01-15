import { RowDataPacket } from 'mysql2';

export default interface IMondialRelay extends RowDataPacket {
  name: string;
  weight: string;
  price: number;
}
