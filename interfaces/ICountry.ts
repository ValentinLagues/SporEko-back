import { RowDataPacket } from 'mysql2';

export default interface ICountry extends RowDataPacket {
  id_country: number;
  name: string;
}
