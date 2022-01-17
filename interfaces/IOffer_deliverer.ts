import { RowDataPacket } from 'mysql2';

export default interface IOffer_deliverer extends RowDataPacket {
<<<<<<< HEAD
  idoffer_deliverer: number;
=======
  id_offer_deliverer: number;
>>>>>>> 370f8001eac8a7718fdbaad86b0d3b0755bdd2eb
  id_offer: number;
  id_deliverer: number;
}
