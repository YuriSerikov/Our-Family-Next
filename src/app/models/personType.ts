import { StaticImageData } from "next/image";

export interface IPerson {
    id: number,
    labels: string[],
    alive?: boolean,
    birthday?: string,
    birthplace?: string,
    icon?: string | StaticImageData,
    job?: string,
    lastday?: string,
    firstname?: string, 
    lastname: string,
    longname: string,
    maidenname?: string,
    name?: string,
    surname?: string,
    profile?: string
}