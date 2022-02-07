import { RowDataPacket } from 'mysql2';

export default interface IOfferDeliverer extends RowDataPacket {
  id_offer_deliverer: number;
  id_offer: number;
  id_deliverer: number;
}
