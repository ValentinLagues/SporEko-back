import { RowDataPacket } from 'mysql2';

export default interface IOffer extends RowDataPacket {
  id_offer: number;
  creation_date: string;
  title: string;
  picture1: string;
  price: number;
  description: string;
  id_sport: number;
  id_size: number;
  id_condition: number;
  id_brand: number;
  id_category: number;
  id_color: number;
  id_textile: number;
  id_user_seller: number;
  isarchived: number;
  ischildren: number;
  id_user_buyer: number;
  purchase_date: string;
  rating_for_seller: number;
  title_comment_rating_for_seller: string;
  comment_rating_for_seller: string;
  answer_from_seller: string;
  rating_for_buyer: number;
  title_comment_rating_for_buyer: string;
  comment_rating_for_buyer: string;
  answer_from_buyer: string;
  hand_delivery: number;
  colissimo_delivery: number;
  id_colissimo: number;
  mondial_relay_delivery: number;
  id_mondial_relay: number;
  picture2: string;
  picture3: string;
  picture4: string;
  picture5: string;
  picture6: string;
  picture7: string;
  picture8: string;
  picture9: string;
  picture10: string;
  picture11: string;
  picture12: string;
  picture13: string;
  picture14: string;
}
