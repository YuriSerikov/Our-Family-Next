import { IPersonCard } from "./psnCardType";
import { IcouplesWithoutKids } from "./couplesWithoutKidsType";

export interface IReturnObj {
    arrIcons: IPersonCard[],
    loading: boolean,
    arrCouplesWithoutKids: IcouplesWithoutKids[]
}